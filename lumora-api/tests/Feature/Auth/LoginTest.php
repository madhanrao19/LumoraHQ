<?php

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

test('a user can log in with correct credentials and receives a token', function () {
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'jane@example.com',
        'password' => 'password',
    ]);

    $response->assertOk()->assertJsonStructure(['data' => ['id', 'name', 'email', 'role'], 'token']);
});

test('login fails with incorrect credentials', function () {
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'jane@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors('email');
});

test('an authenticated user can fetch their own profile via /me', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/me');

    $response->assertOk()->assertJsonPath('data.id', $user->id);
});

test('logout deletes the current personal access token', function () {
    $user = User::factory()->create();
    $token = $user->createToken('api')->plainTextToken;

    expect(PersonalAccessToken::count())->toBe(1);

    $response = $this->withHeader('Authorization', "Bearer {$token}")->postJson('/api/v1/logout');
    $response->assertNoContent();

    // Confirmed via Sanctum's own lookup, not just a row count: the exact
    // token this request authenticated with no longer resolves to anything.
    expect(PersonalAccessToken::findToken($token))->toBeNull();
});

test('a request with a garbage bearer token is rejected', function () {
    // Not the "logout then reuse" scenario: Laravel's Auth guard memoizes
    // the resolved user for the lifetime of the container, and that
    // memoization persists across multiple HTTP calls made within a single
    // test method (the container isn't rebuilt between them, only between
    // separate test methods) — so a same-test "log out, then retry" check
    // would pass or fail based on test-harness behavior, not app behavior.
    // A token that was never valid sidesteps that entirely.
    $response = $this->withHeader('Authorization', 'Bearer nonexistent-token-value')
        ->getJson('/api/v1/me');

    $response->assertUnauthorized();
});
