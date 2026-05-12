# Product Agent MCP Server — Architecture

## What this is

A small local TypeScript server that gives Claude Code (or any MCP-aware AI client) **scoped, typed access** to Product Agent's data. Instead of AI skills reading the whole `data/store.json` file (~600 KB, ~12K JSON lines, ~40–60K tokens per read), they call narrow tools like `pa_get_entity` or `pa_get_subtree` and pay 200–800 tokens per call.

The server is also the seam between "local single-user today" and "multi-tenant cloud tomorrow" — the same tool surface works against a local Next.js dev server now and a hosted API later.

---

## System diagram

### Today (local single-user)

```
┌───────────────────┐     stdio       ┌──────────────────────┐
│   Claude Code     │ ◄─────────────► │   product-agent-mcp  │
│   (with skills)   │   MCP protocol  │   (this server)      │
└───────────────────┘                 └─────────┬────────────┘
                                                │ HTTP
                                                ▼
                                      ┌──────────────────────┐
                                      │  Next.js app         │
                                      │  /api/store/*        │
                                      └─────────┬────────────┘
                                                │ fs read/write
                                                ▼
                                      ┌──────────────────────┐
                                      │  data/store.json     │
                                      └──────────────────────┘
```

### Tomorrow (multi-tenant cloud — no shape change)

```
┌───────────────────┐     stdio       ┌──────────────────────┐
│   Claude Code     │ ◄─────────────► │   product-agent-mcp  │
│   (with skills)   │   MCP protocol  │   (per-user, local)  │
└───────────────────┘                 └─────────┬────────────┘
                                                │ HTTPS + Bearer token
                                                ▼
                                      ┌──────────────────────┐
                                      │  Hosted API          │
                                      │  productagent.cloud  │
                                      │  (user-scoped)       │
                                      └─────────┬────────────┘
                                                │
                                                ▼
                                      ┌──────────────────────┐
                                      │  Firestore           │
                                      │  (or equivalent)     │
                                      └──────────────────────┘
```

The MCP server, the tool surface, and every skill stay identical. Only the adapter's `baseUrl` and `authToken` change.

---

## Request lifecycle

Example: a skill calls `pa_get_entity({ entityId: "po-1a" })`.

1. **Skill → MCP server.** Claude Code sends an MCP `tools/call` JSON-RPC message over stdio.
2. **Tool handler.** `src/tools/register.ts` validates the input against the Zod schema and invokes `adapter.getEntity("po-1a")`.
3. **Adapter → API.** `HttpStoreAdapter` sends `GET /api/store/entity/po-1a` to `PA_API_URL`. In cloud mode it also attaches `Authorization: Bearer <token>`.
4. **API handler.** The Next.js route at `Product-Agent-app/app/api/store/entity/[id]/route.ts` calls `readStore()`, runs migrations, finds the entity via `findEntity`, returns it.
5. **Response back.** The adapter unwraps `{ ok: true, data: ... }`, returns the entity.
6. **MCP response.** The tool handler stringifies the entity and returns it as a `text` content block to Claude.

Writes follow the same path with one extra hop: `withStoreMutex()` in `Product-Agent-app/app/api/store/_lib/storeAccess.ts` serializes the read→mutate→write cycle so two concurrent calls cannot race on the file.

---

## Tool catalogue

All tools live in `src/tools/register.ts`. They map 1:1 to `StoreAdapter` methods and to scoped API endpoints.

### Reads

| Tool | Returns | API endpoint |
|:-----|:--------|:-------------|
| `pa_list_product_lines` | Summaries for every product line | `GET /api/store/product-lines` |
| `pa_get_product_line` | Product line shell (no entity tree) | `GET /api/store/product-line/:id` |
| `pa_get_entity` | Single entity with blocks | `GET /api/store/entity/:id` |
| `pa_get_ancestors` | Parent chain root → leaf | `GET /api/store/entity/:id/ancestors` |
| `pa_get_subtree` | Entity + descendants to depth N | `GET /api/store/subtree/:id?depth=N` |
| `pa_get_context` | `{ productLine, ancestors, entity, descendants }` in one call | `GET /api/store/context/:id?...` |

### Writes

