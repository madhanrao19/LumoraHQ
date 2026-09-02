<?php

use App\Http\Controllers\Api\V1\AssessmentAttemptController;
use App\Http\Controllers\Api\V1\AssessmentController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\LessonController;
use App\Http\Controllers\Api\V1\LessonProgressController;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\StudentProgressController;
use App\Http\Controllers\Api\V1\SubjectController;
use App\Http\Controllers\Api\V1\TopicController;
use App\Http\Controllers\Api\V1\TutorController;
use Illuminate\Support\Facades\Route;

// Versioned from the start — ADR-0005.
Route::prefix('v1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::get('subjects', [SubjectController::class, 'index']);
    Route::get('topics', [TopicController::class, 'index']);
    Route::get('topics/{topic}/lessons', [LessonController::class, 'index']);
    Route::get('lessons/{lesson}', [LessonController::class, 'show']);
    Route::get('topics/{topic}/assessments', [AssessmentController::class, 'index']);
    Route::get('assessments/{assessment}', [AssessmentController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);

        Route::get('students', [StudentController::class, 'index']);
        Route::post('students', [StudentController::class, 'store']);
        Route::get('students/{student}/progress', [StudentProgressController::class, 'lessonProgress']);
        Route::get('students/{student}/attempts', [StudentProgressController::class, 'assessmentAttempts']);
        Route::get('students/{student}/tutor-messages', [TutorController::class, 'index']);

        Route::post('tutor/ask', [TutorController::class, 'ask']);

        Route::post('lessons/{lesson}/progress', [LessonProgressController::class, 'store']);
        Route::post('assessments/{assessment}/attempts', [AssessmentAttemptController::class, 'store']);
        Route::get('assessments/{assessment}/attempts', [AssessmentAttemptController::class, 'index']);
    });
});
