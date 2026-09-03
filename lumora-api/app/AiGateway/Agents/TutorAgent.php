<?php

namespace App\AiGateway\Agents;

use App\AiGateway\AiGateway;
use App\Enums\AiTier;
use App\Enums\TutorOutcome;
use App\Enums\UserRole;
use App\Models\Lesson;
use App\Models\RagDocument;
use App\Models\TutorMessage;
use App\Models\User;
use App\Notifications\TutorEscalationRaised;
use Illuminate\Support\Facades\Notification;

// The AI Tutor: RAG-grounded scope (ADR-0028) and synchronous safety
// classification with graduated outcomes (ADR-0023). Every turn is recorded
// to tutor_messages regardless of outcome — including a plain Pass — on top
// of the AiGatewayLog rows the Gateway already writes for each model call.
class TutorAgent
{
    private const OUT_OF_SCOPE_MESSAGE = "I can only help with topics covered in your published lessons, and I couldn't find one for that question. Try asking about a lesson you've studied.";

    private const UNSAFE_FALLBACK_MESSAGE = "I can't help with that. Please ask a parent, teacher, or another trusted adult.";

    public function __construct(private AiGateway $gateway) {}

    public function ask(User $student, string $question): TutorMessage
    {
        $context = $this->groundingContext($question);

        if ($context === null) {
            return $this->record($student, $question, self::OUT_OF_SCOPE_MESSAGE, TutorOutcome::Redirect);
        }

        $answer = $this->gateway->complete(AiTier::HigherQuality, 'tutor-answer', [
            'context' => $context,
            'question' => $question,
        ], $student)->output;

        $outcome = $this->classify($answer, $student);

        return match ($outcome) {
            TutorOutcome::Block => $this->record($student, $question, self::UNSAFE_FALLBACK_MESSAGE, $outcome),
            TutorOutcome::Redirect => $this->record($student, $question, self::OUT_OF_SCOPE_MESSAGE, $outcome),
            TutorOutcome::Pass, TutorOutcome::Escalate => $this->record($student, $question, $answer, $outcome),
        };
    }

    /**
     * ADR-0028: scope is whatever's RAG-indexed, found here by simple
     * keyword overlap against published lesson bodies.
     *
     * ponytail: no real vector search — rag_documents has no embedding
     * column yet (no pgvector, no embedding provider configured). Swap this
     * for similarity search once both exist.
     */
    private function groundingContext(string $question): ?string
    {
        $terms = collect(preg_split('/\W+/', mb_strtolower($question), -1, PREG_SPLIT_NO_EMPTY))
            ->filter(fn ($term) => mb_strlen($term) > 3)
            ->unique();

        if ($terms->isEmpty()) {
            return null;
        }

        $indexedLessonIds = RagDocument::where('documentable_type', Lesson::class)->pluck('documentable_id');

        $lesson = Lesson::whereIn('id', $indexedLessonIds)
            ->where(function ($query) use ($terms) {
                foreach ($terms as $term) {
                    $query->orWhere('body', 'like', "%{$term}%")->orWhere('title', 'like', "%{$term}%");
                }
            })
            ->first();

        return $lesson?->body;
    }

    /**
     * ADR-0023: every response is classified synchronously before the
     * student ever sees it.
     */
    private function classify(string $answer, User $student): TutorOutcome
    {
        $raw = $this->gateway->complete(AiTier::SafetyClassification, 'tutor-safety-classify', [
            'answer' => $answer,
        ], $student)->output;

        return TutorOutcome::fromClassifierOutput($raw);
    }

    private function record(User $student, string $question, string $answer, TutorOutcome $outcome): TutorMessage
    {
        $message = TutorMessage::create([
            'user_id' => $student->id,
            'question' => $question,
            'answer' => $answer,
            'outcome' => $outcome,
        ]);

        if ($outcome === TutorOutcome::Escalate) {
            $this->notifyEscalation($student, $message);
        }

        return $message;
    }

    /**
     * ADR-0023: an Escalate outcome must be flagged for human/parent/staff
     * review "in addition to" the response already given — a row sitting in
     * an audit view nobody's polling doesn't satisfy that on its own.
     */
    private function notifyEscalation(User $student, TutorMessage $message): void
    {
        $recipients = $student->parents->merge(User::where('role', UserRole::Admin)->get());

        Notification::send($recipients, new TutorEscalationRaised($message));
    }
}
