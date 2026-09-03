<?php

namespace App\AiGateway\Providers;

use App\AiGateway\Contracts\AiProvider;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use RuntimeException;

// Real OpenAI Chat Completions provider. Selected via AI_*_PROVIDER=openai
// (config/ai.php) — swap-in replacement for NullAiProvider, same contract.
class OpenAiProvider implements AiProvider
{
    public function __construct(private readonly ?string $apiKey)
    {
        if (! $this->apiKey) {
            throw new RuntimeException('OpenAI provider selected but OPENAI_API_KEY is not set.');
        }
    }

    public function complete(string $prompt, ?string $model = null): string
    {
        if (! $model) {
            throw new InvalidArgumentException(
                'OpenAI provider requires a model — set the tier\'s AI_*_MODEL env var (config/ai.php).',
            );
        }

        $response = Http::withToken($this->apiKey)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
            ])
            ->throw();

        return $response->json('choices.0.message.content');
    }
}
