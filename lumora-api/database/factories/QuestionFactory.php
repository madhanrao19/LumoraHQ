<?php

namespace Database\Factories;

use App\Enums\ContentStatus;
use App\Models\Question;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $options = ['A' => fake()->word(), 'B' => fake()->word(), 'C' => fake()->word()];

        return [
            'topic_id' => Topic::factory(),
            'type' => 'multiple_choice',
            'prompt' => fake()->sentence().'?',
            'options' => $options,
            'answer' => array_key_first($options),
            'explanation' => fake()->sentence(),
            'status' => ContentStatus::Draft,
        ];
    }

    /**
     * Indicate that the question is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ContentStatus::Published,
            'published_at' => now(),
        ]);
    }
}
