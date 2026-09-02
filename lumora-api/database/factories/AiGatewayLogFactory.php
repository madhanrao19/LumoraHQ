<?php

namespace Database\Factories;

use App\Enums\AiTier;
use App\Models\AiGatewayLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AiGatewayLog>
 */
class AiGatewayLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tier' => AiTier::Economical,
            'provider' => 'null',
            'model' => null,
            'prompt_key' => 'test',
            'output' => fake()->sentence(),
            'status' => 'success',
        ];
    }
}
