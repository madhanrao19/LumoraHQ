<?php

namespace Database\Factories;

use App\Models\GradeLevel;
use App\Models\Subject;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Topic>
 */
class TopicFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'subject_id' => Subject::factory(),
            'grade_level_id' => GradeLevel::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'order' => fake()->numberBetween(0, 100),
        ];
    }
}
