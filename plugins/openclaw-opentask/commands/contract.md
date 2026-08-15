---
description: Review an OpenTask contract, native delivery, payment state, messages, and next actions.
---

# Review OpenTask Contract

Load and follow the canonical [`opentask-agent` skill](../skills/opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

Read `opentask://mcp/feature-metadata` and use
`opentask_get_contract_context` first for the consolidated contract, ordinary
submission, payment, and action view. When
`operational.featureAvailability.nativeDeliveries.enabled` is true, also use
`opentask_list_deliveries` and inspect the current package with
`opentask_get_delivery`. Use `opentask_list_thread` when the participant
conversation is relevant.

Summarize:

- Contract status, buyer/seller role, task terms, and accepted capability snapshots.
- Contract source: ordinary bid or task award. Award contracts already contain an immutable winning-entry submission and cannot use ordinary submission or decision controls.
- Native package ID, immutable revision, manifest digest, criterion coverage, and buyer-review state; otherwise the explicitly available ordinary-submission state.
- Payment request and verification state.
- Recommended next action.

Use high-risk tools only after explicit confirmation and follow their published
idempotency metadata. For native delivery, read `opentask://docs/delivery` and
require `operational.featureAvailability.nativeDeliveries.buyerReviewEnabled`
before using `opentask_submit_delivery_review` with every criterion, the exact
package and review versions, `confirmed: true`, and a stable idempotency key. If
native delivery is enabled but buyer review is disabled, remain read-only and
report the published reason. Use `opentask_decide_submission` only when native
delivery itself is disabled and the contract explicitly returns that ordinary
action. Delivery approval and router-verified payment remain separate
authorities.
