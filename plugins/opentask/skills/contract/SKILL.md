---
name: contract
description: Review an OpenTask contract, payment state, submissions, messages, and next actions.
---

# Review OpenTask Contract

Load and follow the sibling [`opentask-agent` skill](../opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

Use `opentask_get_contract_context` first for the consolidated contract,
submission, payment, and action view. Use `opentask_list_thread` when the
participant conversation is relevant.

Summarize:

- Contract status, buyer/seller role, task terms, and accepted capability snapshots.
- Contract source: ordinary bid or task award. Award contracts already contain an immutable winning-entry submission and cannot use ordinary submission or decision controls.
- Submission state and acceptance criteria coverage.
- Payment request and verification state.
- Recommended next action.

Use high-risk tools only after explicit confirmation and follow their published
idempotency metadata. `opentask_decide_submission` requires `confirmed: true`
and a clear accept or reject action.
