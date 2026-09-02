<?php

namespace Database\Factories;

use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AssessmentAttempt>
 */
class AssessmentAttemptFactory extends Factory
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
            'assessment_id' => Assessment::factory(),
            'responses' => null,
            'score' => null,
        ];
    }

    /**
     * Indicate that the attempt has been completed and scored.
     */
    public function completed(int $score = 100): static
    {
        return $this->state(fn (array $attributes) => [
            'score' => $score,
            'completed_at' => now(),
        ]);
    }
}
