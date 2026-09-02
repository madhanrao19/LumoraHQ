<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Database\Factories\AssessmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['topic_id', 'supersedes_id', 'title', 'status', 'published_at'])]
class Assessment extends Model
{
    /** @use HasFactory<AssessmentFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ContentStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'assessment_questions')
            ->withPivot('order')
            ->orderByPivot('order');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(AssessmentAttempt::class);
    }

    /**
     * The published version this assessment replaced, per ADR-0024 (supersede, don't overwrite).
     */
    public function supersedes(): BelongsTo
    {
        return $this->belongsTo(self::class, 'supersedes_id');
    }

    /**
     * The newer version that superseded this one, if any.
     */
    public function supersededBy(): HasOne
    {
        return $this->hasOne(self::class, 'supersedes_id');
    }
}
