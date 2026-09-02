<?php

namespace App\Enums;

// Shared draft->review->approve->publish->supersede lifecycle for curriculum
// content (ADR-0024), used by Lesson and Question alike.
enum ContentStatus: string
{
    case Draft = 'draft';
    case Review = 'review';
    case Approved = 'approved';
    case Published = 'published';
    case Superseded = 'superseded';
}
