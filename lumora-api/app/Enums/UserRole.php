<?php

namespace App\Enums;

// Teacher intentionally omitted — Phase 3, per ADR-0018, not created speculatively now.
enum UserRole: string
{
    case Student = 'student';
    case Parent = 'parent';
    case Admin = 'admin';
}
