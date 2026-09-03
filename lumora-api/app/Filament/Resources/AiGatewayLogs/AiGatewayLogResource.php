<?php

namespace App\Filament\Resources\AiGatewayLogs;

use App\Filament\Resources\AiGatewayLogs\Pages\ListAiGatewayLogs;
use App\Filament\Resources\AiGatewayLogs\Pages\ViewAiGatewayLog;
use App\Filament\Resources\AiGatewayLogs\Schemas\AiGatewayLogInfolist;
use App\Filament\Resources\AiGatewayLogs\Tables\AiGatewayLogsTable;
use App\Models\AiGatewayLog;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

// Read-only: rows are written by the AiGateway itself (ADR-0021), never
// authored in the admin panel — this exposes the "Admin: full read access"
// half of the audit-log access model.
class AiGatewayLogResource extends Resource
{
    protected static ?string $model = AiGatewayLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    protected static string|UnitEnum|null $navigationGroup = 'AI Platform';

    public static function infolist(Schema $schema): Schema
    {
        return AiGatewayLogInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AiGatewayLogsTable::configure($table);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(mixed $record): bool
    {
        return false;
    }

    public static function canDelete(mixed $record): bool
    {
        return false;
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAiGatewayLogs::route('/'),
            'view' => ViewAiGatewayLog::route('/{record}'),
        ];
    }
}
