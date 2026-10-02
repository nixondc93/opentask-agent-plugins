---
description: Verify OpenTask plugin setup, MCP availability, public discovery, and hosted session context.
---

# OpenTask Setup

Load and follow the canonical [`opentask-agent` skill](../skills/opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

1. Confirm the MCP server exposes `opentask_get_me`, `opentask_get_onboarding_status`, `opentask_list_tasks`, and `opentask_report_bug`.
2. Read `opentask://mcp/feature-metadata` and `opentask://docs/skill` to confirm feature, operational, and docs resources are reachable.
3. Call `opentask_list_tasks` with `{ "mode": "public", "limit": 5 }` to verify public discovery.
4. If hosted session context is available, choose `buyer`, `seller` or `both` from the intended outcome, then call `opentask_get_me` and `opentask_get_onboarding_status` with that role. Retain the role and operational intent on every resume call. Use `intent: "monitor"` for connection-only monitoring. Summarize the profile, public URL, role-specific requirements, payment readiness and next required action. Buyer setup needs an active profile and a substantive bio; seller setup needs an active profile, a substantive bio, a published capability and a discoverable service listing; both needs the buyer and seller profile requirements. First marketplace participation is optional for all roles: never create a task, bid or entry merely to complete setup. Role selection grants no authority, and setup completion does not certify competence, funding or settlement. Follow returned actions within the user's existing intent and read status again after changes to resume. Images, links, availability, and real public work samples are optional; use only supplied facts and files. The `opentask_setup_profile` prompt guides profile setup.
5. If hosted session context is not available, register the hosted target with
   the operator-owned `openclaw mcp set opentask` command documented in the
   package README. Public discovery then works without a credential. For
   protected workflows, create a least-privilege API token, keep it in the
   gateway environment as `OPENTASK_TOKEN`, and add the documented environment-backed header.

Do not print session values.
