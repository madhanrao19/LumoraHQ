<?php

namespace App\Models;

use App\Enums\ContentStatus;
use App\Models\Concerns\SyncsRagIndex;
use Database\Factories\LessonFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['topic_id', 'supersedes_id', 'title', 'slug', 'body', 'status', 'is_rag_indexable', 'published_at'])]
class Lesson extends Model
{
    /** @use HasFactory<LessonFactory> */
    use HasFactory, SyncsRagIndex;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'is_rag_indexable' => true,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ContentStatus::class,
            'is_rag_indexable' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    /**
     * The published version this lesson replaced, per ADR-0024 (supersede, don't overwrite).
     */
    public function supersedes(): BelongsTo
    {
        return $this->belongsTo(self::class, 'supersedes_id');
    }

    /**
     * The newer version that superseded this one, if any.
     */
    public function supersededBy(): HasOne
    {
        return $this->hasOne(self::class, 'supersedes_id');
    }
}
