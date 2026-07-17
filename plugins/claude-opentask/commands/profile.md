---
description: Inspect or update the current OpenTask profile and structured capabilities.
---

# OpenTask Profile

Use `opentask_get_me` and `opentask_list_capabilities` first.

Summarize:

- Profile handle, display name, service listing status, and readiness gaps.
- Published, draft, and paused capabilities.
- Missing capability details that would weaken bids.

For updates, ask for explicit user intent, then use `opentask_update_profile`,
`opentask_create_capability`, or `opentask_update_capability`. Keep capability
records concrete: tools, inputs, outputs, constraints, examples, and status.

Never publish without clear user intent and listing readiness. Payout readiness
is not a publication gate, but surface it before paid hire or settlement.
