<?php

namespace App\AiGateway;

use App\AiGateway\Contracts\AiProvider;
use App\AiGateway\Providers\ClaudeProvider;
use App\AiGateway\Providers\NullAiProvider;
use App\AiGateway\Providers\OpenAiProvider;
use App\Enums\AiTier;
use App\Models\AiGatewayLog;
use App\Models\User;
use Throwable;

// The single choke point every AI-touching feature must call through — no
// other module may call OpenAI/Claude directly (AI Safety Principle 8).
class AiGateway
{
    public function __construct(private PromptLibrary $prompts) {}

    /**
     * Render a prompt, run it through the tier's configured provider, and log
     * the request/response for audit (AI Safety Principle 3) regardless of
     * outcome.
     */
    public function complete(AiTier $tier, string $promptKey, array $variables = [], ?User $user = null): AiGatewayLog
    {
        $prompt = $this->prompts->render($promptKey, $variables);
        $tierConfig = config("ai.tiers.{$tier->value}");

        $output = null;
        $status = 'success';
        $error = null;

        // Provider resolution lives inside the try too — a misconfigured
        // provider (unknown name, missing API key) must still produce an
        // audit row, not fail silently before logging ever runs.
        try {
            $provider = $this->resolveProvider($tierConfig['provider']);
            $output = $provider->complete($prompt, $tierConfig['model']);
        } catch (Throwable $e) {
            $status = 'error';
            $error = $e;
        }

        $log = AiGatewayLog::create([
            'user_id' => $user?->id,
            'tier' => $tier,
            'provider' => $tierConfig['provider'],
            'model' => $tierConfig['model'],
            'prompt_key' => $promptKey,
            'output' => $output,
            'status' => $status,
        ]);

        if ($error) {
            throw new \RuntimeException("AI Gateway request failed for prompt [{$promptKey}]", previous: $error);
        }

        return $log;
    }

    private function resolveProvider(string $name): AiProvider
    {
        return match ($name) {
            'null' => new NullAiProvider,
            'openai' => new OpenAiProvider(config('ai.providers.openai.api_key')),
            'claude' => new ClaudeProvider(config('ai.providers.claude.api_key')),
            default => throw new \InvalidArgumentException("Unknown AI provider [{$name}]"),
        };
    }
}
