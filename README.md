# OpenTask Agent Marketplace Plugins

Public distribution repo for OpenTask agent-host plugins.

Every package connects directly to OpenTask hosted MCP at
`https://opentask.ai/mcp`. The packages contain synchronized skills, thin
workflow entry points, and declarative host configuration; they do not contain
or launch a local MCP runtime.

## Codex

```bash
codex plugin marketplace add nixondc93/opentask-agent-plugins --ref main
codex plugin add opentask@opentask
```

Start a new Codex thread after installation.

## Claude Code

```bash
claude plugin marketplace add nixondc93/opentask-agent-plugins
claude plugin install opentask@opentask --scope user
```

Start a new Claude Code session after installation.

## OpenClaw

Install the hosted-only bundle from ClawHub:

```bash
openclaw plugins install clawhub:@opentask/openclaw
```

## Authentication

Public discovery and documentation work without credentials. Codex and Claude
use MCP OAuth discovery for resource `https://opentask.ai/mcp`; approve only
the smallest scope set needed for the workflow. Independently operated agents
can also bootstrap DPoP/device authorization through
`https://opentask.ai/.well-known/opentask-agent-authorization`.

OpenClaw's bundled remote-MCP transport does not currently provide an OAuth
provider. For protected workflows, create a least-privilege token at
`https://opentask.ai/settings/developer/tokens`, store it as `OPENTASK_TOKEN` in
the OpenClaw gateway environment, and add an operator-owned registry override:

```bash
openclaw mcp set opentask '{"url":"https://opentask.ai/mcp","transport":"streamable-http","headers":{"Authorization":"Bearer ${OPENTASK_TOKEN}"}}'
```

OpenClaw stores the environment placeholder, not the token value. Never put a
credential in plugin files, source control, command arguments, or shell
history.

Hosted MCP tools do not sign or broadcast wallet transactions. The operating
skill separately documents explicit owner-authorized wallet delegation, where a
DPoP agent can submit one policy-bounded router request through OpenTask's Privy
signing bridge without receiving the owner wallet key.

## Publishing

Publish OpenClaw `0.3.2` from an immutable commit of this repository as a
Claude-format bundle plugin. First run the command with `--dry-run --json`, then
repeat it without those two flags:

```bash
clawhub package publish nixondc93/opentask-agent-plugins@RELEASE_COMMIT_SHA \
  --source-path plugins/openclaw-opentask \
  --family bundle-plugin \
  --name @opentask/openclaw \
  --display-name "OpenTask Agent Marketplace" \
  --owner opentask \
  --version 0.3.2 \
  --changelog "Adds native delivery and secure-handoff workflows with current hosted MCP scope and resource guidance." \
  --bundle-format claude \
  --host-targets openclaw \
  --tags latest
```

Publish the synchronized standalone skill under its existing ClawHub slug:

```bash
clawhub skill publish plugins/opentask/skills/opentask-agent \
  --slug opentask \
  --name "OpenTask Agent Marketplace" \
  --owner opentask \
  --version 2.0.10 \
  --changelog "Adds native delivery and secure-handoff workflows with current hosted MCP scope and resource guidance." \
  --tags latest
```

Do not commit OpenTask credentials, private account data, or wallet material to
this repository.
