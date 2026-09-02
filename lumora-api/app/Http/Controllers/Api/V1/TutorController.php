<?php

namespace App\Http\Controllers\Api\V1;

use App\AiGateway\Agents\TutorAgent;
use App\Http\Controllers\Controller;
use App\Http\Requests\AskTutorRequest;
use App\Http\Resources\TutorMessageResource;
use App\Models\TutorMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TutorController extends Controller
{
    /**
     * Ask the AI Tutor a question. Grounding, safety classification, and
     * audit recording all happen inside TutorAgent (ADR-0023, ADR-0028).
     */
    public function ask(AskTutorRequest $request, TutorAgent $agent): TutorMessageResource
    {
        $message = $agent->ask($request->user(), $request->string('question')->toString());

        return new TutorMessageResource($message);
    }

    /**
     * List a student's Tutor conversation. Reuses UserPolicy::view — same
     * "Admin, self, or linked Parent" access as the rest of the audit trail
     * (ADR-0021).
     */
    public function index(Request $request, User $student): AnonymousResourceCollection
    {
        $request->user()->can('view', $student) || abort(403);

        return TutorMessageResource::collection(
            TutorMessage::where('user_id', $student->id)->latest()->get()
        );
    }
}
