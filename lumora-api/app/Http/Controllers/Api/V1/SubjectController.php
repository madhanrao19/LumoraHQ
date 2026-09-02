<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SubjectController extends Controller
{
    /**
     * List all subjects.
     */
    public function index(): AnonymousResourceCollection
    {
        return SubjectResource::collection(Subject::orderBy('order')->get());
    }
}
