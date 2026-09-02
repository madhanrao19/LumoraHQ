<?php

namespace App\AiGateway;

use App\AiGateway\Contracts\AiProvider;
use App\AiGateway\Providers\NullAiProvider;
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
        $provider = $this->resolveProvider($tierConfig['provider']);

        $output = null;
        $status = 'success';
        $error = null;

        try {
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
            default => throw new \InvalidArgumentException("Unknown AI provider [{$name}]"),
        };
    }
}
