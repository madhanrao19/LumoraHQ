<?php

namespace Database\Factories;

use App\Enums\ContentStatus;
use App\Models\Assessment;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Assessment>
 */
class AssessmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'topic_id' => Topic::factory(),
            'title' => fake()->unique()->sentence(3),
            'status' => ContentStatus::Draft,
        ];
    }

    /**
     * Indicate that the assessment is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ContentStatus::Published,
            'published_at' => now(),
        ]);
    }
}
