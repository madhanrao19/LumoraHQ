<?php

use App\Enums\UserRole;
use App\Models\User;

test('a parent can register and receives a token', function () {
    $response = $this->postJson('/api/v1/register', [
        'name' => 'Jane Parent',
        'email' => 'jane@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.role', 'parent')
        ->assertJsonStructure(['data' => ['id', 'name', 'email', 'role'], 'token']);

    $user = User::where('email', 'jane@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->role)->toBe(UserRole::Parent);
});

test('registration fails with a duplicate email', function () {
    User::factory()->create(['email' => 'jane@example.com']);

    $response = $this->postJson('/api/v1/register', [
        'name' => 'Jane Parent',
        'email' => 'jane@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors('email');
});
