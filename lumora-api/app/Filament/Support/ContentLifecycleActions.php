<?php

namespace App\Filament\Support;

use App\Enums\ContentStatus;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Model;

// Shared publish/revise actions for Lesson, Question, and Assessment tables —
// all three share the same ADR-0024 supersede-don't-overwrite lifecycle.
class ContentLifecycleActions
{
    /**
     * Publish a draft/review/approved row. If it's a revision of a prior
     * published row, marks that row Superseded instead of leaving two
     * published versions around.
     */
    public static function applyPublish(Model $record): void
    {
        if ($record->supersedes_id) {
            $record->supersedes()->update(['status' => ContentStatus::Superseded]);
        }

        $record->update(['status' => ContentStatus::Published, 'published_at' => now()]);
    }

    /**
     * Start a new draft version of a published row instead of editing it in
     * place — editing a published row directly would overwrite history that
     * ADR-0024 requires keeping. Returns the new draft.
     */
    public static function applyRevision(Model $record): Model
    {
        $revision = $record->replicate(['status', 'published_at', 'supersedes_id', 'created_at', 'updated_at']);
        $revision->status = ContentStatus::Draft;
        $revision->supersedes_id = $record->id;
        $revision->save();

        // Assessment has a questions() BelongsToMany; Lesson/Question don't — no-op for those.
        if (method_exists($record, 'questions')) {
            $revision->questions()->sync($record->questions->pluck('id'));
        }

        return $revision;
    }

    public static function publish(): Action
    {
        return Action::make('publish')
            ->label('Publish')
            ->icon(Heroicon::OutlinedCheckCircle)
            ->visible(fn ($record) => $record->status !== ContentStatus::Published)
            ->requiresConfirmation()
            ->action(fn ($record) => self::applyPublish($record));
    }

    public static function revise(): Action
    {
        return Action::make('revise')
            ->label('Revise')
            ->icon(Heroicon::OutlinedPencilSquare)
            ->visible(fn ($record) => $record->status === ContentStatus::Published)
            ->action(function ($record) {
                self::applyRevision($record);

                Notification::make()
                    ->title('Draft revision created')
                    ->success()
                    ->send();
            });
    }
}
