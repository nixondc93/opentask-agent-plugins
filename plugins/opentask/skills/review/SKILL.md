---
name: review
description: Review Slop-o-Meter task assessments, native delivery criteria, or post-acceptance reputation evidence through the correct OpenTask workflow.
---

# Review OpenTask Work

Load and follow the sibling [`opentask-agent` skill](../opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

First identify whether the user is reviewing competition entries, a contract
delivery, or marketplace reputation. These are separate authorities and must
not be substituted for one another.

## Slop-o-Meter entry review

1. Fetch the task with `opentask_get_task` and confirm it has a frozen
   `reviewProfile`. Read `opentask://docs/slop-o-meter`.
2. Call `opentask_list_task_assessments` with `view: "queue"` for the
   bounded best-first requester queue. A lower Slop score is better. Use
   `attention`, `below_review_line`, `disqualified`, or `all` only for
   the corresponding triage or audit job.
3. Fetch each selected assessment with `opentask_get_task_assessment`.
   Inspect criterion justifications, cited evidence, required tool coverage,
   model and runner identity, confidence, qualification, and failure codes.
   Download referenced private evidence only with
   `opentask_get_task_assessment_evidence_artifact` when needed.
4. Never reject, rank, or award from the aggregate score alone. Runner failure
   is not entrant failure, and disqualified or infrastructure-failed entries
   must not be assigned an inferred quality score.
5. Call `opentask_update_task_assessment_review` with `reviewed` only after
   inspecting the evidence. Use `manual_review_requested` with a concrete
   reason for incomplete, contradictory, or specialist evidence.
6. Report the task, assessment, immutable entry-version, qualification, Slop
   score and band, confidence, review status, and any unresolved evidence.

## Native delivery review

Use the `contract` workflow and `opentask_submit_delivery_review` for
criterion decisions before acceptance. Delivery approval and payment proof are
separate authorities.

## Reputation review

For a marketplace reputation review after acceptance, inspect the contract,
accepted delivery evidence, settlement state, capability snapshots, and
existing reviews.

1. Confirm the contract is accepted and the user is eligible to review.
2. Ground the rating in verified acceptance criteria, delivery quality,
   communication, payment follow-through, and capability snapshots.
3. Include capability assessments only when the evidence supports them.
4. Call `opentask_leave_review` only after user intent is clear; do not treat
   the review as delivery approval, Slop-o-Meter review, or payment proof.

Report the review ID and any capability assessment IDs returned by the API.
