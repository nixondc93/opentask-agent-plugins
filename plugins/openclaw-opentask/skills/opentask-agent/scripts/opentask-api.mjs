#!/usr/bin/env node

const usage = `Usage:
  opentask-api.mjs [--public] METHOD PATH [JSON_BODY]
  opentask-api.mjs [--public] METHOD PATH --body JSON_BODY
  opentask-api.mjs [--public] METHOD PATH -

Environment:
  OPENTASK_BASE_URL or BASE_URL  Defaults to https://opentask.ai
  OPENTASK_TOKEN                 Bearer token for /api/agent/* endpoints

Examples:
  node opentask-api.mjs GET /api/agent/me
  node opentask-api.mjs --public GET '/api/tasks?skill=github'
  node opentask-api.mjs POST /api/agent/me/capabilities '{"name":"GitHub PR implementation","summary":"..."}'
`;

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

const args = process.argv.slice(2);
let publicRequest = false;

if (args.includes("--help") || args.includes("-h")) {
  console.log(usage);
  process.exit(0);
}

while (args[0] === "--public") {
  publicRequest = true;
  args.shift();
}

const method = args.shift()?.toUpperCase();
const pathOrUrl = args.shift();

if (!method || !pathOrUrl) {
  fail(usage);
}

let bodyText;
while (args.length > 0) {
  const arg = args.shift();
  if (arg === "--public") {
    publicRequest = true;
  } else if (arg === "--body" || arg === "-d") {
    bodyText = args.shift();
    if (bodyText === undefined) fail("Missing value for --body");
  } else if (arg === "-") {
    bodyText = await readStdin();
  } else if (bodyText === undefined) {
    bodyText = arg;
  } else {
    fail(`Unexpected argument: ${arg}`);
  }
}

const baseUrl = process.env.OPENTASK_BASE_URL || process.env.BASE_URL || "https://opentask.ai";
const url = /^https?:\/\//i.test(pathOrUrl)
  ? pathOrUrl
  : new URL(pathOrUrl, baseUrl).toString();

const headers = { Accept: "application/json" };
if (bodyText !== undefined) headers["Content-Type"] = "application/json";

const token = process.env.OPENTASK_TOKEN;
if (!publicRequest && token) headers.Authorization = `Bearer ${token}`;
if (!publicRequest && !token) {
  console.error("Warning: OPENTASK_TOKEN is not set; authenticated endpoints may return 401.");
}

let response;
try {
  response = await fetch(url, {
    method,
    headers,
    body: bodyText,
  });
} catch (error) {
  fail(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
}

const text = await response.text();
const contentType = response.headers.get("content-type") || "";
const requestId = response.headers.get("x-request-id");

if (!response.ok) {
  console.error(`HTTP ${response.status} ${response.statusText}${requestId ? ` request-id=${requestId}` : ""}`);
  if (text) console.error(text);
  process.exit(1);
}

if (!text) {
  process.exit(0);
}

if (contentType.includes("application/json")) {
  try {
    console.log(JSON.stringify(JSON.parse(text), null, 2));
  } catch {
    console.log(text);
  }
} else {
  console.log(text);
}
