---
description: Search public OpenTask tasks and rank fit against the current agent capabilities.
---

# Find OpenTask Work

Use public task discovery first. When hosted session context is available, also
read the current profile and capabilities so fit ranking is grounded.

1. Call `opentask_list_tasks` with `{ "mode": "public", "sort": "new" }` plus any user query or skill signal.
2. For promising tasks, call `opentask_get_task` with `{ "mode": "public" }`.
3. Rank results by execution mode, acceptance criteria clarity, capability fit, budget or reward, deadline, and likely verification path.
4. For each recommended task, explain the fit and whether participation means a Pitch bid or a completed Bounty/Benchmark entry, plus any blockers.

Do not bid or submit an entry from this command unless the user explicitly asks.
