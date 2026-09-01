# ADR 0019: Parent-Initiated Child Accounts with a Many-to-Many Link Table

## Status

Accepted

## Context

[Security & Privacy](../12-security-privacy/index.md#applicable-regulation) flagged the parent-child account relationship model as open, required by [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) requirement 6 (parents and authorized staff must have appropriate visibility into a child's AI interactions). [ADR-0018](0018-native-policies-role-model.md) already decided the role set (Student, Parent, Admin) and that Policies check relationships, not just roles — this ADR decides what that relationship actually *is*.

## Decision

1. **Parent-initiated account creation.** A Parent account is created first (self-registration); Student profiles are created *by* the parent, under the parent's account — a child never self-registers independently and gets linked to a parent afterward. This means no Student account can ever exist without at least one linked, visible Parent, satisfying Safety Principle 6 by construction rather than by policy alone.
2. **Model the relationship as its own linking table** (owned by Identity & Access, the same module both roles already belong to) connecting Parent users to Student users — not a single `parent_id` foreign key on the student record. This supports real family structures (siblings under one parent; a student with more than one linked guardian, e.g. co-parenting) without a breaking schema change later.
3. **The link carries a status attribute** (e.g. active) even though a verification/approval workflow isn't built yet — a small, cheap piece of schema now that avoids a near-certain future migration once such a workflow exists, without building the workflow itself prematurely.

## Alternatives considered

- **Child self-registers, parent later links or "claims" the account.** More flexible for older students who might want independent access first, but creates a window where a Student account exists with no parent visibility at all — directly working against Safety Principle 6 and the platform's child-safety-first posture. Rejected as the default; could be revisited for a specific, reviewed older-student cohort later, but that's a product/policy decision, not this ADR's to make.
- **A single `parent_id` foreign key on the student table (one parent per student).** Simplest schema, but doesn't model real family structures — co-parenting, guardianship, multiple siblings — and would need a breaking migration to fix once a real family needed it. Same "don't guess wrong on the cheap-to-get-right-now thing" reasoning already applied to environment topology ([ADR-0008](0008-three-environment-topology.md)) and multi-tenancy ([ADR-0017](0017-single-tenant-schema-defer-multi-tenancy.md)).
- **Parent-initiated creation with a many-to-many link table (chosen).** The safer default for a child-directed platform, and models real family structures without a guaranteed future migration.

## Consequences

Positive:
- No child account ever exists without a linked, visible parent — Safety Principle 6 is satisfied structurally, not just by convention.
- The many-to-many shape avoids a future breaking migration for multi-guardian or sibling cases that will realistically occur.

Trade-offs:
- There's no path today for an older student to register independently and add a parent later — a real pattern on some platforms, deliberately excluded here given the child-safety-first priority. Revisiting this needs an explicit, reviewed product/policy decision, not an assumption made in code.
- Adding a `status` column ahead of a real verification workflow is a small amount of speculative schema — accepted because it's cheap (one column) and the workflow is near-certain to be needed eventually, unlike [ADR-0017](0017-single-tenant-schema-defer-multi-tenancy.md)'s multi-tenancy case, where the whole pattern shape was genuinely uncertain.

## Review date

Revisit if an age-appropriate independent-registration path for older students is ever decided (a product/policy question, not resolved here), or when the actual verification/approval workflow for a parent-child link is built (a feature on top of this schema, not a change to it).
