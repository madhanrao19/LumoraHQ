<?php

namespace App\Models\Concerns;

use App\Enums\ContentStatus;
use App\Models\RagDocument;

// Publishing content makes it RAG-eligible automatically; unpublishing,
// superseding, or opting out removes it — no separate manual indexing step
// (ADR-0022). Shared by Lesson and Question, the two content-bearing models.
trait SyncsRagIndex
{
    protected static function bootSyncsRagIndex(): void
    {
        static::saved(function ($model) {
            if ($model->status === ContentStatus::Published && $model->is_rag_indexable) {
                RagDocument::updateOrCreate(
                    ['documentable_type' => static::class, 'documentable_id' => $model->id],
                    ['indexed_at' => now()],
                );

                return;
            }

            RagDocument::where('documentable_type', static::class)
                ->where('documentable_id', $model->id)
                ->delete();
        });

        static::deleted(function ($model) {
            RagDocument::where('documentable_type', static::class)
                ->where('documentable_id', $model->id)
                ->delete();
        });
    }
}
