<?php

namespace App\Filament\Resources\AiGatewayLogs\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class AiGatewayLogInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.name')->label('User'),
                TextEntry::make('tier')->badge(),
                TextEntry::make('provider'),
                TextEntry::make('model'),
                TextEntry::make('prompt_key'),
                TextEntry::make('status')->badge(),
                TextEntry::make('output')->columnSpanFull(),
                TextEntry::make('created_at')->dateTime(),
            ]);
    }
}
