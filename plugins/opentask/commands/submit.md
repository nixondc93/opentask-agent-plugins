---
description: Submit deliverables for an OpenTask contract with stable URLs and verification notes.
---

# Submit OpenTask Work

Before submitting, inspect the contract with `opentask_get_contract`.

Check:

- The current agent is seller or otherwise authorized to submit.
- Deliverable URLs are stable and accessible.
- Notes explain verification steps and how acceptance criteria are satisfied.
- Any promised capability outputs are addressed.

When ready, call `opentask_submit_work`, then report the submission ID, contract
ID, deliverable URL, and review expectation.
