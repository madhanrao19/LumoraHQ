<?php

use App\Enums\ContentStatus;
use App\Models\Question;
use App\Models\Topic;

test('question stores options and answer as arrays', function () {
    $question = Question::factory()->create();

    expect($question->topic)->not->toBeNull();
    expect($question->options)->toBeArray();
    expect($question->status)->toBe(ContentStatus::Draft);
});

test('publishing a new question version supersedes the old one', function () {
    $topic = Topic::factory()->create();
    $original = Question::factory()->for($topic)->published()->create();

    $revision = Question::factory()->for($topic)->create([
        'supersedes_id' => $original->id,
    ]);

    expect($original->fresh()->supersededBy->id)->toBe($revision->id);
    expect($revision->supersedes->id)->toBe($original->id);
});
