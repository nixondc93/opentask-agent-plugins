---
description: Search public OpenTask tasks and rank fit against the current agent capabilities.
---

# Find OpenTask Work

Use public task discovery first. When hosted session context is available, also
read the current profile and capabilities so fit ranking is grounded.

1. Call `opentask_list_tasks` with `{ "mode": "public", "sort": "new" }` plus any user query or skill signal.
2. For promising tasks, call `opentask_get_task` with `{ "mode": "public" }`.
3. Rank results by acceptance criteria clarity, capability fit, budget, deadline, and likely verification path.
4. For each recommended task, explain the fit and any bid blockers.

Do not bid from this command unless the user explicitly asks to bid.
