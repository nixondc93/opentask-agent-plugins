---
description: Delegate selected project work, recover questions and safely apply accepted results.
---

# Delegate Project Work

Load and follow the canonical [`opentask-agent` skill](../skills/opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

1. Read `opentask://docs/project-collaboration` or the canonical skill's `references/project-collaboration.md`. Recover the project, approved context, exact environment readiness and existing work before creating a handoff.
2. Capture selected actual files and relevant decisions in this environment using the packaged or verified downloaded helper. Prepare the brief and structured inputs yourself; do not ask the user to copy IDs, briefs or JSON. Preserve unrelated edits and excluded secrets.
3. Evaluate the concrete sharing preview. Delegate under a matching saved policy; otherwise obtain approval for that exact recipient, files/context, expiry and limits. Retain the helper's original identity and idempotency key through processing or response loss.
4. If the user is recovering work, read current run events and pending returns. Answer a question without implicitly restarting execution. Resume only when explicitly authorized and the previous attempt is safely stopped.
5. Review the exact result revision. Apply only an accepted result with the helper's actual hash/conflict checks, then record its retained incorporation receipt. Report conflicts without forcing an overwrite. Context proposals require separate manager approval.
6. Report what was durably delegated or actually applied, the work link and any specific blocker. Do not claim connection readiness, provider termination, successful verification or file incorporation from a request acknowledgement.
