<?php

use App\Enums\UserRole;
use App\Models\Assessment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use App\Models\User;

test('subjects and topics are publicly listable', function () {
    $subject = Subject::factory()->create();
    Subject::factory()->create();
    Topic::factory()->for($subject)->create();

    $this->getJson('/api/v1/subjects')->assertOk()->assertJsonCount(2, 'data');
    $this->getJson('/api/v1/topics')->assertOk()->assertJsonCount(1, 'data');
});

test('only published lessons are visible', function () {
    $topic = Topic::factory()->create();
    Lesson::factory()->for($topic)->create();
    $published = Lesson::factory()->for($topic)->published()->create();

    $response = $this->getJson("/api/v1/topics/{$topic->id}/lessons")->assertOk();
    $response->assertJsonCount(1, 'data');

    $this->getJson("/api/v1/lessons/{$published->id}")->assertOk();
});

test('an unpublished lesson 404s on show', function () {
    $lesson = Lesson::factory()->create();

    $this->getJson("/api/v1/lessons/{$lesson->id}")->assertNotFound();
});

test('a student can mark a lesson complete but a parent cannot', function () {
    $lesson = Lesson::factory()->published()->create();
    $student = User::factory()->create(['role' => UserRole::Student]);
    $parent = User::factory()->create(['role' => UserRole::Parent]);

    $this->actingAs($student, 'sanctum')
        ->postJson("/api/v1/lessons/{$lesson->id}/progress")
        ->assertCreated();

    expect(LessonProgress::where('user_id', $student->id)->where('lesson_id', $lesson->id)->first()->isCompleted())->toBeTrue();

    $this->actingAs($parent, 'sanctum')
        ->postJson("/api/v1/lessons/{$lesson->id}/progress")
        ->assertForbidden();
});

test('assessment show hides answers', function () {
    $topic = Topic::factory()->create();
    $question = Question::factory()->for($topic)->published()->create(['answer' => 'A']);
    $assessment = Assessment::factory()->for($topic)->published()->create();
    $assessment->questions()->attach($question->id, ['order' => 1]);

    $response = $this->getJson("/api/v1/assessments/{$assessment->id}")->assertOk();

    $response->assertJsonPath('data.questions.0.prompt', $question->prompt);
    $response->assertJsonMissingPath('data.questions.0.answer');
});

test('an attempt is scored against published questions and only the student sees their own', function () {
    $topic = Topic::factory()->create();
    $question = Question::factory()->for($topic)->published()->create(['answer' => 'A']);
    $assessment = Assessment::factory()->for($topic)->published()->create();
    $assessment->questions()->attach($question->id, ['order' => 1]);

    $student = User::factory()->create(['role' => UserRole::Student]);
    $otherStudent = User::factory()->create(['role' => UserRole::Student]);

    $this->actingAs($student, 'sanctum')
        ->postJson("/api/v1/assessments/{$assessment->id}/attempts", [
            'responses' => [$question->id => 'A'],
        ])
        ->assertCreated()
        ->assertJsonPath('data.score', 100);

    $this->actingAs($otherStudent, 'sanctum')
        ->postJson("/api/v1/assessments/{$assessment->id}/attempts", [
            'responses' => [$question->id => 'B'],
        ])
        ->assertCreated()
        ->assertJsonPath('data.score', 0);

    $this->actingAs($student, 'sanctum')
        ->getJson("/api/v1/assessments/{$assessment->id}/attempts")
        ->assertOk()
        ->assertJsonCount(1, 'data');
});
