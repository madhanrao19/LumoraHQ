<?php

namespace App\Enums;

enum LessonStatus: string
{
    case Draft = 'draft';
    case Review = 'review';
    case Approved = 'approved';
    case Published = 'published';
    case Superseded = 'superseded';
}
