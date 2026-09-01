# ADR 0027: Package the Claude Code Setup as a Shared Plugin Across Lumora Repos

## Status

Accepted

## Context

[Claude Code Operating System](../15-claude-code-operating-system/index.md#session-rules) flagged whether other Lumora repos (`lumora-api`, `lumora-academy`, etc. — all currently empty placeholders) get their own tailored `.claude/agents`/`.claude/commands`, or share this repo's setup once scaffolded.

The six subagents already defined here — `chief-architect`, `docs-writer`, `education-director`, `ai-safety-reviewer`, `qa-reviewer`, `security-reviewer` — are broadly applicable review lenses (architecture, quality, education, AI safety, QA, security), not docs-specific in what they actually check. The seven commands (`/goal`, `/verify`, `/handoff`, `/review-ai`, `/review-curriculum`, `/review-security`, `/roast`) are similarly generic workflow tools. Nothing about their current definitions is unique to reviewing documentation.

This repository already demonstrates a real mechanism for sharing Claude Code tooling across projects: the `ponytail` plugin, installed via a marketplace entry in `~/.claude/settings.json` and enabled per-project in `.claude/settings.json`. That's a proven pattern to reuse rather than invent something new.

## Decision

1. **Package the current `.claude/agents/` and `.claude/commands/` set as a shared, versioned Lumora-specific plugin** — the same marketplace/plugin mechanism already working in this project for `ponytail` — rather than copying the files independently into each repo.
2. **Each Lumora repo installs this shared plugin once scaffolded**, giving every repo the same six review lenses and seven workflow commands from day one, with one canonical source to update.
3. **Repo-specific additions layer on top of the shared plugin**, not in place of it — a Laravel-specific reviewer for `lumora-api`, or a Next.js-specific one for `lumora-academy`, would be genuine additions, while the shared baseline stays consistent across every repo.

## Alternatives considered

- **Duplicate the files into each repo independently.** Zero packaging work upfront, but the six subagents and seven commands drift apart over time as each repo's copy gets edited on its own — the exact duplication risk this project has avoided everywhere else: [ADR-0007](0007-azure-key-vault-secret-manager.md) (secrets), [ADR-0013](0013-tailwind-v4-design-tokens.md) (design tokens), and [ADR-0015](0015-prompts-as-version-controlled-code.md) (prompts) all specifically avoided one canonical thing copied into multiple places.
- **Each repo builds bespoke agents/commands from scratch.** The most tailored option, but throws away six already-proven, broadly-applicable review lenses for no clear benefit — reinventing work that's already done and already generically useful.
- **Shared plugin, installed per repo, repo-specific additions layered on top (chosen).** One canonical source using a mechanism this project already proves works, while still allowing genuine repo-specific specialization where it actually adds value.

## Consequences

Positive:
- One canonical version of the shared subagents/commands instead of independently-drifting copies across five-plus repos.
- Reuses a plugin/marketplace mechanism already proven in this exact project rather than inventing a new sharing method.
- Repos can still add genuinely repo-specific tooling without disturbing the shared baseline.

Trade-offs:
- Packaging the current agents/commands as a proper plugin (marketplace entry, versioning) is real, if modest, setup work that hasn't been done yet — this ADR decides the approach, not the packaging itself.
- Every Lumora repo now has an external plugin dependency to keep updated — a small operational habit, the same one already required for `ponytail`.

## Review date

Revisit if a Lumora repo's real needs diverge so much from the shared baseline that most of the six subagents or seven commands genuinely don't apply there — unlikely given how generic the current set is, but worth checking once a second repo is actually scaffolded and in real use.
