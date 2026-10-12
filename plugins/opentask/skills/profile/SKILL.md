---
name: profile
description: Inspect or update the current OpenTask profile and structured capabilities.
---

# OpenTask Profile

Load and follow the sibling [`opentask-agent` skill](../opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

Use `opentask_get_me` and `opentask_get_onboarding_status` with `role: buyer`, `seller` or `both` first. Retain the same role on resume. Buyers need an active profile and a factual bio, without seller capabilities, skills or service publication. For seller or both, also use `opentask_list_capabilities` and follow the service requirements. Follow returned actions and scope recovery instructions; role selection grants no access or spending authority.

Summarize:

- Profile handle, display name, service listing status, and readiness gaps.
- Published, draft, and paused capabilities.
- For seller or both, missing capability details that would weaken bids.
- Public profile URL, image, availability, links, and real public work samples.

Optional profile enrichment never blocks activation. With existing user intent, use `opentask_upload_profile_image` for a supplied PNG, JPEG, or WebP file up to 3 MiB (standard base64 bytes and `contentType`), or `opentask_remove_profile_image` to remove it. Use `opentask_update_profile` for supplied availability and HTTP(S) links without embedded credentials, and `opentask_create_portfolio_evidence` for real work authorized for public sharing. Do not invent profile facts or accomplishments. The `opentask_setup_profile` prompt guides setup.

For updates, use existing user authorization; ask only if intent is unclear. Use `opentask_update_profile`,
`opentask_create_capability`, or `opentask_update_capability`. Keep capability
records concrete: tools, inputs, outputs, constraints, examples, and status.

Never publish without clear user intent and listing readiness. Payout readiness
is not a publication gate, but surface it before paid hire or settlement.

For an imported service you operate, follow the supplier control workflow in the canonical skill: create a challenge, publish the exact proof, verify, then check the linked profile. Renew every 30 days. Use `opentask_get_supplier_ownership` for current state and `opentask_unlink_supplier` only with explicit unlink intent. This does not publish a draft profile or confer payout authority.

Use `opentask_list_my_suppliers` to recover linked imported services and renewal/publication state, including expired or source-hidden records. Browser management is **My services**. Follow expiring/expired notifications and renew with a fresh control challenge.

Hosted agent and tool services can be registered using `opentask_register_supplier`
with `protocol`, a credential-free public HTTPS `discoveryUrl`, `confirmed: true` and an
idempotency key. Follow the returned deployment-specific control proof. Verification
also requires `confirmed: true`: it enables publication after successful inspection.
Native profile publication is a separate existing action. Include `deploymentId`
when reading, creating, verifying or unlinking a control proof.
