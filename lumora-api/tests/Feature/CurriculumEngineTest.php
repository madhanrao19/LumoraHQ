<?php

use App\Enums\ContentStatus;
use App\Models\Lesson;
use App\Models\Topic;

test('topic belongs to a subject and grade level', function () {
    $topic = Topic::factory()->create();

    expect($topic->subject)->not->toBeNull();
    expect($topic->gradeLevel)->not->toBeNull();
});

test('publishing a new lesson version supersedes the old one', function () {
    $topic = Topic::factory()->create();
    $original = Lesson::factory()->for($topic)->published()->create();

    $revision = Lesson::factory()->for($topic)->create([
        'supersedes_id' => $original->id,
    ]);

    expect($original->fresh()->supersededBy->id)->toBe($revision->id);
    expect($revision->supersedes->id)->toBe($original->id);
    expect($original->fresh()->status)->toBe(ContentStatus::Published);
});
