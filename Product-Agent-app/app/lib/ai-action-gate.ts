import { isSettingsFieldFilled, type SettingsFieldKey } from "./settings-redirect";
import { trackEvent } from "./analytics";
import type { ProductLine } from "./schemas";

type SettingsRedirect = {
  actionName: string;
  missingFields: SettingsFieldKey[];
  returnEntityId: string | null;
};

/**
 * Click-time gate for AI actions. If required settings are missing,
 * fires the Story 6 redirect + AIActionBlocked and returns false (no prompt rendered).
 * Otherwise copies the prompt, fires AIActionPromptRendered, and returns true.
 * Returns false (no copy, no event) if buildPrompt returns null.
 */
export async function runGatedAIAction(opts: {
  action: "plan-implement" | "prototype";
  productLine: ProductLine;
  requiredSettings: SettingsFieldKey[];
  actionName: string;
  returnEntityId: string;
  scope: "solution" | "story";
  buildPrompt: () => string | null;
  openSettingsWithRedirect: (plId: string, redirect: SettingsRedirect) => void;
}): Promise<boolean> {
  const missing = opts.requiredSettings.filter(
    (key) => !isSettingsFieldFilled(opts.productLine.settings, key),
  );
  if (missing.length > 0) {
    opts.openSettingsWithRedirect(opts.productLine.id, {
      actionName: opts.actionName,
      missingFields: missing,
      returnEntityId: opts.returnEntityId,
    });
    trackEvent("AIActionBlocked", { Action: opts.action, MissingFields: missing.join(",") });
    return false;
  }
  const prompt = opts.buildPrompt();
  if (!prompt) return false;
  await navigator.clipboard.writeText(prompt);
  trackEvent("AIActionPromptRendered", { Action: opts.action, Scope: opts.scope });
  return true;
}
