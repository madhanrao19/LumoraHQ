<?php

namespace App\AiGateway\Agents;

use App\AiGateway\AiGateway;
use App\Enums\AiTier;
use App\Enums\ContentStatus;
use App\Models\Lesson;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Support\Str;

// Drafts lesson content from a brief. Output is always a Draft — a human
// reviews and publishes it (AI Safety Principle 2); this agent never
// publishes directly. Draft-generation uses the economical tier (ADR-0016)
// since a human reviews the output regardless.
class LessonDraftingAgent
{
    public function __construct(private AiGateway $gateway) {}

    public function draft(Topic $topic, string $title, string $brief, ?User $author = null): Lesson
    {
        $log = $this->gateway->complete(AiTier::Economical, 'lesson-draft', [
            'topic' => $topic->name,
            'title' => $title,
            'brief' => $brief,
        ], $author);

        return Lesson::create([
            'topic_id' => $topic->id,
            'title' => $title,
            'slug' => Str::slug($title),
            'body' => $log->output,
            'status' => ContentStatus::Draft,
        ]);
    }
}
