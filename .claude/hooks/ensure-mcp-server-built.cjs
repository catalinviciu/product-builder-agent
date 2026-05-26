// ensure-mcp-server-built.cjs
//
// Build mcp-server/dist if it's missing. Runs as a Claude Code hook on:
//   - WorktreeCreate: hook input JSON carries the new worktree path
//   - SessionStart:   hook input has no worktree path; fall back to cwd
//
// Why: mcp-server/dist and mcp-server/node_modules are gitignored, so a
// fresh git worktree has nothing to spawn when .mcp.json references the
// built server. Without dist, the pa_* tools never register and skills
// that depend on the Product Agent MCP server break silently.
//
// Idempotent: no-op when mcp-server/dist already exists.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function readStdin() {
  return new Promise((resolve) => {
    let buf = "";
    if (process.stdin.isTTY) return resolve("");
    process.stdin.on("data", (d) => (buf += d));
    process.stdin.on("end", () => resolve(buf));
  });
}

function pickPath(payload) {
  const candidates = [
    payload?.tool_input?.path,
    payload?.tool_input?.worktree_path,
    payload?.tool_input?.cwd,
    payload?.tool_response?.path,
    payload?.tool_response?.worktree_path,
    payload?.worktree_path,
    payload?.path,
    payload?.cwd,
  ];
  return candidates.find((p) => typeof p === "string" && p.length > 0) || "";
}

// npm on Windows is npm.cmd; on POSIX it's npm. execFile (no shell) needs
// the exact filename so commands resolve correctly without shell help.
const NPM = process.platform === "win32" ? "npm.cmd" : "npm";

(async () => {
  const raw = await readStdin();
  let payload = {};
  if (raw.trim()) {
    try {
      payload = JSON.parse(raw);
    } catch {
      // ignore parse errors; we'll fall back to cwd
    }
  }

  const target = pickPath(payload) || process.cwd();

  const mcpServerDir = path.join(target, "mcp-server");
  const distDir = path.join(mcpServerDir, "dist");

  // Skip if this doesn't look like the product-agent repo
  if (!fs.existsSync(mcpServerDir)) return;

  // Already built — nothing to do
  if (fs.existsSync(distDir)) return;

  process.stdout.write(`Building product-agent MCP server in ${mcpServerDir} ...\n`);
  execFileSync(NPM, ["ci"], { cwd: mcpServerDir, stdio: "inherit" });
  execFileSync(NPM, ["run", "build"], { cwd: mcpServerDir, stdio: "inherit" });
  process.stdout.write("MCP server build complete.\n");
})();
