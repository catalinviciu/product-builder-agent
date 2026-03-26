import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Entity, EntityStore, DiscoveryTree, Block, ProductLine } from "./schemas";
import { LEVEL_META } from "./schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

// ── Tree helpers ────────────────────────────────────────────────────────

export function getEntity(store: EntityStore, id: string): Entity | undefined {
  return store[id];
}

export function getParentChain(store: EntityStore, id: string): Entity[] {
  const chain: Entity[] = [];
  let current = store[id];
  while (current && current.parentId) {
    const parent = store[current.parentId];
    if (!parent) break;
    chain.unshift(parent);
    current = parent;
  }
  return chain;
}

export function getChildren(store: EntityStore, id: string): Entity[] {
  const entity = store[id];
  if (!entity || !entity.children) return [];
  return entity.children
    .map((childId) => store[childId])
    .filter((e): e is Entity => e !== undefined);
}

export function getRootEntities(store: EntityStore, tree: DiscoveryTree): Entity[] {
  return tree.rootChildren
    .map((id) => store[id])
    .filter((e): e is Entity => e !== undefined);
}

export function getEntityPreview(entity: Entity, maxLength = 120): string {
  let text = entity.description || "";
  if (!text) {
    const firstAccordion = entity.blocks.find((b) => b.type === "accordion");
    if (firstAccordion && firstAccordion.type === "accordion") {
      text = firstAccordion.content;
    }
  }
  if (!text) return "No content yet";
  if (text.length > maxLength) return text.slice(0, maxLength) + "\u2026";
  return text;
}

// ── Context anchor for AI agents ────────────────────────────────────────

export function buildEntityAnchor(
  store: EntityStore,
  productLineName: string,
  entityId: string,
): string {
  const entity = store[entityId];
  if (!entity) return "";
  const chain = getParentChain(store, entityId);
  const pathLabels = [...chain.map((e) => LEVEL_META[e.level].label), LEVEL_META[entity.level].label];
  return [
    `[Product Agent Context]`,
    `Product Line: ${productLineName}`,
    `Path: ${pathLabels.join(" > ")}`,
    `Entity: "${entity.title}" (${entity.id})`,
    `Data: Product-Agent-app/data/store.json`,
  ].join("\n");
}

export function buildRootAnchor(productLineName: string): string {
  return [
    `[Product Agent Context]`,
    `Product Line: ${productLineName}`,
    `View: Overview (full tree)`,
    `Data: Product-Agent-app/data/store.json`,
  ].join("\n");
}

export function buildBlockAnchor(
  store: EntityStore,
  productLineId: string,
  productLineName: string,
  entityId: string,
  blockId: string,
): string {
  const entity = store[entityId];
  if (!entity) return "";
  const blockIndex = entity.blocks.findIndex((b) => b.id === blockId);
  if (blockIndex === -1) return "";
  const block = entity.blocks[blockIndex];
  const chain = getParentChain(store, entityId);
  const pathLabels = [...chain.map((e) => LEVEL_META[e.level].label), LEVEL_META[entity.level].label];
  const blockLabel = block.type === "accordion" ? block.label
    : block.type === "metric" ? (block.metric || "Metric")
    : block.type === "quote" ? "Evidence quote"
    : "Tags";
  return [
    `[Product Agent Context]`,
    `Product Line: ${productLineName}`,
    `Path: ${pathLabels.join(" > ")}`,
    `Entity: "${entity.title}" (${entity.id})`,
    `Block: "${blockLabel}" [${block.type}] (${block.id})`,
    `JSONPath: ["${productLineId}"].entities["${entityId}"].blocks[${blockIndex}]`,
    `Data: Product-Agent-app/data/store.json`,
  ].join("\n");
}

// ── Block serialization for AI prompts ──────────────────────────────────

export function serializeBlocksToText(blocks: Block[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case "accordion":
        if (block.content) parts.push(`### ${block.label}\n${block.content}`);
        break;
      case "metric":
        if (block.metric) {
          const timeframeSuffix = block.timeframe ? ` (by ${block.timeframe})` : "";
          parts.push(`**${block.metric}:** ${block.currentValue} → ${block.targetValue}${timeframeSuffix}`);
        }
        break;
      case "pills":
        if (block.items.length > 0) {
          parts.push(`**Tags:** ${block.items.map((i) => i.label).join(", ")}`);
        }
        break;
      case "quote":
        if (block.content) {
          const attribution = block.attribution ? `\n> — ${block.attribution}` : "";
          parts.push(`> ${block.content}${attribution}`);
        }
        break;
    }
  }
  return parts.join("\n\n");
}

// ── Opportunity writing prompt for AI agents ─────────────────────────────

export function buildOpportunityWriterPrompt(
  store: EntityStore,
  productLine: ProductLine,
  entityId: string,
): string {
  const entity = store[entityId];
  if (!entity) return "";

  const isProductOutcome = entity.level === "product_outcome";
  const isOpportunity = entity.level === "opportunity";

  if (!isProductOutcome && !isOpportunity) return "";

  const sections: string[] = [];

  sections.push(`Use skill: ProductSkills/opportunity-writer/SKILL.md`);

  if (isProductOutcome) {
    sections.push(`Action: Write a NEW opportunity`);
    sections.push([
      `Product Line: ${productLine.name}`,
      `Parent Product Outcome ID: ${entity.id}`,
    ].join("\n"));
  } else {
    sections.push(`Action: UPDATE existing opportunity`);
    sections.push([
      `Product Line: ${productLine.name}`,
      `Opportunity ID: ${entity.id}`,
    ].join("\n"));
  }

  sections.push(`Data: Product-Agent-app/data/store.json`);

  return sections.join("\n\n---\n\n");
}

