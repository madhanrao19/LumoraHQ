# Content Operations

## Purpose

This book defines the editorial lifecycle for content — human-authored and AI-drafted alike. [AI Development Bible](../06-ai-development-bible/index.md#rag-source-boundary) and [AI Agents Handbook](../16-ai-agents-handbook/index.md#not-yet-decided) both defer their content-approval detail here.

## Status

Version: 1.1 foundation draft. States the lifecycle and the copyright principle; reviewer roles and the technical RAG-indexing trigger are flagged open.

## Content lifecycle

Draft → review → approve → publish — the same draft/published distinction [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary) already established for AI-generated content applies here as the general rule for **all** curriculum content, not just AI-drafted content. Nothing is publishable, and nothing is eligible for [RAG indexing](../06-ai-development-bible/index.md#rag-source-boundary), until it clears this same bar.

## Copyright and originality

Per repository convention (`lumora-docs/CLAUDE.md`): copyrighted textbooks, workbooks, diagrams, paid notes, or exam papers are never copied. This is the same legal concern applied consistently — every piece of published curriculum content must be original or properly licensed, using reference curricula for alignment only (see [Curriculum Framework](../05-curriculum-framework/index.md#alignment-not-replication)).

## Not yet decided

- **Reviewer roles** — who approves content before publish. Already tracked as an open item in [AI Development Bible](../06-ai-development-bible/index.md#human-review-and-escalation-roles) and [AI Agents Handbook](../16-ai-agents-handbook/index.md#not-yet-decided); not duplicated here.
- **RAG-indexing trigger mechanics** — whether content becomes RAG-eligible automatically on publish or requires a separate flag. This is a new, distinct mechanic question from the reviewer-roles item above.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Curriculum structure this workflow governs | [Curriculum Framework](../05-curriculum-framework/index.md) |
| Why approved content matters beyond publishing | [AI Development Bible](../06-ai-development-bible/index.md#rag-source-boundary) |
| Where curriculum data lives | [Database Architecture](../09-database-architecture/index.md) |

## Related documents

- [Curriculum Framework](../05-curriculum-framework/index.md) — what this workflow governs.
- [AI Development Bible](../06-ai-development-bible/index.md#rag-source-boundary) — why the approval bar matters for RAG.
- [AI Agents Handbook](../16-ai-agents-handbook/index.md#not-yet-decided) — the reviewer-roles item this book will eventually resolve.
