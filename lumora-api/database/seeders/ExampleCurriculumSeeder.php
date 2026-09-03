<?php

namespace Database\Seeders;

use App\Enums\ContentStatus;
use App\Models\Assessment;
use App\Models\GradeLevel;
use App\Models\Lesson;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use Illuminate\Database\Seeder;

// Original example curriculum content — written directly (not copied from
// any textbook, workbook, or exam paper, per lumora-docs/CLAUDE.md), left
// in Draft status so the existing review workflow (ADR-0024, AI Safety
// Principle 2: a human reviews before publish) still applies before any of
// this reaches a real student. This is standing in for real Malaysian
// curriculum content authored by a subject-matter expert — that's still a
// genuinely open Tier 1 item this seeder doesn't resolve, just unblocks
// functional/demo testing until it's addressed for real.
//
// Not wired into DatabaseSeeder — run explicitly:
//   php artisan db:seed --class=Database\\Seeders\\ExampleCurriculumSeeder
class ExampleCurriculumSeeder extends Seeder
{
    public function run(): void
    {
        $mathematics = Subject::create(['name' => 'Mathematics', 'slug' => 'mathematics', 'order' => 1]);
        $science = Subject::create(['name' => 'Science', 'slug' => 'science', 'order' => 2]);

        $grade3 = GradeLevel::create(['name' => 'Grade 3', 'slug' => 'grade-3', 'order' => 3]);
        $grade4 = GradeLevel::create(['name' => 'Grade 4', 'slug' => 'grade-4', 'order' => 4]);

        $this->fractions($mathematics, $grade4);
        $this->multiplication($mathematics, $grade3);
        $this->photosynthesis($science, $grade4);
        $this->statesOfMatter($science, $grade3);
    }

