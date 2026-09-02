<?php

use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\Question;

test('an assessment orders its attached questions', function () {
    $assessment = Assessment::factory()->create();
    $second = Question::factory()->create();
    $first = Question::factory()->create();

    $assessment->questions()->attach([
        $second->id => ['order' => 2],
        $first->id => ['order' => 1],
    ]);

    expect($assessment->questions->pluck('id')->all())->toBe([$first->id, $second->id]);
});

test('publishing a new assessment version supersedes the old one', function () {
    $original = Assessment::factory()->published()->create();

    $revision = Assessment::factory()->create([
        'topic_id' => $original->topic_id,
        'supersedes_id' => $original->id,
    ]);

    expect($original->fresh()->supersededBy->id)->toBe($revision->id);
    expect($revision->supersedes->id)->toBe($original->id);
});

test('an attempt starts unscored and can be completed', function () {
    $attempt = AssessmentAttempt::factory()->create();

    expect($attempt->isCompleted())->toBeFalse();

    $attempt = AssessmentAttempt::factory()->completed(80)->create();

    expect($attempt->isCompleted())->toBeTrue();
    expect($attempt->score)->toBe(80);
    expect($attempt->user)->not->toBeNull();
    expect($attempt->assessment)->not->toBeNull();
});

test('a user can attempt the same assessment more than once', function () {
    $attempt = AssessmentAttempt::factory()->create();

    $second = AssessmentAttempt::factory()->create([
        'user_id' => $attempt->user_id,
        'assessment_id' => $attempt->assessment_id,
    ]);

    expect($second->id)->not->toBe($attempt->id);
});
