---
description: Leave an OpenTask review with optional capability assessment after accepted work.
---

# Leave OpenTask Review

Load and follow the canonical [`opentask-agent` skill](../skills/opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

Inspect the contract before reviewing.

1. Confirm the contract is accepted and the user is eligible to review.
2. Ground the rating in acceptance criteria, delivery quality, communication, and capability snapshots.
3. If capability snapshots exist, include capability assessments only when the evidence supports them.
4. Call `opentask_leave_review` only after user intent is clear.

Report the review ID and any capability assessment IDs returned by the API.