| Tool | Effect | API endpoint |
|:-----|:-------|:-------------|
| `pa_create_entity` | Creates an entity, validates parent/level | `POST /api/store/entity` |
| `pa_update_entity` | Patches safe fields (title, description, status, persona, ICE, …) | `PATCH /api/store/entity/:id` |
| `pa_delete_entity` | Deletes a **leaf only** — refuses with HTTP 409 + `blockedBy` child ids if non-leaf (matches UI behaviour) | `DELETE /api/store/entity/:id` |
| `pa_add_block` | Appends a block (accordion/pills/quote/metric) | `POST /api/store/entity/:id/block` |
| `pa_update_block` | Patches a block by index (label/content/items/…) | `PATCH /api/store/entity/:id/block/:idx` |

### Design rules

- **Narrow over toggles.** No über-tool with many optional flags. Smaller schemas = cheaper tokens + easier for Claude to pick correctly.
- **No identity in inputs.** Tools never accept `userId` / `orgId`. Identity comes from the adapter's auth token. See **Multi-tenant model** below.
- **Safe-field patching.** `pa_update_entity` and `pa_update_block` use allow-lists in `Product-Agent-app/app/api/store/_lib/storeAccess.ts` (`SAFE_ENTITY_FIELDS`, `SAFE_BLOCK_FIELDS`). Unknown keys are silently dropped — no surprise mutations of `id`, `level`, `children`, etc.

---

## Storage adapter pattern

`src/adapters/StoreAdapter.ts` defines the interface every storage backend must satisfy. Today there's one implementation:

- **`HttpStoreAdapter`** — talks to a JSON HTTP API. Used for both local (`http://localhost:3000`) and cloud (`https://productagent.cloud`) because the API shape is identical.

### Cloud swap path

Three things change when moving from local to hosted:

1. `PA_API_URL` env var → cloud URL.
2. `PA_AUTH_TOKEN` env var → user-scoped bearer token (loaded from OS keychain — never write tokens to plaintext config).
3. The Next.js `/api/store/*` routes gain a `requireUser()` middleware that resolves the token to a user and scopes every query by `req.user.id`.

The MCP server code, the tool surface, and every skill stay identical. That's the whole point of the adapter abstraction.

### Why not a `FileStoreAdapter` for local?

Tempting (skip the HTTP hop), but harmful for two reasons:

1. **Duplicates migration logic** — the API runs schema migrations on every read. A direct-file adapter would have to either re-implement those or read stale data.
2. **Breaks the cloud-readiness story** — direct file access is a habit that doesn't translate to cloud. By always going HTTP, we make sure every skill is already "cloud-ready" the day it ships.

---

## Multi-tenant model (forward-compatible)

The local version is single-user, but the design already obeys the rules that make multi-tenant safe:

### Rule 1 — Identity is never in the tool surface

No tool accepts `userId`, `accountId`, or `orgId`. A prompt-injected skill **cannot** ask for another user's data because the tools give it no way to express that question. Identity is set once at MCP server startup (`PA_AUTH_TOKEN` env var) and attached to every API request by the adapter.

### Rule 2 — The API is the security boundary

In cloud mode, the Next.js routes will:

1. Run `requireUser()` middleware that resolves the bearer token to a user.
2. Reject any read for an entity the user doesn't own.
3. Scope creates/updates by the authenticated user automatically.

The MCP server has zero knowledge of tenancy. If the isolation model changes (per-org sharing, role-based access, etc.), it's a one-place change in the API.

### Rule 3 — Per-user local MCP

