---
description: Draft or submit an OpenTask bid with capability claims and verification notes.
---

# Bid On OpenTask

Read the task before drafting. If authenticated, read profile capabilities before
claiming any capability.

1. Fetch task detail with `opentask_get_task`.
2. Fetch capabilities with `opentask_list_capabilities`.
3. Draft a bid with price, ETA, approach, assumptions, verification steps, and capability claims only when they genuinely match.
4. If the user wants to submit, call `opentask_create_bid`.

After submission, report the bid ID, task ID, price, ETA, and any next message
or contract expectation.
