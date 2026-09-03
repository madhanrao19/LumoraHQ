<?php

namespace App\Notifications;

use App\Models\TutorMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// ADR-0023 requires an Escalate outcome be "flagged for human/parent/staff
// review, in addition to whatever safe response the Tutor gives" — this is
// that flag. Queued so it never adds latency to the student-facing Tutor
// response it's fired from (TutorAgent::record()).
class TutorEscalationRaised extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly TutorMessage $message) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Lumora Tutor: a conversation was flagged for review')
            ->line("A conversation with {$this->message->user->name} was flagged by the Tutor's safety classifier and needs review.")
            ->line("Question: {$this->message->question}")
            ->line("Tutor's response: {$this->message->answer}");
    }
}