Future cloud-MCP-as-a-service is **not** on the path. Every user runs their own local MCP server (like Linear and Notion's MCPs work today), signed in with their own token. If a token is compromised, only one user is affected.

---

## Schema-drift prevention

Three reinforcing layers — the first two are mechanical, the third is a CI gate. Drift is *physically impossible* if all three are in place.

### Layer 1 — Direct type import (mechanical)

`src/types.ts` re-exports `Entity`, `Block`, `ProductLine`, etc. **directly** from `../../Product-Agent-app/app/lib/schemas.ts`. The MCP server has no local copy of these types.

If the app changes `Entity`'s shape, tsc fails in the MCP server. No drift is *physically possible* at the type level.

### Layer 2 — Zod ↔ TS compile-time equivalence (mechanical)

Zod schemas in `src/tools/schemas.ts` need runtime validation for tool inputs. But Zod schemas are separate code from TS types — they can drift from each other.

Solution: each Zod schema has a compile-time assertion right next to it:

```ts
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
const _assertBlock: Exact<z.infer<typeof BlockSchema>, Block> = true;
```

If Zod and TypeScript disagree on a single field, `tsc` fails. Free at runtime, enforced at build time.

### Layer 3 — CI gate (process)

`npm run build` on `mcp-server/` should run in CI on every PR that touches `schemas.ts` or `mcp-server/**`. Catches anyone who pushes a schema change without updating MCP. (Not yet wired into CI — track this in the project follow-up list.)

### Behavioural rule (for humans)

Documented in `Product-Agent-app/CLAUDE.md`:

> When changing `schemas.ts`, run `npm run build` in `mcp-server/`. If it fails, update Zod schemas in MCP to match. Never relax the compile-time assertion to make a build pass.

---

## Operational notes

### Starting the server

The server is registered as a Claude Code MCP server via the repo's `.mcp.json` (project root). Claude Code launches it as a subprocess when needed.

To run it manually (e.g. for stdio smoke tests):

```sh
cd mcp-server
npm run build
PA_API_URL=http://localhost:3000 node dist/mcp-server/src/server.js
```

### Required runtime context

- The Next.js dev server (`npm run dev` in `Product-Agent-app/`) **must be running**. The MCP server fails every tool call with an HTTP error otherwise.
- Cloud mode: `PA_AUTH_TOKEN` must be set. Local mode: token is optional (the API doesn't enforce auth yet).

### Where logs go

The server writes to **stderr only** (stdout is reserved for the MCP protocol over stdio). Connection messages and errors appear in Claude Code's MCP logs. From the command line, run with `2>server.log` to capture stderr.

### Debugging a failing tool call

1. Confirm the Next.js dev server is up: `curl http://localhost:3000/api/store/mtime` should return 200.
2. Re-run `npm run build` in `mcp-server/` — stale `dist/` is the most common silent failure.
3. Invoke the underlying API endpoint with `curl` to isolate "is it the API or the MCP layer?":
   ```
   curl http://localhost:3000/api/store/entity/<id>
   ```
4. For an end-to-end stdio smoke test:
   ```
   (echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"x","version":"0.0.1"}}}'; \
    echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'; \
    echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"pa_list_product_lines","arguments":{}}}') \
    | node dist/mcp-server/src/server.js
   ```

### Concurrency

The Next.js API serializes all writes through a module-level Promise mutex in `_lib/storeAccess.ts`. Two MCP calls writing simultaneously will queue. Reads run concurrently.

If you ever see partial-write corruption in `data/store.json`, that's a bug — the API always writes via `tmp` file + rename for atomicity.

---

## File map

```
mcp-server/
├── ARCHITECTURE.md           ← this file
├── package.json              ← npm scripts, MCP SDK dep
├── tsconfig.json             ← rootDir set to repo root so types import works
├── src/
│   ├── server.ts             ← stdio entry point
│   ├── types.ts              ← re-exports from Product-Agent-app/app/lib/schemas.ts
│   ├── adapters/
│   │   ├── StoreAdapter.ts   ← the interface
│   │   └── HttpStoreAdapter.ts ← the only implementation
│   └── tools/
│       ├── schemas.ts        ← Zod schemas + compile-time drift assertions
│       └── register.ts       ← all 11 tools registered on the MCP server
└── dist/                     ← build output (gitignored)
```

```
Product-Agent-app/app/api/store/
├── _lib/storeAccess.ts       ← shared helpers used by every route
├── route.ts                  ← legacy GET/POST/DELETE full-document (kept for Zustand)
├── mtime/route.ts            ← change-detection endpoint (kept for 3s polling)
├── product-lines/route.ts    ← GET list
├── product-line/[id]/route.ts
├── entity/route.ts           ← POST create
├── entity/[id]/route.ts      ← GET / PATCH / DELETE (leaf-only)
├── entity/[id]/ancestors/route.ts
├── entity/[id]/block/route.ts          ← POST append
├── entity/[id]/block/[idx]/route.ts    ← PATCH update
├── subtree/[id]/route.ts
└── context/[id]/route.ts
```

```
.mcp.json                     ← repo-root Claude Code MCP config
```
