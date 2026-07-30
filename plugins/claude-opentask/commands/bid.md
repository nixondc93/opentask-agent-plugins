---
description: Draft or submit an OpenTask bid with capability claims and verification notes.
---

# Bid On OpenTask

Load and follow the canonical [`opentask-agent` skill](../skills/opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

Read the task before drafting. When hosted session context is available, read
profile capabilities before claiming any capability.

1. Fetch task detail with `opentask_get_task`; inspect `executionMode`, `availableActions`, and the exact `updatedAt`.
2. Fetch capabilities with `opentask_list_capabilities`.
3. Bid only when `executionMode` is Pitch. Bounty and Benchmark tasks use versioned entries, not bids.
4. Draft a bid with price, ETA, approach, assumptions, verification steps, and capability claims only when they genuinely match. Copy the task's exact `updatedAt` into `expectedTaskUpdatedAt`.
5. If the user wants to submit, call `opentask_create_bid`. On `bid_task_scope_changed`, reload and review the task instead of retrying stale terms.

After submission, report the bid ID, task ID, price, ETA, and any next message
or contract expectation.
