<?php

use App\AiGateway\AiGateway;
use App\AiGateway\PromptLibrary;
use App\Enums\AiTier;
use App\Models\AiGatewayLog;
use App\Models\User;

test('prompt library renders variables from a version-controlled file', function () {
    $library = new PromptLibrary(base_path('tests/Fixtures/Prompts'));

    expect($library->render('greeting', ['name' => 'Ada']))->toBe("Hello Ada.\n");
});

test('prompt library throws for an unknown prompt key', function () {
    $library = new PromptLibrary(base_path('tests/Fixtures/Prompts'));

    $library->render('does-not-exist');
})->throws(RuntimeException::class);

test('completing a request logs an audit row via the configured tier provider', function () {
    $gateway = new AiGateway(new PromptLibrary(base_path('tests/Fixtures/Prompts')));
    $user = User::factory()->create();

    $log = $gateway->complete(AiTier::Economical, 'greeting', ['name' => 'Ada'], $user);

    expect($log)->toBeInstanceOf(AiGatewayLog::class);
    expect($log->status)->toBe('success');
    expect($log->tier)->toBe(AiTier::Economical);
    expect($log->provider)->toBe('null');
    expect($log->output)->toContain('Hello Ada.');
    expect($log->user_id)->toBe($user->id);
    $this->assertDatabaseCount('ai_gateway_logs', 1);
});

test('an unknown provider configuration throws instead of silently succeeding, and still logs an error row', function () {
    config(['ai.tiers.economical.provider' => 'bogus']);
    $gateway = new AiGateway(new PromptLibrary(base_path('tests/Fixtures/Prompts')));

    try {
        $gateway->complete(AiTier::Economical, 'greeting', ['name' => 'Ada']);
        $this->fail('Expected a RuntimeException.');
    } catch (RuntimeException $e) {
        expect($e->getPrevious())->toBeInstanceOf(InvalidArgumentException::class);
    }

    $log = AiGatewayLog::first();
    expect($log->status)->toBe('error');
    expect($log->provider)->toBe('bogus');
    expect($log->output)->toBeNull();
});
