<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Models\Assessment;
use App\Models\Topic;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AssessmentController extends Controller
{
    /**
     * List a topic's published assessments.
     */
    public function index(Topic $topic): AnonymousResourceCollection
    {
        return AssessmentResource::collection(
            $topic->assessments()->where('status', ContentStatus::Published)->get()
        );
    }

    /**
     * Show a published assessment with its published questions (answers omitted).
     */
    public function show(Assessment $assessment): AssessmentResource
    {
        if ($assessment->status !== ContentStatus::Published) {
            throw new NotFoundHttpException;
        }

        $assessment->load(['questions' => fn ($query) => $query->where('status', ContentStatus::Published)]);

        return new AssessmentResource($assessment);
    }
}
