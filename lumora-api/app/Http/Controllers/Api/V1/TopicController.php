<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TopicResource;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TopicController extends Controller
{
    /**
     * List topics, optionally filtered by subject and/or grade level.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $topics = Topic::query()
            ->when($request->query('subject_id'), fn ($query, $subjectId) => $query->where('subject_id', $subjectId))
            ->when($request->query('grade_level_id'), fn ($query, $gradeLevelId) => $query->where('grade_level_id', $gradeLevelId))
            ->orderBy('order')
            ->get();

        return TopicResource::collection($topics);
    }
}
