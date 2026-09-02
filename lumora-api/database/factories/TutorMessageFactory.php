<?php

namespace Database\Factories;

use App\Enums\TutorOutcome;
use App\Models\TutorMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TutorMessage>
 */
class TutorMessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'question' => fake()->sentence().'?',
            'answer' => fake()->sentence(),
            'outcome' => TutorOutcome::Pass,
        ];
    }
}
