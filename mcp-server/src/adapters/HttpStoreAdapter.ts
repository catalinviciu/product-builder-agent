import type {
  Block,
  Entity,
  ProductLine,
  CreateEntityInput,
  EntityContext,
  EntityNode,
  ProductLineSummary,
} from "../types.js";
import type { StoreAdapter } from "./StoreAdapter.js";

/**
 * HTTP-backed adapter. Calls the Next.js app's /api/store/* endpoints.
 *
 * Today:    baseUrl = http://localhost:3000  (local dev server)
 * Tomorrow: baseUrl = https://productagent.cloud, plus an auth token.
 *
 * Identity rule: this adapter is the ONLY place a token is attached.
 * Tool handlers don't know about identity. See ARCHITECTURE.md.
 */
export interface HttpStoreAdapterConfig {
  baseUrl: string;
  authToken?: string;
}

interface ApiOk<T> {
  ok: true;
  data: T;
}
interface ApiErr {
  ok: false;
  error: string;
}

export class HttpStoreAdapter implements StoreAdapter {
  private readonly baseUrl: string;
  private readonly authToken?: string;

  constructor(config: HttpStoreAdapterConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.authToken = config.authToken;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "content-type": "application/json",
      accept: "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    };
    if (this.authToken) headers["authorization"] = `Bearer ${this.authToken}`;

    const res = await fetch(`${this.baseUrl}${path}`, { ...init, headers });
    const body = (await res.json().catch(() => null)) as ApiOk<T> | ApiErr | null;
    if (!res.ok || !body || body.ok === false) {
      const msg = body && "error" in body ? body.error : `HTTP ${res.status}`;
      throw new Error(`${path}: ${msg}`);
    }
    return (body as ApiOk<T>).data;
  }

  // ── Reads ──────────────────────────────────────────────────────────

  listProductLines(): Promise<ProductLineSummary[]> {
    return this.request("/api/store/product-lines");
  }

  getProductLine(productLineId: string): Promise<ProductLine> {
    return this.request(`/api/store/product-line/${encodeURIComponent(productLineId)}`);
  }

  getEntity(entityId: string): Promise<Entity> {
    return this.request(`/api/store/entity/${encodeURIComponent(entityId)}`);
  }

  getAncestors(entityId: string): Promise<Entity[]> {
    return this.request(`/api/store/entity/${encodeURIComponent(entityId)}/ancestors`);
  }

  getSubtree(entityId: string, depth?: number): Promise<EntityNode> {
    const q = depth !== undefined ? `?depth=${depth}` : "";
    return this.request(`/api/store/subtree/${encodeURIComponent(entityId)}${q}`);
  }

  getContext(
    entityId: string,
    opts?: { ancestors?: boolean; descendantsDepth?: number; productLineMeta?: boolean }
  ): Promise<EntityContext> {
    const params = new URLSearchParams();
    if (opts?.ancestors !== undefined) params.set("ancestors", String(opts.ancestors));
    if (opts?.descendantsDepth !== undefined) params.set("descendantsDepth", String(opts.descendantsDepth));
    if (opts?.productLineMeta !== undefined) params.set("productLineMeta", String(opts.productLineMeta));
    const q = params.toString();
    return this.request(`/api/store/context/${encodeURIComponent(entityId)}${q ? `?${q}` : ""}`);
  }

  // ── Writes ─────────────────────────────────────────────────────────

  createEntity(input: CreateEntityInput): Promise<Entity> {
    return this.request("/api/store/entity", { method: "POST", body: JSON.stringify(input) });
  }

  updateEntity(entityId: string, patch: Partial<Entity>): Promise<Entity> {
    return this.request(`/api/store/entity/${encodeURIComponent(entityId)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  }

  async deleteEntity(entityId: string): Promise<void> {
    await this.request<{ deleted: string }>(`/api/store/entity/${encodeURIComponent(entityId)}`, {
      method: "DELETE",
    });
  }

  addBlock(entityId: string, block: Block): Promise<Entity> {
    return this.request(`/api/store/entity/${encodeURIComponent(entityId)}/block`, {
      method: "POST",
      body: JSON.stringify(block),
    });
  }

  updateBlock(entityId: string, blockIndex: number, patch: Partial<Block>): Promise<Entity> {
    return this.request(`/api/store/entity/${encodeURIComponent(entityId)}/block/${blockIndex}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  }
}
