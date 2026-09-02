<?php

namespace App\Filament\Resources\Questions\Schemas;

use App\Enums\ContentStatus;
use App\Models\Question;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class QuestionForm
{
    public static function configure(Schema $schema): Schema
    {
        // Published content is immutable here — use the "Revise" table action
        // to start a new draft version instead (ADR-0024).
        $locked = fn (?Question $record) => $record?->status === ContentStatus::Published;

        return $schema
            ->components([
                Select::make('topic_id')
                    ->relationship('topic', 'name')
                    ->required()
                    ->searchable()
                    ->disabled($locked),
                TextInput::make('type')
                    ->required()
                    ->maxLength(255)
                    ->helperText('Free text — question taxonomy is not yet standardized.')
                    ->disabled($locked),
                Textarea::make('prompt')
                    ->required()
                    ->rows(3)
                    ->disabled($locked),
                KeyValue::make('options')
                    ->helperText('e.g. A => Paris, B => London')
                    ->disabled($locked),
                TextInput::make('answer')
                    ->required()
                    ->helperText('Must match one of the option keys above for multiple choice.')
                    ->disabled($locked),
                Textarea::make('explanation')
                    ->rows(2)
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
