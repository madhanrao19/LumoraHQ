<?php

namespace App\AiGateway\Contracts;

// The only shape a feature can rely on — no provider-specific request/response
// types leak past this boundary (AI Safety Principle 8, provider abstraction).
interface AiProvider
{
    public function complete(string $prompt, ?string $model = null): string;
}
