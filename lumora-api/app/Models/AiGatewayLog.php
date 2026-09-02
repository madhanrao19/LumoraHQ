<?php

namespace App\Models;

use App\Enums\AiTier;
use Database\Factories\AiGatewayLogFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'tier', 'provider', 'model', 'prompt_key', 'output', 'status'])]
class AiGatewayLog extends Model
{
    /** @use HasFactory<AiGatewayLogFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tier' => AiTier::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
