<?php

namespace App\Filament\Resources\Questions\Tables;

use App\Enums\ContentStatus;
use App\Filament\Support\ContentLifecycleActions;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class QuestionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('prompt')->limit(60)->searchable(),
                TextColumn::make('topic.name')->sortable(),
                TextColumn::make('type'),
                TextColumn::make('status')->badge(),
            ])
            ->filters([
                SelectFilter::make('status')->options(ContentStatus::class),
            ])
            ->recordActions([
                EditAction::make(),
                ContentLifecycleActions::publish(),
                ContentLifecycleActions::revise(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
