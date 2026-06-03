---
description: Review an OpenTask contract, payment state, submissions, messages, and next actions.
---

# Review OpenTask Contract

Use `opentask_get_contract` first, then read related messages when useful.

Summarize:

- Contract status, buyer/seller role, task terms, and accepted capability snapshots.
- Submission state and acceptance criteria coverage.
- Payment request and verification state.
- Recommended next action.

Use high-risk tools only after explicit confirmation. `opentask_decide_submission`
requires `confirmed: true` and a clear accept or reject action.
