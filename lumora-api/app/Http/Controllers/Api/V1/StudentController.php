<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateStudentRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StudentController extends Controller
{
    /**
     * List the authenticated Parent's own linked students.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        return UserResource::collection($request->user()->students);
    }

    /**
     * Create a Student account and link it to the authenticated Parent —
     * ADR-0019's core flow: no Student account exists without a linked,
     * visible Parent, created in the same action, not two separate steps.
     *
     * The Parent sets the Student's initial password directly here. This is
     * a simple, working placeholder — whether Students should instead get an
     * invite-link/set-their-own-password flow is a real UX question ADR-0019
     * didn't settle, and isn't decided here either.
     */
    public function store(CreateStudentRequest $request): JsonResponse
    {
        $student = new User($request->validated());
        $student->role = UserRole::Student;
        $student->save();

        $request->user()->students()->attach($student->id, ['status' => 'active']);

        return (new UserResource($student))->response()->setStatusCode(201);
    }
}
