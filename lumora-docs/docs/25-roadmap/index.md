# Roadmap

## Phase 0 — Foundation

- Documentation repository
- Constitution
- Architecture standards
- Claude Code operating system
- AI agent handbook
- Development standards

## Phase 1 — Core Platform

- Authentication — ✅ done (register/login/logout via Sanctum tokens — [ADR-0002](../21-adr/0002-use-token-based-sanctum-authentication.md))
- Roles and permissions — ✅ done (Student/Parent/Admin roles, policy-based authorization — [ADR-0018](../21-adr/0018-native-policies-role-model.md))
- Curriculum engine — ✅ done (subject/grade-level/topic hierarchy)
- Lesson engine — ✅ done (draft→review→approve→publish→supersede lifecycle, progress tracking — [ADR-0024](../21-adr/0024-curriculum-content-versioning.md))
- Question bank — ✅ done
- Assessment engine — ✅ done (assessments, scored attempts)
- Student portal — ✅ done (auth, curriculum browsing, lesson completion, assessment-taking, AI Tutor chat — [PR #4](https://github.com/madhanrao19/LumoraHQ/pull/4), [#6](https://github.com/madhanrao19/LumoraHQ/pull/6), [#8](https://github.com/madhanrao19/LumoraHQ/pull/8))
- Parent portal — ✅ done (student management, progress/attempts, Tutor conversation and AI Gateway audit-log oversight — [PR #4](https://github.com/madhanrao19/LumoraHQ/pull/4), [#8](https://github.com/madhanrao19/LumoraHQ/pull/8), [#9](https://github.com/madhanrao19/LumoraHQ/pull/9))
- Admin portal — ✅ done (Filament: content lifecycle across all curriculum/assessment resources, plus read-only AI Gateway audit-log oversight)

## Phase 2 — AI Platform

- AI gateway — ✅ done (tiered provider routing, full audit logging — [ADR-0016](../21-adr/0016-ai-model-tiering-strategy.md))
- Prompt library — ✅ done (version-controlled prompt files — [ADR-0015](../21-adr/0015-prompts-as-version-controlled-code.md))
- RAG over approved content — ✅ done ([ADR-0022](../21-adr/0022-rag-indexing-on-publish.md)) — indexing-eligibility mechanism only; grounding is keyword-match, not real vector similarity (no pgvector/embeddings wired in yet)
- AI lesson drafting — ✅ done
- AI quiz drafting — ✅ done
- AI tutor with safety guardrails — ✅ done ([ADR-0023](../21-adr/0023-tutor-realtime-escalation-mechanism.md), [ADR-0028](../21-adr/0028-tutor-scope-defined-by-rag-grounding.md))
- AI audit logs — ✅ done ([ADR-0021](../21-adr/0021-audit-log-access-model.md))

## Phase 3 — Expansion

- Mobile apps — ✅ done, same feature set as the web student/parent portal ([ADR-0026](../21-adr/0026-react-native-expo-mobile.md); [PR #5](https://github.com/madhanrao19/LumoraHQ/pull/5), [#6](https://github.com/madhanrao19/LumoraHQ/pull/6), [#8](https://github.com/madhanrao19/LumoraHQ/pull/8), [#9](https://github.com/madhanrao19/LumoraHQ/pull/9))
- Teacher tools
- School edition
- Marketplace
- Multi-curriculum framework
