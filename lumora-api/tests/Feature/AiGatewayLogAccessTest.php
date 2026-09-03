<?php

use App\Enums\UserRole;
use App\Models\AiGatewayLog;
use App\Models\User;

test('an admin can view any student\'s audit log, including one they have no link to', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $studentA = User::factory()->create(['role' => UserRole::Student]);
    $studentB = User::factory()->create(['role' => UserRole::Student]);
    AiGatewayLog::factory()->create(['user_id' => $studentA->id]);
    AiGatewayLog::factory()->count(2)->create(['user_id' => $studentB->id]);

    $this->actingAs($admin, 'sanctum')
        ->getJson("/api/v1/students/{$studentA->id}/audit-logs")
        ->assertOk()
        ->assertJsonCount(1, 'data');

    $this->actingAs($admin, 'sanctum')
        ->getJson("/api/v1/students/{$studentB->id}/audit-logs")
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

test('a parent can view their own linked student\'s audit log, but not another student\'s', function () {
    $parent = User::factory()->create(['role' => UserRole::Parent]);
    $student = User::factory()->create(['role' => UserRole::Student]);
    $otherStudent = User::factory()->create(['role' => UserRole::Student]);
    $parent->students()->attach($student->id, ['status' => 'active']);
    AiGatewayLog::factory()->create(['user_id' => $student->id]);
    AiGatewayLog::factory()->create(['user_id' => $otherStudent->id]);

    $this->actingAs($parent, 'sanctum')
        ->getJson("/api/v1/students/{$student->id}/audit-logs")
        ->assertOk()
        ->assertJsonCount(1, 'data');

    $this->actingAs($parent, 'sanctum')
        ->getJson("/api/v1/students/{$otherStudent->id}/audit-logs")
        ->assertForbidden();
});

test('a student cannot view their own audit log', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);
    AiGatewayLog::factory()->create(['user_id' => $student->id]);

    $this->actingAs($student, 'sanctum')
        ->getJson("/api/v1/students/{$student->id}/audit-logs")
        ->assertForbidden();
});
