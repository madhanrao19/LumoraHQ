<?php

namespace App\AiGateway\Providers;

use App\AiGateway\Contracts\AiProvider;

// Default provider until real OpenAI/Claude API credentials exist. Lets the
// Gateway's routing, prompt rendering, and audit logging be built and tested
// end-to-end before any real provider is wired in.
class NullAiProvider implements AiProvider
{
    public function complete(string $prompt, ?string $model = null): string
    {
        return "[null-provider] {$prompt}";
    }
}
