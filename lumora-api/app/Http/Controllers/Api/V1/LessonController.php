<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\LessonResource;
use App\Models\Lesson;
use App\Models\Topic;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class LessonController extends Controller
{
    /**
     * List a topic's published lessons.
     */
    public function index(Topic $topic): AnonymousResourceCollection
    {
        return LessonResource::collection(
            $topic->lessons()->where('status', ContentStatus::Published)->get()
        );
    }

    /**
     * Show a single published lesson.
     */
    public function show(Lesson $lesson): LessonResource
    {
        if ($lesson->status !== ContentStatus::Published) {
            throw new NotFoundHttpException;
        }

        return new LessonResource($lesson);
    }
}
