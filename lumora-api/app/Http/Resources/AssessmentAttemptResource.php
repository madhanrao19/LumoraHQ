<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentAttemptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'assessment_id' => $this->assessment_id,
            // `responses` is keyed by question ID (e.g. [3 => "A"]). Cast to
            // object so it always serializes as a JSON object — a plain
            // array here gets silently reindexed to a JSON list by the
            // resource pipeline, losing the question-ID mapping.
            'responses' => (object) $this->responses,
            'score' => $this->score,
            'completed_at' => $this->completed_at,
        ];
    }
}
