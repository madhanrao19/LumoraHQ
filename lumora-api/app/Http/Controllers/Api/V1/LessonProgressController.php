<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\MarkLessonProgressRequest;
use App\Http\Resources\LessonProgressResource;
use App\Models\Lesson;
use App\Models\LessonProgress;

class LessonProgressController extends Controller
{
    /**
     * Mark a lesson complete for the authenticated Student.
     */
    public function store(MarkLessonProgressRequest $request, Lesson $lesson): LessonProgressResource
    {
        $progress = LessonProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'lesson_id' => $lesson->id],
            ['completed_at' => now()],
        );

        return new LessonProgressResource($progress);
    }
}
