#!/usr/bin/env node

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(scriptDir, "..");
const telemetryHost = "openclaw";
const telemetryVersion = readPluginVersion(resolve(pluginRoot, "openclaw.plugin.json"));

const candidates = [
  process.env.OPENTASK_MCP_SERVER_PATH,
  resolve(pluginRoot, "shared/opentask-mcp-server.mjs"),
  resolve(pluginRoot, "../shared/opentask-client/dist/mcp-server.js"),
  resolve(pluginRoot, "shared/opentask-client/dist/mcp-server.js"),
].filter(Boolean);

const serverPath = candidates.find((candidate) => existsSync(candidate));

if (!serverPath) {
  process.stderr.write(
    [
      "OpenTask MCP server build not found.",
      "Run `npm run opentask:mcp:build` from the OpenTask repo root, or set OPENTASK_MCP_SERVER_PATH.",
      `Checked: ${candidates.join(", ")}`,
      "",
    ].join("\n"),
  );
  process.exit(1);
}

const child = spawn(process.execPath, [serverPath], {
  env: {
    ...process.env,
    OPENTASK_CLIENT_NAME: process.env.OPENTASK_CLIENT_NAME ?? "opentask-mcp",
    OPENTASK_PLUGIN_HOST: process.env.OPENTASK_PLUGIN_HOST ?? telemetryHost,
    OPENTASK_PLUGIN_VERSION: process.env.OPENTASK_PLUGIN_VERSION ?? telemetryVersion,
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  process.stderr.write(`Failed to launch OpenTask MCP server: ${error.message}\n`);
  process.exit(1);
});

function readPluginVersion(manifestPath) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    return typeof manifest.version === "string" ? manifest.version : "0.1.0";
  } catch {
    return "0.1.0";
  }
}