// ── Solutions brainstormer prompt for AI agents ─────────────────────────

export function buildSolutionsBrainstormerPrompt(
  store: EntityStore,
  productLine: ProductLine,
  entityId: string,
): string {
  const entity = store[entityId];
  if (!entity || entity.level !== "opportunity") return "";

  const sections: string[] = [];
  sections.push(`Use skill: ProductSkills/solutions-brainstormer/SKILL.md`);
  sections.push([
    `Product Line: ${productLine.name}`,
    `Opportunity ID: ${entity.id}`,
  ].join("\n"));
  sections.push(`Data: Product-Agent-app/data/store.json`);

  return sections.join("\n\n---\n\n");
}

// ── Solution planning prompt for AI agents ──────────────────────────────

export function buildSolutionPlanningPrompt(
  store: EntityStore,
  productLine: ProductLine,
  entityId: string,
): string {
  const solution = store[entityId];
  if (!solution) return "";

  const chain = getParentChain(store, entityId);
  const opportunity = chain.find((e) => e.level === "opportunity");

  const codePathLine = productLine.codePath
    ? productLine.codePath
    : "Not specified — set it in Product Line settings";

  const sections: string[] = [];

  // Header
  sections.push(`# Planning Prompt: "${solution.title}"`);

  // Context
  sections.push([
    `## Context`,
    ``,
    `You are planning the implementation of a solution within the Product Agent discovery tree.`,
    ``,
    `**Product Line:** ${productLine.name}`,
    `**Codebase:** ${codePathLine}`,
  ].join("\n"));

  // Opportunity section
  if (opportunity) {
    const oppLines: string[] = [
      `## Opportunity (Why)`,
      ``,
      `**"${opportunity.title}"**`,
    ];
    if (opportunity.description) oppLines.push(opportunity.description);

    // Persona
    const persona = opportunity.personaId
      ? (productLine.personas ?? []).find((p) => p.id === opportunity.personaId)
      : undefined;
    if (persona) {
      oppLines.push(`\n**Persona:** ${persona.name} — ${persona.description}`);
    }

    const oppBlocks = serializeBlocksToText(opportunity.blocks);
    if (oppBlocks) oppLines.push(`\n${oppBlocks}`);

    sections.push(oppLines.join("\n"));
  } else {
    sections.push(`## Opportunity (Why)\n\n*No parent opportunity found — this solution may be at the top of the tree.*`);
  }

  // Solution section
  const solLines: string[] = [
    `## Solution (What)`,
    ``,
    `**"${solution.title}"**`,
  ];
  if (solution.description) solLines.push(solution.description);

  const solBlocks = serializeBlocksToText(solution.blocks);
  if (solBlocks) solLines.push(`\n${solBlocks}`);

  sections.push(solLines.join("\n"));

  // Instructions
  sections.push([
    `## Instructions`,
    ``,
    `1. Plan the implementation of this solution in the codebase at \`${productLine.codePath || codePathLine}\`.`,
    `2. Read and follow \`ProductSkills/story-map-updater/SKILL.md\` to include story map updates as part of your plan.`,
    `3. Ask clarifying questions before proceeding if anything is unclear.`,
    `4. Follow existing patterns and conventions in the codebase.`,
  ].join("\n"));

  return sections.join("\n\n---\n\n");
}

export function buildAssumptionTesterPrompt(
  store: EntityStore,
  productLine: ProductLine,
  entityId: string,
): string {
  const entity = store[entityId];
  if (!entity || entity.level !== "solution") return "";

  const sections: string[] = [];
  sections.push(`Use skill: ProductSkills/assumption-tester/SKILL.md`);
  sections.push([
    `Product Line: ${productLine.name}`,
    `Solution ID: ${entity.id}`,
  ].join("\n"));
  sections.push(`Data: Product-Agent-app/data/store.json`);

  return sections.join("\n\n---\n\n");
}

export function buildPrototypeBuilderPrompt(
  store: EntityStore,
  productLine: ProductLine,
  entityId: string,
): string {
  const entity = store[entityId];
  if (!entity) return "";

  const sections: string[] = [];
  sections.push(`Use skill: ProductSkills/prototype-builder/SKILL.md`);
  sections.push([
    `Product Line: ${productLine.name}`,
    `Entity ID: ${entity.id}`,
    `Entity Level: ${entity.level}`,
  ].join("\n"));
  sections.push(`Data: Product-Agent-app/data/store.json`);

  return sections.join("\n\n---\n\n");
}

// ── WIP briefing prompt for AI agents ────────────────────────────────────

export function buildWipBriefingPrompt(productLineName: string): string {
  const sections: string[] = [];
  sections.push(`Use skill: ProductSkills/wip-briefing/SKILL.md`);
  sections.push(`Product Line: ${productLineName}`);
  sections.push(`Data: Product-Agent-app/data/store.json`);
  return sections.join("\n\n---\n\n");
}