    private function fractions(Subject $subject, GradeLevel $grade): void
    {
        $topic = Topic::create([
            'subject_id' => $subject->id,
            'grade_level_id' => $grade->id,
            'name' => 'Fractions',
            'slug' => 'fractions',
            'order' => 1,
        ]);

        Lesson::create([
            'topic_id' => $topic->id,
            'title' => 'Understanding Fractions',
            'slug' => 'understanding-fractions',
            'status' => ContentStatus::Draft,
            'body' => <<<'BODY'
A fraction is a way of describing part of a whole. When you cut a pizza into 4 equal slices and take 1 slice, you have taken 1/4 (one quarter) of the pizza.

Every fraction has two numbers. The bottom number, called the denominator, tells you how many equal parts the whole was split into. The top number, called the numerator, tells you how many of those parts you have.

In the fraction 3/4, the denominator is 4 — the whole was split into 4 equal parts — and the numerator is 3, meaning you have 3 of those 4 parts.

Fractions with the same denominator are easy to compare and add. If two fractions both have a denominator of 5, the one with the bigger numerator is the bigger fraction: 4/5 is more than 2/5. To add them, just add the numerators and keep the denominator the same: 1/5 + 2/5 = 3/5.

A fraction where the numerator and denominator are the same, like 4/4, equals a whole 1. A fraction bigger than 1, like 5/4, means you have more than one whole — in this case, one whole plus an extra quarter.
BODY,
        ]);

        $assessment = Assessment::create([
            'topic_id' => $topic->id,
            'title' => 'Fractions Check',
            'status' => ContentStatus::Draft,
        ]);

        $q1 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'multiple_choice',
            'prompt' => 'A cake is cut into 8 equal slices. You eat 3 slices. What fraction of the cake did you eat?',
            'options' => ['A' => '3/8', 'B' => '8/3', 'C' => '3/5', 'D' => '5/8'],
            'answer' => 'A',
            'explanation' => 'The cake was split into 8 equal parts (the denominator), and you ate 3 of them (the numerator), so you ate 3/8 of the cake.',
            'status' => ContentStatus::Draft,
        ]);

        $q2 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'multiple_choice',
            'prompt' => 'Which fraction is the largest?',
            'options' => ['A' => '2/6', 'B' => '5/6', 'C' => '1/6', 'D' => '3/6'],
            'answer' => 'B',
            'explanation' => 'All four fractions share the same denominator (6), so the one with the biggest numerator is the largest: 5/6.',
            'status' => ContentStatus::Draft,
        ]);

        $q3 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'short_answer',
            'prompt' => 'What do you call the top number in a fraction?',
            'options' => null,
            'answer' => 'numerator',
            'explanation' => 'The top number, which shows how many parts you have, is called the numerator.',
            'status' => ContentStatus::Draft,
        ]);

        $assessment->questions()->attach([
            $q1->id => ['order' => 1],
            $q2->id => ['order' => 2],
            $q3->id => ['order' => 3],
        ]);
    }

    private function multiplication(Subject $subject, GradeLevel $grade): void
    {
        $topic = Topic::create([
            'subject_id' => $subject->id,
            'grade_level_id' => $grade->id,
            'name' => 'Multiplication',
            'slug' => 'multiplication',
            'order' => 2,
        ]);

        Lesson::create([
            'topic_id' => $topic->id,
            'title' => 'Multiplying Whole Numbers',
            'slug' => 'multiplying-whole-numbers',
            'status' => ContentStatus::Draft,
            'body' => <<<'BODY'
Multiplication is a fast way of adding the same number over and over. If you have 4 bags with 3 apples in each bag, you could count them by adding 3 + 3 + 3 + 3, or you could multiply: 4 × 3.

Both give the same answer, 12, but multiplication is much quicker once the numbers get bigger. Nobody wants to add 3 together twenty times to find 20 × 3 — it's much faster to know the multiplication fact.

In a multiplication like 4 × 3 = 12, the two numbers being multiplied (4 and 3) are called factors, and the answer (12) is called the product.

Multiplication also works the other way around: 4 × 3 gives the same answer as 3 × 4. This is called the commutative property — you can swap the order of the factors and the product stays the same. That means once you know 4 × 3 = 12, you already know 3 × 4 = 12 too, without having to work it out again.
BODY,
        ]);

        $assessment = Assessment::create([
            'topic_id' => $topic->id,
            'title' => 'Multiplication Check',
            'status' => ContentStatus::Draft,
        ]);

        $q1 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'multiple_choice',
            'prompt' => 'There are 5 boxes with 6 pencils in each box. How many pencils are there in total?',
            'options' => ['A' => '11', 'B' => '25', 'C' => '30', 'D' => '35'],
            'answer' => 'C',
            'explanation' => '5 boxes of 6 pencils each is 5 × 6 = 30 pencils.',
            'status' => ContentStatus::Draft,
        ]);

        $q2 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'short_answer',
            'prompt' => 'What is 7 × 8?',
            'options' => null,
            'answer' => '56',
            'explanation' => '7 groups of 8 (or 8 groups of 7) totals 56.',
            'status' => ContentStatus::Draft,
        ]);

        $assessment->questions()->attach([
            $q1->id => ['order' => 1],
            $q2->id => ['order' => 2],
        ]);
    }

    private function photosynthesis(Subject $subject, GradeLevel $grade): void
    {
        $topic = Topic::create([
            'subject_id' => $subject->id,
            'grade_level_id' => $grade->id,
            'name' => 'Plants and Photosynthesis',
            'slug' => 'plants-and-photosynthesis',
            'order' => 1,
        ]);

        Lesson::create([
            'topic_id' => $topic->id,
            'title' => 'How Plants Make Their Own Food',
            'slug' => 'how-plants-make-their-own-food',
            'status' => ContentStatus::Draft,
            'body' => <<<'BODY'
Unlike people and animals, plants don't need to eat food to survive — they make their own, in a process called photosynthesis.

Plants make their food using three main ingredients: sunlight, water, and carbon dioxide (a gas found in the air). Their leaves contain a green substance called chlorophyll, which captures sunlight the way a solar panel does. Chlorophyll is also what gives most leaves their green color.

Using the energy captured from sunlight, the plant combines water (soaked up through its roots) with carbon dioxide (taken in through tiny holes in its leaves) to make glucose, a type of sugar the plant uses as food and energy. As a byproduct of this process, the plant releases oxygen into the air — the same oxygen that people and animals breathe.

This is why plants are so important to life on Earth: photosynthesis doesn't just feed the plant, it also produces the oxygen that most other living things need to survive.
BODY,
        ]);

        $assessment = Assessment::create([
            'topic_id' => $topic->id,
            'title' => 'Photosynthesis Check',
            'status' => ContentStatus::Draft,
        ]);

        $q1 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'multiple_choice',
            'prompt' => 'What substance in a plant\'s leaves captures sunlight?',
            'options' => ['A' => 'Glucose', 'B' => 'Chlorophyll', 'C' => 'Carbon dioxide', 'D' => 'Oxygen'],
            'answer' => 'B',
            'explanation' => 'Chlorophyll is the green substance in leaves that captures sunlight for photosynthesis.',
            'status' => ContentStatus::Draft,
        ]);

        $q2 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'multiple_choice',
            'prompt' => 'Which gas do plants release during photosynthesis?',
            'options' => ['A' => 'Carbon dioxide', 'B' => 'Nitrogen', 'C' => 'Oxygen', 'D' => 'Hydrogen'],
            'answer' => 'C',
            'explanation' => 'Plants release oxygen as a byproduct of photosynthesis.',
            'status' => ContentStatus::Draft,
        ]);

        $q3 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'short_answer',
            'prompt' => 'Name the three main ingredients a plant needs for photosynthesis.',
            'options' => null,
            'answer' => 'sunlight, water, carbon dioxide',
            'explanation' => 'Photosynthesis needs sunlight (captured by chlorophyll), water (from the roots), and carbon dioxide (from the air).',
            'status' => ContentStatus::Draft,
        ]);

        $assessment->questions()->attach([
            $q1->id => ['order' => 1],
            $q2->id => ['order' => 2],
            $q3->id => ['order' => 3],
        ]);
    }

    private function statesOfMatter(Subject $subject, GradeLevel $grade): void
    {
        $topic = Topic::create([
            'subject_id' => $subject->id,
            'grade_level_id' => $grade->id,
            'name' => 'States of Matter',
            'slug' => 'states-of-matter',
            'order' => 2,
        ]);

        Lesson::create([
            'topic_id' => $topic->id,
            'title' => 'Solids, Liquids, and Gases',
            'slug' => 'solids-liquids-and-gases',
            'status' => ContentStatus::Draft,
            'body' => <<<'BODY'
Everything around you is made of matter, and matter usually exists in one of three states: solid, liquid, or gas.

A solid, like a rock or an ice cube, has a fixed shape and a fixed volume — it doesn't change shape unless you apply force to it, and it stays the same size no matter what container it's in.

A liquid, like water or juice, has a fixed volume but no fixed shape — it takes the shape of whatever container you pour it into, but the amount of liquid stays the same.

A gas, like the air around you or steam from a boiling kettle, has neither a fixed shape nor a fixed volume — it spreads out to fill whatever space it's in, expanding or being compressed as needed.

Many substances can change between these states. Water is a good example: as ice (solid), it melts into liquid water when warmed, and that water turns into water vapor (gas) when it boils. Cooling water vapor turns it back into liquid water, and freezing that water turns it back into ice — the same substance, just in different states depending on its temperature.
BODY,
        ]);

        $assessment = Assessment::create([
            'topic_id' => $topic->id,
            'title' => 'States of Matter Check',
            'status' => ContentStatus::Draft,
        ]);

        $q1 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'multiple_choice',
            'prompt' => 'Which state of matter has a fixed volume but takes the shape of its container?',
            'options' => ['A' => 'Solid', 'B' => 'Liquid', 'C' => 'Gas', 'D' => 'None of these'],
            'answer' => 'B',
            'explanation' => 'A liquid keeps the same volume but takes the shape of whatever container holds it.',
            'status' => ContentStatus::Draft,
        ]);

        $q2 = Question::create([
            'topic_id' => $topic->id,
            'type' => 'short_answer',
            'prompt' => 'What is it called when a solid changes into a liquid by warming?',
            'options' => null,
            'answer' => 'melting',
            'explanation' => 'Warming a solid until it turns into a liquid is called melting.',
            'status' => ContentStatus::Draft,
        ]);

        $assessment->questions()->attach([
            $q1->id => ['order' => 1],
            $q2->id => ['order' => 2],
        ]);
    }
}
