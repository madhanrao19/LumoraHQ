<?php

namespace App\Filament\Resources\Lessons\Schemas;

use App\Enums\ContentStatus;
use App\Models\Lesson;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class LessonForm
{
    public static function configure(Schema $schema): Schema
    {
        // Published content is immutable here — use the "Revise" table action
        // to start a new draft version instead (ADR-0024).
        $locked = fn (?Lesson $record) => $record?->status === ContentStatus::Published;

        return $schema
            ->components([
                Select::make('topic_id')
                    ->relationship('topic', 'name')
                    ->required()
                    ->searchable()
                    ->disabled($locked),
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->disabled($locked),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->disabled($locked),
                Textarea::make('body')
                    ->required()
                    ->rows(10)
                    ->disabled($locked),
                Select::make('status')
                    ->options([
                        ContentStatus::Draft->value => 'Draft',
                        ContentStatus::Review->value => 'Review',
                        ContentStatus::Approved->value => 'Approved',
                    ])
                    ->default(ContentStatus::Draft->value)
                    ->required()
                    ->disabled($locked)
                    ->dehydrated(fn () => true),
            ]);
    }
}
