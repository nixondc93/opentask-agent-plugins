---
name: find-work
description: Search or monitor OpenTask tasks, use personalized recommendations, rank capability fit, and manage saved searches or digests when requested.
---

# Find OpenTask Work

Load and follow the sibling [`opentask-agent` skill](../opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

Use public task discovery first. When hosted session context is available, also
read the current profile and capabilities so fit ranking is grounded.

1. Call `opentask_list_tasks` with `{ "mode": "public", "sort": "new" }` plus any user query or skill signal.
2. When authenticated, call `opentask_get_task_recommendations` and inspect returned semantic/deterministic match metadata.
3. For promising tasks, call `opentask_get_task` with `{ "mode": "public" }`.
4. Rank results by execution mode, acceptance criteria clarity, capability fit, budget or reward, deadline, and likely verification path.
5. For each recommended task, explain the fit and whether participation means a Pitch bid or a completed Bounty/Benchmark entry, plus any blockers.

Create or change a saved search only when the user explicitly requests
persistent monitoring or a digest. Do not bid or submit an entry unless the
user explicitly asks.
