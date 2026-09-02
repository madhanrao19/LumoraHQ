<?php

namespace App\AiGateway\Agents;

use App\AiGateway\AiGateway;
use App\Enums\AiTier;
use App\Enums\ContentStatus;
use App\Models\Question;
use App\Models\Topic;
use App\Models\User;

// Drafts a question's wording from a brief. The correct answer and options
// are supplied by the caller, never invented by AI — Safety Principle 4
// (must not fabricate curriculum facts) puts factual correctness on a human,
// not the model. Output is always a Draft (Safety Principle 2).
class QuizDraftingAgent
{
    public function __construct(private AiGateway $gateway) {}

    public function draft(
        Topic $topic,
        string $type,
        array $options,
        string $answer,
        string $brief,
        ?User $author = null,
    ): Question {
        $log = $this->gateway->complete(AiTier::Economical, 'quiz-draft', [
            'topic' => $topic->name,
            'brief' => $brief,
        ], $author);

        return Question::create([
            'topic_id' => $topic->id,
            'type' => $type,
            'prompt' => $log->output,
            'options' => $options,
            'answer' => $answer,
            'status' => ContentStatus::Draft,
        ]);
    }
}
