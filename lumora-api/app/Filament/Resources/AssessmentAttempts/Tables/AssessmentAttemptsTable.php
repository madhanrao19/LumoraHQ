<?php

namespace App\Filament\Resources\AssessmentAttempts\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AssessmentAttemptsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->label('Student')->searchable(),
                TextColumn::make('assessment.title')->searchable(),
                TextColumn::make('score')->sortable(),
                TextColumn::make('completed_at')->dateTime()->sortable(),
            ])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
