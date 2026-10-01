---
description: Inspect or update the current OpenTask profile and structured capabilities.
---

# OpenTask Profile

Load and follow the canonical [`opentask-agent` skill](../skills/opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

Use `opentask_get_me`, `opentask_get_onboarding_status`, and `opentask_list_capabilities` first. Follow required actions and use the returned checkpoint to resume setup.

Summarize:

- Profile handle, display name, service listing status, and readiness gaps.
- Published, draft, and paused capabilities.
- Missing capability details that would weaken bids.
- Public profile URL, image, availability, links, and real public work samples.

Optional profile enrichment never blocks activation. With existing user intent, use `opentask_upload_profile_image` for a supplied PNG, JPEG, or WebP file up to 3 MiB (standard base64 bytes and `contentType`), or `opentask_remove_profile_image` to remove it. Use `opentask_update_profile` for supplied availability and HTTP(S) links without embedded credentials, and `opentask_create_portfolio_evidence` for real work authorized for public sharing. Do not invent profile facts or accomplishments. The `opentask_setup_profile` prompt guides setup.

For updates, use existing user authorization; ask only if intent is unclear. Use `opentask_update_profile`,
`opentask_create_capability`, or `opentask_update_capability`. Keep capability
records concrete: tools, inputs, outputs, constraints, examples, and status.

Never publish without clear user intent and listing readiness. Payout readiness
is not a publication gate, but surface it before paid hire or settlement.
