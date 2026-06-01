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

/**
 * Returns all descendant IDs (BFS) — used for cycle prevention in reparentEntity.
 */
export function getDescendantIds(
  entities: EntityStore,
  entityId: string,
): string[] {
  const result: string[] = [];
  const queue = [entityId];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const entity = entities[id];
    if (!entity) continue;
    for (const childId of entity.children) {
      result.push(childId);
      queue.push(childId);
    }
  }
  return result;
}

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

/** Slugify a title: lowercase, ASCII-fold accents, strip emoji, non-alphanumeric \u2192 "-", collapse/trim "-". Optionally keep only the first N words. */
export function slugify(title: string, opts?: { maxWords?: number }): string {
  let text = title ?? "";
  if (opts?.maxWords && opts.maxWords > 0) {
    text = text.trim().split(/\s+/).slice(0, opts.maxWords).join(" ");
  }
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")        // strip diacritics
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, "") // strip emoji
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Derive the prototype output directory. plSlug = full title; opp/sol = first 5 words. Returns null if any segment is empty. */
export function derivePrototypeOutputDir(productLineName: string, opportunityTitle: string, solutionTitle: string): string | null {
  const plSlug = slugify(productLineName);
  const oppSlug = slugify(opportunityTitle, { maxWords: 5 });
  const solSlug = slugify(solutionTitle, { maxWords: 5 });
  if (!plSlug || !oppSlug || !solSlug) return null;
  return `Product-Agent-app/public/prototypes/${plSlug}/${oppSlug}/${solSlug}/`;
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
    `Data: pa_get_entity("${entityId}")`,
  ].join("\n");
}

export function buildRootAnchor(productLineName: string, productLineId: string): string {
  return [
    `[Product Agent Context]`,
    `Product Line: ${productLineName}`,
    `View: Overview (full tree)`,
    `Data: pa_get_product_line("${productLineId}")`,
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
    `Data: pa_get_entity("${entityId}")`,
  ].join("\n");
}

