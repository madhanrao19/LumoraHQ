<?php

use App\AiGateway\Agents\LessonDraftingAgent;
use App\AiGateway\Agents\QuizDraftingAgent;
use App\AiGateway\AiGateway;
use App\AiGateway\PromptLibrary;
use App\Enums\AiTier;
use App\Enums\ContentStatus;
use App\Models\AiGatewayLog;
use App\Models\Topic;
use App\Models\User;

test('lesson drafting agent creates a draft lesson, never published', function () {
    $topic = Topic::factory()->create();
    $author = User::factory()->create();
    $agent = new LessonDraftingAgent(new AiGateway(new PromptLibrary));

    $lesson = $agent->draft($topic, 'Fractions', 'Explain adding fractions with like denominators.', $author);

    expect($lesson->status)->toBe(ContentStatus::Draft);
    expect($lesson->topic_id)->toBe($topic->id);
    expect($lesson->body)->toContain('Explain adding fractions with like denominators.');

    $log = AiGatewayLog::first();
    expect($log->tier)->toBe(AiTier::Economical);
    expect($log->user_id)->toBe($author->id);
});

test('quiz drafting agent creates a draft question using the caller-supplied answer', function () {
    $topic = Topic::factory()->create();
    $agent = new QuizDraftingAgent(new AiGateway(new PromptLibrary));

    $question = $agent->draft(
        topic: $topic,
        type: 'multiple_choice',
        options: ['A' => 'Paris', 'B' => 'London'],
        answer: 'A',
        brief: 'The capital of France.',
    );

    expect($question->status)->toBe(ContentStatus::Draft);
    expect($question->answer)->toBe('A');
    expect($question->options)->toBe(['A' => 'Paris', 'B' => 'London']);
    expect($question->prompt)->toContain('The capital of France.');
});
