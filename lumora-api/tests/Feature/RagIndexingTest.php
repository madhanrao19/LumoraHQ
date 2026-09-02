<?php

use App\Enums\ContentStatus;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\RagDocument;

test('publishing a lesson indexes it, unpublishing removes it', function () {
    $lesson = Lesson::factory()->create();

    expect(RagDocument::where('documentable_type', Lesson::class)->where('documentable_id', $lesson->id)->exists())->toBeFalse();

    $lesson->update(['status' => ContentStatus::Published, 'published_at' => now()]);

    expect(RagDocument::where('documentable_type', Lesson::class)->where('documentable_id', $lesson->id)->exists())->toBeTrue();

    $lesson->update(['status' => ContentStatus::Superseded]);

    expect(RagDocument::where('documentable_type', Lesson::class)->where('documentable_id', $lesson->id)->exists())->toBeFalse();
});

test('a published lesson opted out of RAG is never indexed', function () {
    $lesson = Lesson::factory()->create(['is_rag_indexable' => false]);

    $lesson->update(['status' => ContentStatus::Published, 'published_at' => now()]);

    expect(RagDocument::where('documentable_type', Lesson::class)->where('documentable_id', $lesson->id)->exists())->toBeFalse();
});

test('deleting a published lesson removes it from the index', function () {
    $lesson = Lesson::factory()->published()->create();

    expect(RagDocument::where('documentable_type', Lesson::class)->where('documentable_id', $lesson->id)->exists())->toBeTrue();

    $lesson->delete();

    expect(RagDocument::where('documentable_type', Lesson::class)->where('documentable_id', $lesson->id)->exists())->toBeFalse();
});

test('publishing a question indexes it the same way as a lesson', function () {
    $question = Question::factory()->published()->create();

    expect(RagDocument::where('documentable_type', Question::class)->where('documentable_id', $question->id)->exists())->toBeTrue();
});
