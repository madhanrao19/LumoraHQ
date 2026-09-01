<?php

use App\Models\User;

test('a parent can create a student, linked to themselves', function () {
    $parent = User::factory()->parent()->create();

    $response = $this->actingAs($parent, 'sanctum')->postJson('/api/v1/students', [
        'name' => 'Sam Student',
        'email' => 'sam@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated()->assertJsonPath('data.role', 'student');

    $student = User::where('email', 'sam@example.com')->first();
    expect($parent->students()->whereKey($student->id)->exists())->toBeTrue();
});

test('a student cannot create a student', function () {
    $student = User::factory()->student()->create();

    $response = $this->actingAs($student, 'sanctum')->postJson('/api/v1/students', [
        'name' => 'Sam Student',
        'email' => 'sam@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertForbidden();
});

test('a parent can view their own student', function () {
    $parent = User::factory()->parent()->create();
    $student = User::factory()->student()->create();
    $parent->students()->attach($student->id, ['status' => 'active']);

    expect($parent->can('view', $student))->toBeTrue();
});

test('a parent cannot view another parent\'s student', function () {
    $parentA = User::factory()->parent()->create();
    $parentB = User::factory()->parent()->create();
    $studentOfB = User::factory()->student()->create();
    $parentB->students()->attach($studentOfB->id, ['status' => 'active']);

    expect($parentA->can('view', $studentOfB))->toBeFalse();
});

test('a parent sees only their own students in the index', function () {
    $parentA = User::factory()->parent()->create();
    $parentB = User::factory()->parent()->create();
    $studentOfA = User::factory()->student()->create();
    $studentOfB = User::factory()->student()->create();
    $parentA->students()->attach($studentOfA->id, ['status' => 'active']);
    $parentB->students()->attach($studentOfB->id, ['status' => 'active']);

    $response = $this->actingAs($parentA, 'sanctum')->getJson('/api/v1/students');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $studentOfA->id);
});
