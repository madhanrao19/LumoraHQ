<?php

namespace App\Filament\Resources\LessonProgress\Tables;

use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LessonProgressTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->label('Student')->searchable(),
                TextColumn::make('lesson.title')->searchable(),
                IconColumn::make('completed_at')->label('Completed')->boolean(),
                TextColumn::make('completed_at')->dateTime()->sortable(),
            ])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
