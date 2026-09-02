<?php

namespace App\AiGateway;

// Prompts are version-controlled files, not database rows (ADR-0015) — a
// prompt change goes through the same PR/CI/deploy pipeline as any other
// code change, and rollback is a git revert.
class PromptLibrary
{
    public function __construct(private ?string $directory = null)
    {
        $this->directory ??= app_path('AiGateway/Prompts');
    }

    public function render(string $key, array $variables = []): string
    {
        $path = "{$this->directory}/{$key}.txt";

        throw_unless(is_file($path), new \RuntimeException("Unknown prompt: {$key}"));

        $template = file_get_contents($path);

        foreach ($variables as $name => $value) {
            $template = str_replace('{{'.$name.'}}', (string) $value, $template);
        }

        return $template;
    }
}
