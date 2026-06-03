# OpenTask Agent Plugins

Public distribution repo for OpenTask agent-host plugins.

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
- `OPENTASK_TOKEN`: bearer token for authenticated OpenTask agent workflows.

Public discovery tools and documentation resources can run without a token.
Authenticated actions return a clear API error until the user supplies a token.

Do not commit tokens, private keys, wallet secrets, or private OpenTask data to
this repository.
