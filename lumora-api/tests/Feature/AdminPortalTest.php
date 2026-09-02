<?php

use App\Enums\ContentStatus;
use App\Enums\UserRole;
use App\Filament\Support\ContentLifecycleActions;
use App\Models\Assessment;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;

test('only an admin can access the Filament panel', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $student = User::factory()->create(['role' => UserRole::Student]);

    $this->actingAs($admin)->get('/admin/lessons')->assertOk();
    $this->actingAs($student)->get('/admin/lessons')->assertForbidden();
});

test('every resource index page renders for an admin', function (string $page) {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    $this->actingAs($admin)->get("/admin/{$page}")->assertOk();
})->with([
    'users', 'subjects', 'grade-levels', 'topics',
    'lessons', 'questions', 'assessments',
    'lesson-progress', 'assessment-attempts',
    'lessons/create', 'questions/create', 'assessments/create',
]);

test('publishing a lesson supersedes the version it replaces', function () {
    $original = Lesson::factory()->published()->create();
    $revision = Lesson::factory()->for($original->topic)->create(['supersedes_id' => $original->id]);

    ContentLifecycleActions::applyPublish($revision);

    expect($revision->fresh()->status)->toBe(ContentStatus::Published);
    expect($original->fresh()->status)->toBe(ContentStatus::Superseded);
});

test('revising a published question creates a linked draft copy', function () {
    $published = Question::factory()->published()->create(['prompt' => 'Original prompt']);

    $revision = ContentLifecycleActions::applyRevision($published);

    expect($revision->status)->toBe(ContentStatus::Draft);
    expect($revision->supersedes_id)->toBe($published->id);
    expect($revision->prompt)->toBe('Original prompt');
    expect($published->fresh()->status)->toBe(ContentStatus::Published);
});

test('revising a published assessment carries over its attached questions', function () {
    $topic = Topic::factory()->create();
    $question = Question::factory()->for($topic)->published()->create();
    $assessment = Assessment::factory()->for($topic)->published()->create();
    $assessment->questions()->attach($question->id, ['order' => 1]);

    $revision = ContentLifecycleActions::applyRevision($assessment);

    expect($revision->questions->pluck('id')->all())->toBe([$question->id]);
});