export function buildStoryAnchor(
  store: EntityStore,
  productLineName: string,
  entityId: string,
  storyId: string,
  storyTitle: string,
): string {
  const base = buildEntityAnchor(store, productLineName, entityId);
  if (!base) return "";
  return base + `\nStory: ${storyId} — "${storyTitle}"`;
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

/** Instruction line that points the agent at this product line's design system. */
function designSystemInstruction(ds: ProductLine["settings"]["designSystem"]): string {
  if (ds.mode === "skill" && ds.skillName) {
    return `Use the \`${ds.skillName}\` skill for frontend.`;
  }
  // designMd mode (or skill without a name) — reference the settings, don't paste the content
  return `Use the design system in this product line's settings (design system steering) before building any frontend.`;
}

/** Human-readable label for the configured analytics platform, or null if none is set. */
function analyticsPlatformLabel(a: ProductLine["settings"]["analyticsPlatform"]): string | null {
  if (!a.platform) return null;
  if (a.platform === "other") {
    const name = a.mode === "manual" ? a.otherName?.trim() : undefined;
    return name || "the configured analytics platform";
  }
  const labels: Record<string, string> = {
    pendo: "Pendo",
    mixpanel: "Mixpanel",
    amplitude: "Amplitude",
    google_analytics: "Google Analytics",
  };
  return labels[a.platform] ?? "the configured analytics platform";
}

/** The analytics-platform block injected into the AC writer prompt. Parametrized from the product line's settings. */
function analyticsPlatformBlock(a: ProductLine["settings"]["analyticsPlatform"]): string {
  const label = analyticsPlatformLabel(a);
  if (a.platform === "other") {
    const name = (a.mode === "manual" ? a.otherName?.trim() : undefined) || "Analytics";
    return [
      `**Analytics platform:** ${name}`,
      `Embed each analytics event as a \`# ${name}: EventName (PropertyName: type)\` comment in the scenario where it fires.`,
      `${name} has no assumed standard SDK — describe events in platform-neutral terms.`,
    ].join("\n");
  }
  const name = label ?? "Analytics";
  return [
    `**Analytics platform:** ${name}`,
    `Embed each analytics event as a \`# ${name}: EventName (PropertyName: type)\` comment in the scenario where it fires.`,
    `Mirror the existing ${name} event-tracking conventions in this codebase where present.`,
  ].join("\n");
}

export function buildSolutionPlanningPrompt(
  store: EntityStore,
  productLine: ProductLine,
  entityId: string,
): string {
  const solution = store[entityId];
  if (!solution) return "";

  const settings = productLine.settings;
  const chain = getParentChain(store, entityId);
  const opportunity = chain.find((e) => e.level === "opportunity");
  const pathLabels = [...chain.map((e) => LEVEL_META[e.level].label), LEVEL_META[solution.level].label];

  const sections: string[] = [];

  // Context (at the beginning, mirroring the [Product Agent Context] anchor)
  sections.push([
    `[Product Agent Context]`,
    `Product Line: ${productLine.name} (id: ${productLine.id})`,
    `Path: ${pathLabels.join(" > ")}`,
    `Entity: "${solution.title}" (${solution.id})`,
    `Codebase: ${settings.codebasePath} — locate this folder in the working directory before acting on any other path.`,
    `Data: pa_get_entity("${entityId}")`,
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

  // Instructions (parametrized, mirroring the standard plan-and-implement flow)
  const steps: string[] = [];
  steps.push(`Plan the implementation of this solution.`);
  if (settings.storyMap.enabled) {
    steps.push(`Follow \`ProductSkills/story-map-updater/SKILL.md\` to include story map updates in your plan.`);
  }
  steps.push(`Ask clarifying questions before proceeding if anything is unclear.`);
  steps.push(designSystemInstruction(settings.designSystem));
  steps.push(`Follow existing patterns and conventions in the codebase.`);
  steps.push(`After the plan is ready, dispatch Sonnet subagents to implement the mechanical work.`);
  const analytics = analyticsPlatformLabel(settings.analyticsPlatform);
  if (analytics) {
    steps.push(`Instrument analytics using ${analytics} (the product line's configured platform).`);
  }
  sections.push([`## Instructions`, ``, ...steps.map((s, i) => `${i + 1}. ${s}`)].join("\n"));

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

export function buildPrototypePrompt(
  store: EntityStore,
  productLine: ProductLine,
  entityId: string,
): string | null {
  const entity = store[entityId];
  if (!entity) return null;

  const settings = productLine.settings;
  const chain = getParentChain(store, entityId);

  let solutionEntity: Entity | undefined;
  let opportunityEntity: Entity | undefined;

  if (entity.level === "solution") {
    solutionEntity = entity;
    opportunityEntity = chain.find((e) => e.level === "opportunity");
  } else {
    solutionEntity = [...chain].reverse().find((e) => e.level === "solution");
    opportunityEntity = [...chain].reverse().find((e) => e.level === "opportunity");
  }

  if (!solutionEntity || !opportunityEntity) return null;

  const outputDir = derivePrototypeOutputDir(productLine.name, opportunityEntity.title, solutionEntity.title);
  if (!outputDir) return null;

  const pathLabels = [...chain.map((e) => LEVEL_META[e.level].label), LEVEL_META[entity.level].label];

  const sections: string[] = [];

  // Context block
  const contextLines: string[] = [
    `[Product Agent Context]`,
    `Product Line: ${productLine.name} (id: ${productLine.id})`,
    `Path: ${pathLabels.join(" > ")}`,
    `Entity: "${entity.title}" (${entity.id})`,
  ];
  if (settings.codebasePath) {
    contextLines.push(`Codebase: ${settings.codebasePath} — locate this folder in the working directory before acting on any other path.`);
  }
  contextLines.push(`Output: ${outputDir}`);
  contextLines.push(`Data: pa_get_entity("${entityId}")`);
  sections.push(contextLines.join("\n"));

  // Opportunity section
  const oppLines: string[] = [
    `## Opportunity (Why)`,
    ``,
    `**"${opportunityEntity.title}"**`,
  ];
  if (opportunityEntity.description) oppLines.push(opportunityEntity.description);

  const persona = opportunityEntity.personaId
    ? (productLine.personas ?? []).find((p) => p.id === opportunityEntity!.personaId)
    : undefined;
  if (persona) {
    oppLines.push(`\n**Persona:** ${persona.name} — ${persona.description}`);
  }

  const oppBlocks = serializeBlocksToText(opportunityEntity.blocks);
  if (oppBlocks) oppLines.push(`\n${oppBlocks}`);

  sections.push(oppLines.join("\n"));

  // Solution section
  const solLines: string[] = [
    `## Solution (What)`,
    ``,
    `**"${solutionEntity.title}"**`,
  ];
  if (solutionEntity.description) solLines.push(solutionEntity.description);

  const solBlocks = serializeBlocksToText(solutionEntity.blocks);
  if (solBlocks) solLines.push(`\n${solBlocks}`);

  sections.push(solLines.join("\n"));

  // Instructions
  const steps: string[] = [];
  steps.push(`Use skill: ProductSkills/prototype-builder/SKILL.md`);
  steps.push(designSystemInstruction(settings.designSystem));
  steps.push(`Write the prototype to the Output path above.`);
  sections.push([`## Instructions`, ``, ...steps.map((s, i) => `${i + 1}. ${s}`)].join("\n"));

  return sections.join("\n\n---\n\n");
}

// ── User story slicer prompt for AI agents ───────────────────────────────

export function buildUserStorySlicerPrompt(productLine: ProductLine, solutionId: string): string {
  const entity = productLine.entities[solutionId];
  if (!entity || entity.level !== "solution") return "";

  const sections: string[] = [];
  sections.push(`Use skill: ProductSkills/user-story-slicer/SKILL.md`);
  sections.push([
    `Product Line: ${productLine.name}`,
    `Solution ID: ${solutionId}`,
  ].join("\n"));
  sections.push(`Data: Product-Agent-app/data/store.json`);

  return sections.join("\n\n---\n\n");
}

// ── User story AC writer prompt for AI agents ────────────────────────────

export function buildUserStoryAcWriterPrompt(productLine: ProductLine, solutionId: string): string {
  const entity = productLine.entities[solutionId];
  if (!entity || entity.level !== "solution") return "";

  const template = [
    `Use skill: ProductSkills/user-story-ac-writer/SKILL.md`,
    [
      `Product Line: ${productLine.name}`,
      `Solution ID: ${solutionId}`,
    ].join("\n"),
    `## Analytics Platform\n\n{{analyticsPlatformBlock}}`,
    `Data: Product-Agent-app/data/store.json`,
  ].join("\n\n---\n\n");

  return template.replace("{{analyticsPlatformBlock}}", analyticsPlatformBlock(productLine.settings.analyticsPlatform));
}

// ── Refine story prompt for AI agents ───────────────────────────────────

export function buildRefineStoryPrompt(
  store: EntityStore,
  productLineName: string,
  solutionId: string,
  story: { id: string; title: string; persona: string; activity: string; task: string; iteration: { kind: string; label: string } },
): string {
  const anchor = buildStoryAnchor(store, productLineName, solutionId, story.id, story.title);

  const positional = [
    `id: ${story.id}`,
    `title: ${story.title}`,
    `persona: ${story.persona}`,
    `activity: ${story.activity}`,
    `task: ${story.task}`,
    `iteration: ${story.iteration.label} (${story.iteration.kind})`,
  ].join("\n");

  const definitionRules = [
    `## Story Definition Rules`,
    ``,
    `Fields to write on the story record:`,
    `- narrative: { role, action, benefit } — INVEST-compliant: one user, one action, one benefit; small enough for one iteration`,
    `- context: existing system description + relevant constraints, written as prose (not bullets)`,
    `- outOfScope: items explicitly excluded; may reference other story numbers in this solution`,
    `- dependencies: other stories or systems this story depends on`,
    `- humanVerification: what the builder will check manually after the story ships`,
    ``,
    `Rules:`,
    `- narrative must be testable and deliverable in a single iteration`,
    `- context describes what exists today, not what will be built`,
    `- outOfScope sets clear boundaries to prevent scope creep`,
  ].join("\n");

  const workflow = [
    `## Workflow`,
    ``,
    `1. Confirm the slot context with the user: does the persona / activity / task / iteration feel right?`,
    `2. Draft the definition fields; ask one clarifying question at a time on genuine ambiguities`,
    `3. Write back via pa_update_entity({ entityId: "${solutionId}", patch: { stories: <updated array> } }) — match by story.id, preserve all other story fields`,
    `4. Immediately continue into ProductSkills/user-story-ac-writer/SKILL.md scoped to story id: ${story.id}`,
  ].join("\n");

  const sections = [
    anchor,
    `Action: REFINE this manually-added story`,
    `## Story Positional Data\n\n${positional}`,
    definitionRules,
    workflow,
  ];

  return sections.join("\n\n---\n\n");
}

// ── Write AC for a single story prompt for AI agents ────────────────────

export function buildWriteAcStoryPrompt(
  store: EntityStore,
  productLineName: string,
  solutionId: string,
  story: { id: string; title: string },
  analyticsPlatform: ProductLine["settings"]["analyticsPlatform"],
): string {
  const anchor = buildStoryAnchor(store, productLineName, solutionId, story.id, story.title);
  const sections = [
    anchor,
    `Use skill: ProductSkills/user-story-ac-writer/SKILL.md`,
    [
      `Solution ID: ${solutionId}`,
      `Scope: write acceptance criteria for ONLY story id: ${story.id}.`,
      `Skip the multi-story Phase 1 review — go straight to this one story, then write back via`,
      `pa_update_story({ entityId: "${solutionId}", storyId: "${story.id}", patch: { acceptanceCriteria, analyticsEvents } }).`,
    ].join("\n"),
    `## Analytics Platform\n\n${analyticsPlatformBlock(analyticsPlatform)}`,
  ];
  return anchor ? sections.join("\n\n---\n\n") : sections.slice(1).join("\n\n---\n\n");
}

// ── Plan & implement story prompt for AI agents ──────────────────────────

export function buildPlanImplementStoryPrompt(
  store: EntityStore,
  productLine: ProductLine,
  solutionId: string,
  storyId: string,
  storyTitle: string,
): string {
  const solution = store[solutionId];
  if (!solution) return "";

  const settings = productLine.settings;
  const chain = getParentChain(store, solutionId);
  const pathLabels = [...chain.map((e) => LEVEL_META[e.level].label), LEVEL_META[solution.level].label];

  const contextBlock = [
    `[Product Agent Context]`,
    `Product Line: ${productLine.name} (id: ${productLine.id})`,
    `Path: ${pathLabels.join(" > ")}`,
    `Entity: "${solution.title}" (${solution.id})`,
    `Codebase: ${settings.codebasePath} — locate this folder in the working directory before acting on any other path.`,
    `Data: pa_get_entity("${solutionId}")`,
    `Story: ${storyId} — "${storyTitle}"`,
  ].join("\n");

  const steps: string[] = [];
  steps.push(`Read story id ${storyId} from pa_get_entity above — read its acceptanceCriteria, context, outOfScope, dependencies, and humanVerification in full before doing anything else`);
  steps.push(`Plan the implementation of that story`);
  if (settings.storyMap.enabled) {
    steps.push(`Follow \`ProductSkills/story-map-updater/SKILL.md\``);
  }
  steps.push(`Ask clarifying questions before proceeding`);
  steps.push(designSystemInstruction(settings.designSystem));
  steps.push(`Follow existing patterns and conventions`);
  steps.push(`After the plan is ready, dispatch Sonnet subagents to implement the mechanical work`);
  const analytics = analyticsPlatformLabel(settings.analyticsPlatform);
  if (analytics) {
    steps.push(`Instrument analytics using ${analytics} (the product line's configured platform).`);
  }

  const numberedSteps = steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `${contextBlock}\n\n${numberedSteps}`;
}

export function buildPlanImplementIterationPrompt(
  store: EntityStore,
  productLineName: string,
  solutionId: string,
  iterationLabel: string,
  stories: { id: string; title: string }[],
): string {
  const anchor = buildEntityAnchor(store, productLineName, solutionId);
  const storyLines = stories.map((s) => `- ${s.id} — "${s.title}"`).join("\n");
  const header = anchor
    ? `${anchor}\nIteration: ${iterationLabel}\nStories:\n${storyLines}`
    : `Iteration: ${iterationLabel}\nStories:\n${storyLines}`;
  const instructions = [
    `1. Plan the implementation of the stories above`,
    `2. Follow ProductSkills/story-map-updater/SKILL.md`,
    `3. Ask clarifying questions before proceeding`,
    `4. Use the .claude/skills/product-agent-design skill for frontend`,
    `5. Follow existing patterns and conventions`,
    `6. After plan is ready, dispatch sonnet subagents`,
  ].join("\n");
  return `${header}\n\n${instructions}`;
}

// ── WIP briefing prompt for AI agents ────────────────────────────────────

export function buildWipBriefingPrompt(productLineName: string): string {
  const sections: string[] = [];
  sections.push(`Use skill: ProductSkills/wip-briefing/SKILL.md`);
  sections.push(`Product Line: ${productLineName}`);
  sections.push(`Data: Product-Agent-app/data/store.json`);
  return sections.join("\n\n---\n\n");
}

// ── Codebase detection prompt for AI agents ───────────────────────────────

export function buildCodebaseDetectionPrompt(productLine: ProductLine): string {
  const sections: string[] = [];
  sections.push(`Use skill: ProductSkills/codebase-detector/SKILL.md`);
  sections.push([
    `Product Line: ${productLine.name}`,
    `Product Line ID: ${productLine.id}`,
    `Codebase path: ${productLine.settings?.codebasePath ?? "(not set)"}`,
  ].join("\n"));
  sections.push(`Data: Product-Agent-app/data/store.json`);
  return sections.join("\n\n---\n\n");
}

// ── New product line setup prompt for AI agents ───────────────────────────

export function buildNewProductLineSetupPrompt(productLine: ProductLine): string {
  const sections: string[] = [];
  sections.push(`Use skill: ProductSkills/new-product-line-setup/SKILL.md`);
  const meta: string[] = [`Product Line: ${productLine.name}`];
  if (productLine.codePath) meta.push(`Code path: ${productLine.codePath}`);
  sections.push(meta.join("\n"));
  sections.push(`Data: Product-Agent-app/data/store.json`);
  return sections.join("\n\n---\n\n");
}
