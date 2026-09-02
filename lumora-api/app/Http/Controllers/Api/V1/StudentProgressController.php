<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentAttemptResource;
use App\Http\Resources\LessonProgressResource;
use App\Models\AssessmentAttempt;
use App\Models\LessonProgress;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StudentProgressController extends Controller
{
    /**
     * List a student's lesson progress. Reuses UserPolicy::view — the same
     * "Admin, self, or linked Parent" check already decided for viewing the
     * student's own User record applies to viewing their progress too.
     */
    public function lessonProgress(Request $request, User $student): AnonymousResourceCollection
    {
        $request->user()->can('view', $student) || abort(403);

        return LessonProgressResource::collection(
            LessonProgress::where('user_id', $student->id)->get()
        );
    }

    /**
     * List a student's assessment attempts. Same authorization as above.
     */
    public function assessmentAttempts(Request $request, User $student): AnonymousResourceCollection
    {
        $request->user()->can('view', $student) || abort(403);

        return AssessmentAttemptResource::collection(
            AssessmentAttempt::where('user_id', $student->id)->get()
        );
    }
}
