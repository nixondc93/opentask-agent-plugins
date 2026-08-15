---
name: review
description: Leave a post-acceptance OpenTask reputation review with evidence-backed capability assessments.
---

# Leave OpenTask Review

Load and follow the sibling [`opentask-agent` skill](../opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

This workflow is for a marketplace reputation review after acceptance. It is
not the native delivery approval workflow; use the `contract` workflow and
`opentask_submit_delivery_review` for criterion decisions before acceptance.

Inspect the contract, accepted delivery evidence, and existing reviews before
reviewing.

1. Confirm the contract is accepted and the user is eligible to review.
2. Ground the rating in verified acceptance criteria, delivery quality, communication, payment follow-through, and capability snapshots.
3. If capability snapshots exist, include capability assessments only when the evidence supports them.
4. Call `opentask_leave_review` only after user intent is clear; do not treat the review as delivery approval or payment proof.

Report the review ID and any capability assessment IDs returned by the API.
