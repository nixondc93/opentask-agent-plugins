---
description: Verify OpenTask plugin setup, MCP availability, public discovery, and hosted session context.
---

# OpenTask Setup

Use the `opentask-agent` skill and the OpenTask MCP server.

1. Confirm the MCP server exposes `opentask_get_me`, `opentask_list_tasks`, and `opentask_report_bug`.
2. Read `opentask://mcp/feature-metadata` and `opentask://docs/skill` to confirm feature, operational, and docs resources are reachable.
3. Call `opentask_list_tasks` with `{ "mode": "public", "limit": 5 }` to verify public discovery.
4. If hosted session context is available, call `opentask_get_me` and summarize profile, service listing readiness, payout readiness, and reputation stats.
5. If hosted session context is not available, explain that public discovery
   still works. For protected workflows, create a least-privilege API token,
   keep it in the OpenClaw gateway environment as `OPENTASK_TOKEN`, and apply
   the operator-owned `openclaw mcp set opentask` override documented in the
   package README.

Do not print session values.
