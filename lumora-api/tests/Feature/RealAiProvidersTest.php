<?php

use App\AiGateway\AiGateway;
use App\AiGateway\PromptLibrary;
use App\AiGateway\Providers\ClaudeProvider;
use App\AiGateway\Providers\OpenAiProvider;
use App\Enums\AiTier;
use App\Models\AiGatewayLog;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

test('OpenAiProvider extracts the completion text from a real-shaped response', function () {
    Http::fake([
        'api.openai.com/*' => Http::response([
            'choices' => [
                ['message' => ['content' => 'Hello from OpenAI']],
            ],
        ]),
    ]);

    $provider = new OpenAiProvider('test-key');

    expect($provider->complete('Say hello', 'gpt-test'))->toBe('Hello from OpenAI');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.openai.com/v1/chat/completions'
            && $request->hasHeader('Authorization', 'Bearer test-key')
            && $request['model'] === 'gpt-test'
            && $request['messages'][0]['content'] === 'Say hello';
    });
});

test('OpenAiProvider throws without an API key', function () {
    new OpenAiProvider(null);
})->throws(RuntimeException::class, 'OPENAI_API_KEY');

test('OpenAiProvider throws without a model', function () {
    (new OpenAiProvider('test-key'))->complete('Say hello');
})->throws(InvalidArgumentException::class);

test('OpenAiProvider throws on an API error response', function () {
    Http::fake([
        'api.openai.com/*' => Http::response(['error' => ['message' => 'bad key']], 401),
    ]);

    (new OpenAiProvider('bad-key'))->complete('Say hello', 'gpt-test');
})->throws(RequestException::class);

test('ClaudeProvider extracts the completion text from a real-shaped response', function () {
    Http::fake([
        'api.anthropic.com/*' => Http::response([
            'content' => [
                ['type' => 'text', 'text' => 'Hello from Claude'],
            ],
        ]),
    ]);

    $provider = new ClaudeProvider('test-key');

    expect($provider->complete('Say hello', 'claude-test'))->toBe('Hello from Claude');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.anthropic.com/v1/messages'
            && $request->hasHeader('x-api-key', 'test-key')
            && $request->hasHeader('anthropic-version', '2023-06-01')
            && $request['model'] === 'claude-test'
            && $request['max_tokens'] === 2048
            && $request['messages'][0]['content'] === 'Say hello';
    });
});

test('ClaudeProvider throws without an API key', function () {
    new ClaudeProvider(null);
})->throws(RuntimeException::class, 'ANTHROPIC_API_KEY');

test('ClaudeProvider throws without a model', function () {
    (new ClaudeProvider('test-key'))->complete('Say hello');
})->throws(InvalidArgumentException::class);

test('ClaudeProvider throws on an API error response', function () {
    Http::fake([
        'api.anthropic.com/*' => Http::response(['error' => ['message' => 'bad key']], 401),
    ]);

    (new ClaudeProvider('bad-key'))->complete('Say hello', 'claude-test');
})->throws(RequestException::class);

test('AiGateway resolves the openai provider end to end and logs success', function () {
    Http::fake([
        'api.openai.com/*' => Http::response([
            'choices' => [['message' => ['content' => 'Hello from OpenAI']]],
        ]),
    ]);
    config([
        'ai.tiers.economical.provider' => 'openai',
        'ai.tiers.economical.model' => 'gpt-test',
        'ai.providers.openai.api_key' => 'test-key',
    ]);

    $gateway = new AiGateway(new PromptLibrary(base_path('tests/Fixtures/Prompts')));
    $log = $gateway->complete(AiTier::Economical, 'greeting', ['name' => 'Ada']);

    expect($log->status)->toBe('success');
    expect($log->output)->toBe('Hello from OpenAI');
});

test('AiGateway resolves the claude provider end to end and logs success', function () {
    Http::fake([
        'api.anthropic.com/*' => Http::response([
            'content' => [['type' => 'text', 'text' => 'Hello from Claude']],
        ]),
    ]);
    config([
        'ai.tiers.economical.provider' => 'claude',
        'ai.tiers.economical.model' => 'claude-test',
        'ai.providers.claude.api_key' => 'test-key',
    ]);

    $gateway = new AiGateway(new PromptLibrary(base_path('tests/Fixtures/Prompts')));
    $log = $gateway->complete(AiTier::Economical, 'greeting', ['name' => 'Ada']);

    expect($log->status)->toBe('success');
    expect($log->output)->toBe('Hello from Claude');
});

test('AiGateway logs status=error and still throws when the real provider is misconfigured', function () {
    config([
        'ai.tiers.economical.provider' => 'openai',
        'ai.tiers.economical.model' => 'gpt-test',
        'ai.providers.openai.api_key' => null,
    ]);

    $gateway = new AiGateway(new PromptLibrary(base_path('tests/Fixtures/Prompts')));

    expect(fn () => $gateway->complete(AiTier::Economical, 'greeting', ['name' => 'Ada']))
        ->toThrow(RuntimeException::class);

    // Provider construction failing (missing API key) must still produce an
    // audit row — not fail silently before logging ever runs.
    $log = AiGatewayLog::first();
    expect($log->status)->toBe('error');
    expect($log->output)->toBeNull();
});
