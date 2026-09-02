<?php

use App\Enums\UserRole;
use App\Models\AssessmentAttempt;
use App\Models\LessonProgress;
use App\Models\User;

test('a parent can view their own linked student\'s progress and attempts', function () {
    $parent = User::factory()->create(['role' => UserRole::Parent]);
    $student = User::factory()->create(['role' => UserRole::Student]);
    $parent->students()->attach($student->id, ['status' => 'active']);

    LessonProgress::factory()->completed()->create(['user_id' => $student->id]);
    AssessmentAttempt::factory()->completed(90)->create(['user_id' => $student->id]);

    $this->actingAs($parent, 'sanctum')
        ->getJson("/api/v1/students/{$student->id}/progress")
        ->assertOk()
        ->assertJsonCount(1, 'data');

    $this->actingAs($parent, 'sanctum')
        ->getJson("/api/v1/students/{$student->id}/attempts")
        ->assertOk()
        ->assertJsonPath('data.0.score', 90);
});

test('a parent cannot view a student they are not linked to', function () {
    $parent = User::factory()->create(['role' => UserRole::Parent]);
    $otherStudent = User::factory()->create(['role' => UserRole::Student]);

    $this->actingAs($parent, 'sanctum')
        ->getJson("/api/v1/students/{$otherStudent->id}/progress")
        ->assertForbidden();
});

test('a student can view their own progress', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);
    LessonProgress::factory()->create(['user_id' => $student->id]);

    $this->actingAs($student, 'sanctum')
        ->getJson("/api/v1/students/{$student->id}/progress")
        ->assertOk()
        ->assertJsonCount(1, 'data');
});
