# Curriculum Framework

## Purpose

This book defines how curriculum content is structured and sourced — the content-side counterpart to the Curriculum & Content module's data ownership in [Database Architecture](../09-database-architecture/index.md#schema-ownership).

## Status

Version: 1.1 foundation draft. Structural shape is derived from the Roadmap's named engines; the actual taxonomy (subjects, grade bands) is not yet decided.

## Working structure

The [Roadmap](../25-roadmap/index.md) Phase 1 names a Curriculum Engine, Lesson Engine, Question Bank, and Assessment Engine, which implies a minimal hierarchy: **subject → level/grade → topic → lesson → assessment item**. This is a working structure to build against, not a ratified taxonomy.

!!! note "Not yet decided"
    The actual subject list, grade-band structure, and how curriculum content versions over time as reference curricula change. Resolve as an ADR before Phase 1 curriculum-engine work locks in a schema.

## Alignment, not replication

Per repository convention (`lumora-docs/CLAUDE.md`), curriculum references are alignment references, not the content source itself, and copyrighted textbooks, workbooks, diagrams, paid notes, or exam papers are never copied. This is a content-sourcing principle for the product, not just a rule for editing this documentation repo — every piece of curriculum content Lumora publishes must be original or properly licensed, aligned to a reference curriculum rather than copied from one.

## Content originality and review

Every curriculum item — human-authored or AI-drafted — goes through the same editorial approval before publication. The workflow itself (who approves, what the review checklist covers) is owned by [Content Operations](../17-content-operations/index.md), not this book. This book only states that curriculum content is what that workflow governs, and that approved curriculum content is also what [AI Development Bible](../06-ai-development-bible/index.md#rag-source-boundary) allows RAG to index.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Database ownership of curriculum tables | [Database Architecture](../09-database-architecture/index.md) |
| Pedagogical principles behind curriculum design | [Educational Framework](../04-educational-framework/index.md) |
| Editorial approval workflow | [Content Operations](../17-content-operations/index.md) |
| What content RAG is allowed to draw on | [AI Development Bible](../06-ai-development-bible/index.md#rag-source-boundary) |

## Related documents

- [Educational Framework](../04-educational-framework/index.md) — the pedagogy this structure serves.
- [Database Architecture](../09-database-architecture/index.md#schema-ownership) — where curriculum data actually lives.
- [AI Development Bible](../06-ai-development-bible/index.md#rag-source-boundary) — why approved curriculum content matters beyond publishing.
