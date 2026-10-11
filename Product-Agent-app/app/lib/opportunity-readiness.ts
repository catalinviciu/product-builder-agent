import type { EntityStore, ProductLine } from "./schemas";
import { getParentChain } from "./utils";

/** Opportunity blocks the solution spec loop needs before it can start. */
export const SPEC_LOOP_REQUIRED_BLOCKS = ["Trigger", "Current Workaround", "Desired end state"] as const;

/** Empty, or only the italic starter text the templates put in new entities and blocks. */
export function isPlaceholderText(text: string | undefined): boolean {
  const t = (text ?? "").trim();
  if (!t) return true;
  return /^\*[^*]+\*$/.test(t);
}

/**
 * What the opportunity is missing before the solution spec loop can run.
 * Returns human-readable item names; an empty array means ready.
 */
export function getSpecLoopMissing(store: EntityStore, productLine: ProductLine, opportunityId: string): string[] {
  const opp = store[opportunityId];
  if (!opp || opp.level !== "opportunity") return ["opportunity"];

  const missing: string[] = [];
  if (isPlaceholderText(opp.description)) missing.push("description");

  // Persona: the opportunity's own, else the nearest ancestor's (chain is root-first)
  const chain = getParentChain(store, opportunityId);
  const personaId = opp.personaId ?? [...chain].reverse().find((e) => e.personaId)?.personaId;
  const hasPersona = !!personaId && (productLine.personas ?? []).some((p) => p.id === personaId);
  if (!hasPersona) missing.push("persona");

  for (const label of SPEC_LOOP_REQUIRED_BLOCKS) {
    const block = opp.blocks.find(
      (b) => b.type === "accordion" && b.label.trim().toLowerCase() === label.toLowerCase(),
    );
    if (!block || block.type !== "accordion" || isPlaceholderText(block.content)) missing.push(label);
  }

  const parent = opp.parentId ? store[opp.parentId] : undefined;
  if (!parent || parent.level !== "product_outcome" || !parent.metricId) missing.push("product outcome metric");

  return missing;
}
