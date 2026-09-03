<?php

namespace App\AiGateway\Providers;

use App\AiGateway\Contracts\AiProvider;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use RuntimeException;

// Real Anthropic Messages API provider. Selected via AI_*_PROVIDER=claude
// (config/ai.php) — swap-in replacement for NullAiProvider, same contract.
class ClaudeProvider implements AiProvider
{
    // ponytail: fixed response-length cap — no per-prompt token-budget policy
    // decided yet (nothing in this codebase varies it per tier/prompt-key).
    // Raise or make configurable once a real prompt needs more.
    private const MAX_TOKENS = 2048;

    private const API_VERSION = '2023-06-01';

    public function __construct(private readonly ?string $apiKey)
    {
        if (! $this->apiKey) {
            throw new RuntimeException('Claude provider selected but ANTHROPIC_API_KEY is not set.');
        }
    }

    public function complete(string $prompt, ?string $model = null): string
    {
        if (! $model) {
            throw new InvalidArgumentException(
                'Claude provider requires a model — set the tier\'s AI_*_MODEL env var (config/ai.php).',
            );
        }

        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'anthropic-version' => self::API_VERSION,
        ])
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => $model,
                'max_tokens' => self::MAX_TOKENS,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
            ])
            ->throw();

        return $response->json('content.0.text');
    }
}
