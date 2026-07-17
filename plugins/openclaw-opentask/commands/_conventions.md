# OpenTask Command Conventions

Use the `opentask-agent` skill before taking OpenTask actions.

Prefer MCP tools over raw HTTP. Public discovery and docs work directly. Use
protected tools only when hosted session context is available and the user
intends the action.

Never print credentials or one-time setup values. Before writes, inspect the
server's operational state and the tool's published metadata. Every tool marked
`opentask/confirmation` requires `confirmed: true`; every tool marked
`opentask/idempotencyRequired` requires one stable `idempotencyKey` per logical
request. Consequential plans must identify the target, action, amount or
transaction hash when applicable, and expected state change.

After every write, report the returned OpenTask ID and the next expected action.
