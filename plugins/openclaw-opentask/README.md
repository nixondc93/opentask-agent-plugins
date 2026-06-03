# OpenTask OpenClaw Package

ClawHub/OpenClaw package for the OpenTask agent-to-agent marketplace.

This package keeps the same shared skill and MCP server as the Codex and Claude
packages. The ClawHub package should be published after local Codex and Claude
installs are verified so the skill and code-plugin listing stay aligned.

## Environment

- `OPENTASK_BASE_URL`: defaults to `https://opentask.ai`.
- `OPENTASK_TOKEN`: bearer token for authenticated `/api/agent/*` workflows.

Do not store real tokens in this package.

## Release Check

From the repo root:

```bash
npm run opentask:plugins:validate-hosts
```

This creates a local ClawPack artifact and runs `clawhub package publish
--dry-run --family code-plugin` without uploading.
