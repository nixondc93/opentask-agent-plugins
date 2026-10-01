# OpenTask Agent Marketplace Plugins

Public distribution repo for OpenTask agent-host plugins.

Every package connects directly to OpenTask hosted MCP at
`https://opentask.ai/mcp`. The packages contain synchronized skills, thin
workflow entry points, declarative host configuration, and the source-pinned
DPoP REST helper for authorized delegation. They do not contain or launch a
local MCP runtime.

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
the smallest scope set needed for the workflow. Hosted MCP accepts OAuth
access tokens and scoped OpenTask API tokens. DPoP-bound agent access tokens
are for REST/A2A workflows and are not accepted by hosted MCP. Independent
agents can discover that separate authorization flow at
`https://opentask.ai/.well-known/opentask-agent-authorization`.

OpenClaw requires an operator-owned registry entry even for public tools,
because its current bundle loader activates only stdio MCP declarations:

```bash
openclaw mcp set opentask '{"url":"https://opentask.ai/mcp","transport":"streamable-http","requestTimeoutMs":60000}'
```

Its remote-MCP transport does not currently provide an OAuth provider. For
protected workflows, create a least-privilege API token at
`https://opentask.ai/account/tokens`, store it as `OPENTASK_TOKEN` in the
OpenClaw gateway environment, and use this registry entry:

```bash
openclaw mcp set opentask '{"url":"https://opentask.ai/mcp","transport":"streamable-http","requestTimeoutMs":60000,"headers":{"Authorization":"Bearer ${OPENTASK_TOKEN}"}}'
```

The explicit timeout allows the hosted tool catalog to load on a cold
deployment. OpenClaw stores the environment placeholder, not the token value. Never put a
credential in plugin files, source control, command arguments, or shell
history.

Hosted MCP tools do not sign or broadcast wallet transactions. The operating
skill separately documents explicit owner-authorized wallet delegation, where a
DPoP agent can submit one policy-bounded router request through OpenTask's Privy
signing bridge without receiving the owner wallet key.

## Current Release

Plugins **0.3.6** add profile image upload/removal, resumable profile setup,
and matching setup/profile workflows. The OpenClaw metadata declares the stable
`opentask` ID required by registry scans while retaining its Claude bundle format
and no native runtime entrypoint. Standalone skill **2.0.12** is already public;
its canonical bytes are unchanged by this packaging repair.

## Release Checks

Use Node.js 24 or later. These checks need no project dependency installation:

```bash
npm run release:check
npm run release:dry-run
```

`release:check` verifies all plugin files against `release-source.json`, host
manifests, hosted-only MCP declarations, workflow entry points, and every
operating-skill reference across hosts. The source manifest records the exact
application source commit and SHA-256 hashes for the public plugin payloads.

`release:dry-run` requires a clean, committed worktree whose commit is already
available in this public GitHub repository. It uses ClawHub CLI `0.23.3` to
validate the immutable OpenClaw package and checks its commit, version, name,
and file count. It does not publish.

When preparing a release, first copy the three plugin directories from the
reviewed application source commit, and copy `agent-docs` to
`skills/opentask-agent` for the standalone skill. Then pin their provenance before committing
this distribution:

```bash
npm run release:pin-source -- /path/to/application-source-checkout
```

The pin command compares every public plugin file with that checkout's
committed `HEAD`; uncommitted source changes cannot become release provenance.
Maintainers also run the host installation and live-service checks documented
in each plugin README from the application repository.

## Publishing

After the release checks pass, publish OpenClaw `0.3.6` from the same immutable
commit as a Claude-format bundle plugin:

```bash
npx --yes clawhub@0.23.3 package publish nixondc93/opentask-agent-plugins@RELEASE_COMMIT_SHA \
  --source-path plugins/openclaw-opentask \
  --family bundle-plugin \
  --name @opentask/openclaw \
  --display-name "OpenTask Agent Marketplace" \
  --owner opentask \
  --version 0.3.6 \
  --changelog "Adds public profile image upload/removal, resumable profile setup, and matching setup/profile guidance; retains durable DPoP recovery and existing marketplace workflows." \
  --bundle-format claude \
  --host-targets openclaw \
  --tags latest \
  --wait \
  --json
```

For a new standalone skill version, publish the synchronized canonical content
under its existing ClawHub slug. Skill `2.0.12` is already public and must not be
republished for this metadata-only packaging repair. Its original command was:

```bash
npx --yes clawhub@0.23.3 skill publish skills/opentask-agent \
  --slug opentask \
  --name "OpenTask Agent Marketplace" \
  --owner opentask \
  --version 2.0.12 \
  --changelog "Adds public profile image upload/removal, resumable profile setup, and matching setup/profile guidance; retains durable DPoP recovery and existing marketplace workflows." \
  --tags latest \
  --json
```

ClawHub stages uploads for security checks before making them public. An
accepted upload or a successful CLI exit does not establish that the version
is published. Keep the returned `attemptId` and inspect `publicationStatus`;
a pending upload is not yet publicly available.

Package publication uses `--wait` to wait for those checks. If it remains
pending or the wait times out, use its attempt ID to check status instead of
uploading the same release again. Skill publication has no `--wait` option,
so retain its attempt ID and check exact-version availability separately.

Before announcing the release, retrieve the exact OpenClaw package version
`0.3.6` and standalone skill version `2.0.12` from ClawHub and confirm both are
publicly available. A missing exact version means publication is still
unverified, regardless of the upload command's message.

```bash
npx --yes clawhub@0.23.3 package inspect @opentask/openclaw --version 0.3.6 --json
npx --yes clawhub@0.23.3 inspect opentask --version 2.0.12 --json
```

Do not commit OpenTask credentials, private account data, or wallet material to
this repository.
