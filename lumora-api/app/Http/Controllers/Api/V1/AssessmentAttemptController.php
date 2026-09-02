<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssessmentAttemptRequest;
use App\Http\Resources\AssessmentAttemptResource;
use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AssessmentAttemptController extends Controller
{
    /**
     * Submit an attempt and score it against the assessment's published questions.
     *
     * ponytail: exact-match scoring only (right answer per question = 1 point).
     * Real scoring mechanics (partial credit, weighting) are still undecided
     * per the Educational Framework docs — replace this once that's settled.
     */
    public function store(StoreAssessmentAttemptRequest $request, Assessment $assessment): AssessmentAttemptResource
    {
        $responses = $request->validated('responses');

        $questions = $assessment->questions()->where('status', ContentStatus::Published)->get();

        $correct = $questions->filter(
            fn ($question) => array_key_exists($question->id, $responses)
                && $responses[$question->id] === $question->answer
        )->count();

        $attempt = AssessmentAttempt::create([
            'user_id' => $request->user()->id,
            'assessment_id' => $assessment->id,
            'responses' => $responses,
            'score' => $questions->isEmpty() ? 0 : (int) round($correct / $questions->count() * 100),
            'completed_at' => now(),
        ]);

        return new AssessmentAttemptResource($attempt);
    }

    /**
     * List the authenticated Student's own attempts at an assessment.
     */
    public function index(Request $request, Assessment $assessment): AnonymousResourceCollection
    {
        return AssessmentAttemptResource::collection(
            $assessment->attempts()->where('user_id', $request->user()->id)->get()
        );
    }
}
