import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
const packageJson = json("package.json");
const hosts = ["opentask", "claude-opentask", "openclaw-opentask"];
const workflows = ["bid", "contract", "find-work", "payment", "profile", "review", "setup", "submit"];
const mcpUrl = "https://opentask.ai/mcp";
const publicRepository = "nixondc93/opentask-agent-plugins";
const manifestPath = "release-source.json";

function read(path) {
  return readFileSync(path, "utf8");
}

function json(path) {
  return JSON.parse(read(path));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function equal(actual, expected, label) {
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
  );
}

function files(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = join(path, entry.name);
    assert(!entry.isSymbolicLink(), `Symlinks are not release files: ${child}`);
    if (entry.isDirectory()) return files(child);
    assert(entry.isFile(), `Not a regular release file: ${child}`);
    return [child];
  }).sort();
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function inventory() {
  return Object.fromEntries(files("plugins").map((path) => [path, sha256(readFileSync(path))]));
}

function git(args, cwd = root, encoding = "utf8") {
  return execFileSync("git", args, { cwd, encoding, maxBuffer: 10 * 1024 * 1024 });
}

function check() {
  const manifest = json(manifestPath);
  equal(manifest.schemaVersion, 1, "Source manifest schema");
  assert(/^[a-f0-9]{40}$/.test(manifest.source?.commit), "Source manifest must pin a full source commit");
  equal(manifest.pluginVersion, packageJson.version, "Pinned plugin version");
  equal(manifest.skillVersion, packageJson.config.skillVersion, "Pinned standalone skill version");
  const actualFiles = inventory();
  equal(Object.keys(manifest.sha256).sort(), Object.keys(actualFiles), "Pinned source file inventory");
  for (const [path, hash] of Object.entries(actualFiles)) {
    equal(hash, manifest.sha256[path], `${path} pinned source hash`);
    assert([".json", ".md", ".svg", ".yaml", ".yml"].includes(extname(path)),
      `Distribution must remain declarative: ${path}`);
  }

  const versionPaths = [
    "plugins/opentask/.codex-plugin/plugin.json",
    "plugins/claude-opentask/.claude-plugin/plugin.json",
    "plugins/openclaw-opentask/package.json",
    "plugins/openclaw-opentask/openclaw.plugin.json",
    "plugins/openclaw-opentask/.claude-plugin/plugin.json",
  ];
  for (const path of versionPaths) equal(json(path).version, packageJson.version, `${path} version`);
  for (const path of [".claude-plugin/marketplace.json", "plugins/claude-opentask/.claude-plugin/marketplace.json"]) {
    const marketplace = json(path);
    equal(marketplace.plugins.length, 1, `${path} plugin count`);
    equal(marketplace.plugins[0].name, "opentask", `${path} plugin name`);
    equal(marketplace.plugins[0].version, packageJson.version, `${path} version`);
  }
  equal(json(".claude-plugin/marketplace.json").plugins[0].source, "./plugins/claude-opentask", "Claude marketplace source");
  equal(json("plugins/claude-opentask/.claude-plugin/marketplace.json").plugins[0].source, "./", "Local Claude marketplace source");
  const codexMarketplace = json(".agents/plugins/marketplace.json");
  equal(codexMarketplace.plugins.length, 1, "Codex marketplace plugin count");
  equal(codexMarketplace.plugins[0].name, "opentask", "Codex marketplace plugin name");
  equal(codexMarketplace.plugins[0].source, { source: "local", path: "./plugins/opentask" }, "Codex marketplace source");

  const expectedServers = {
    opentask: { url: mcpUrl, oauth_resource: mcpUrl },
    "claude-opentask": { type: "http", url: mcpUrl },
    "openclaw-opentask": { url: mcpUrl, transport: "streamable-http", requestTimeoutMs: 60000 },
  };
  for (const host of hosts) {
    equal(json(`plugins/${host}/.mcp.json`), { mcpServers: { opentask: expectedServers[host] } }, `${host} hosted MCP declaration`);
  }
  const codexManifest = json("plugins/opentask/.codex-plugin/plugin.json");
  equal(codexManifest.skills, "./skills/", "Codex skills location");
  equal(codexManifest.mcpServers, "./.mcp.json", "Codex MCP location");
  const openclawPackage = json("plugins/openclaw-opentask/package.json");
  for (const key of ["scripts", "dependencies", "devDependencies", "optionalDependencies", "bin", "main", "exports"]) {
    assert(!(key in openclawPackage), `OpenClaw bundle must not declare runtime/build machinery: ${key}`);
  }

  const skillsRoot = "plugins/opentask/skills";
  equal(readdirSync(skillsRoot).sort(), [...workflows, "opentask-agent"].sort(), "Codex skill set");
  for (const workflow of workflows) {
    assert(read(`${skillsRoot}/${workflow}/SKILL.md`).includes("../opentask-agent/SKILL.md"), `${workflow} must load the canonical skill`);
    assert(read(`${skillsRoot}/${workflow}/agents/openai.yaml`).includes(`$${workflow}`), `${workflow} metadata must invoke $${workflow}`);
  }

  const canonicalRoot = `${skillsRoot}/opentask-agent`;
  // Codex agent metadata is host-specific. Every other operating-skill file,
  // including newly added references, must ship byte-for-byte in every host.
  const canonicalFiles = files(canonicalRoot).map((path) => relative(canonicalRoot, path))
    .filter((path) => !path.startsWith("agents/"));
  for (const required of ["SKILL.md", "HEARTBEAT.md", "MESSAGING.md", "references/slop-o-meter.md"]) {
    assert(canonicalFiles.includes(required), `Missing operating guide: ${required}`);
  }
  for (const host of hosts.slice(1)) {
    const skillRoot = `plugins/${host}/skills/opentask-agent`;
    equal(files(skillRoot).map((path) => relative(skillRoot, path)), canonicalFiles, `${host} operating-skill file set`);
    for (const path of canonicalFiles) {
      equal(read(`${skillRoot}/${path}`), read(`${canonicalRoot}/${path}`), `${host} ${path} parity`);
    }
    const commandsRoot = `plugins/${host}/commands`;
    equal(readdirSync(commandsRoot).sort(), workflows.map((workflow) => `${workflow}.md`), `${host} command set`);
    for (const workflow of workflows) {
      assert(read(`${commandsRoot}/${workflow}.md`).includes("../skills/opentask-agent/SKILL.md"), `${host} ${workflow} must load the canonical skill`);
    }
  }
  console.log(`Verified ${Object.keys(actualFiles).length} source-pinned files, host manifests, hosted MCP declarations, workflows, and operating-skill parity.`);
}

