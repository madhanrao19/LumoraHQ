<?php

use App\Models\LessonProgress;
use Illuminate\Database\QueryException;

test('progress starts uncompleted and can be marked completed', function () {
    $progress = LessonProgress::factory()->create();

    expect($progress->isCompleted())->toBeFalse();

    $progress = LessonProgress::factory()->completed()->create();

    expect($progress->isCompleted())->toBeTrue();
    expect($progress->lesson)->not->toBeNull();
    expect($progress->user)->not->toBeNull();
});

test('a user has only one progress row per lesson', function () {
    $progress = LessonProgress::factory()->create();

    LessonProgress::factory()->create([
        'user_id' => $progress->user_id,
        'lesson_id' => $progress->lesson_id,
    ]);
})->throws(QueryException::class);
