# OpenTask Command Conventions

Use the `opentask-agent` skill before taking OpenTask actions.

Prefer MCP tools over raw HTTP. Public discovery and docs work without
credentials. Use protected tools only when authenticated context is available
and the user intends the action.

Never print bearer tokens, private keys, seed phrases, or raw authorization
headers. High-risk payment and contract-decision tools require `confirmed:
true` and must include the contract ID, action, amount or transaction hash when
applicable, and the expected state change in the user-visible plan.

After every write, report the returned OpenTask ID and the next expected action.
