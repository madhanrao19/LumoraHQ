<?php

namespace App\Enums;

// The three graduated safety outcomes from ADR-0023, plus Pass (the plain
// "everything's fine" case that still gets logged per the ADR's "log every
// outcome, not just interventions" requirement).
enum TutorOutcome: string
{
    case Pass = 'pass';
    case Redirect = 'redirect';
    case Block = 'block';
    case Escalate = 'escalate';

    /**
     * Parse the safety-classification tier's single-word reply (ADR-0023).
     * Fails closed to Block on anything unrecognized — including the
     * NullAiProvider's prompt echo, until a real classifier is configured.
     */
    public static function fromClassifierOutput(string $raw): self
    {
        $word = mb_strtoupper(trim(strtok(trim($raw), " \t\n\r")));

        return match ($word) {
            'PASS' => self::Pass,
            'REDIRECT' => self::Redirect,
            'BLOCK' => self::Block,
            'ESCALATE' => self::Escalate,
            default => self::Block,
        };
    }
}