function pinSource(sourceDirectory) {
  assert(sourceDirectory, "Usage: npm run release:pin-source -- /path/to/source-checkout");
  const sourceRoot = resolve(sourceDirectory);
  const commit = git(["rev-parse", "HEAD"], sourceRoot).trim();
  const hashes = inventory();
  const sourceFiles = git([
    "ls-tree", "-r", "--name-only", "-z", commit, "--",
    ...hosts.map((host) => `plugins/${host}`),
  ], sourceRoot).split("\0").filter(Boolean).sort();
  equal(Object.keys(hashes), sourceFiles, "Public plugin file set must match the committed source");
  for (const [path, hash] of Object.entries(hashes)) {
    const sourceBytes = git(["show", `${commit}:${path}`], sourceRoot, null);
    equal(hash, sha256(sourceBytes), `${path} must match the committed source`);
  }
  writeFileSync(manifestPath, `${JSON.stringify({
    schemaVersion: 1,
    source: { commit },
    pluginVersion: packageJson.version,
    skillVersion: packageJson.config.skillVersion,
    sha256: hashes,
  }, null, 2)}\n`);
  check();
}

function dryRun() {
  assert(git(["status", "--porcelain", "--untracked-files=all"]).trim() === "", "Release dry-run requires a clean distribution worktree; commit the reviewed release first.");
  check();
  const commit = git(["rev-parse", "HEAD"]).trim();
  assert(!process.env.RELEASE_SHA || process.env.RELEASE_SHA === commit, "RELEASE_SHA must match the checked-out immutable release commit");
  const output = execFileSync("npx", [
    "--yes", "clawhub@0.23.3", "package", "publish", `${publicRepository}@${commit}`,
    "--source-path", "plugins/openclaw-opentask",
    "--family", "bundle-plugin", "--name", "@opentask/openclaw",
    "--display-name", "OpenTask Agent Marketplace", "--owner", "opentask",
    "--version", packageJson.version, "--bundle-format", "claude",
    "--host-targets", "openclaw", "--tags", "latest", "--dry-run", "--json",
  ], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], maxBuffer: 10 * 1024 * 1024 });
  const result = JSON.parse(output);
  equal(result.version, packageJson.version, "ClawHub dry-run version");
  equal(result.commit, commit, "ClawHub dry-run commit");
  equal(result.name, "@opentask/openclaw", "ClawHub dry-run package");
  equal(result.files, files("plugins/openclaw-opentask").length, "ClawHub dry-run file count");
  console.log(`ClawHub dry-run accepted ${result.files} files from ${publicRepository}@${commit}.`);
}

try {
  const command = process.argv[2];
  if (command === "check") check();
  else if (command === "pin-source") pinSource(process.argv[3]);
  else if (command === "dry-run") dryRun();
  else throw new Error("Expected check, pin-source, or dry-run");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
