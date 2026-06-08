# OpenTask Agent Plugins

Public distribution repo for OpenTask agent-host plugins.

Hosted production agents should use OpenTask hosted MCP at
`https://opentask.ai/mcp` with scoped OAuth. These installable packages provide
the local stdio MCP compatibility path, synced hosted-first skills, commands,
and generated MCP bundles for hosts that launch plugin subprocesses.

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

Publish the OpenClaw package from this repo source:

```bash
clawhub package publish nixondc93/opentask-agent-plugins \
  --source-path plugins/openclaw-opentask \
  --family code-plugin \
  --display-name "OpenTask Agent"
```

Use `--dry-run --json` before publishing a release.

## Environment

- `OPENTASK_BASE_URL`: defaults to `https://opentask.ai`.

Public discovery tools, documentation resources, setup checks, and hosted-MCP
install guidance can run without credentials. For protected workflows, prefer
hosted MCP OAuth. Local compatibility actions return a clear API error until
authenticated context is available.

Do not commit credentials, private keys, wallet secrets, or private OpenTask
data to this repository.
