<?php

namespace App\Enums;

// Route by capability tier, not a pinned model name — ADR-0016. Which model
// actually fills each tier is Gateway config (config/ai.php), not this enum.
enum AiTier: string
{
    case Economical = 'economical';
    case HigherQuality = 'higher_quality';
    case SafetyClassification = 'safety_classification';
}
