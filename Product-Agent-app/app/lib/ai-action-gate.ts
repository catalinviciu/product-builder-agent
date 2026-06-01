import { isSettingsFieldFilled, type SettingsFieldKey } from "./settings-redirect";
import { trackEvent } from "./analytics";
import type { ProductLine } from "./schemas";

type SettingsRedirect = {
  actionName: string;
  missingFields: SettingsFieldKey[];
  returnEntityId: string | null;
};

/**
 * Click-time gate for Plan & Implement actions. If required settings are missing,
 * fires the Story 6 redirect + AIActionBlocked and returns false (no prompt rendered).
 * Otherwise copies the prompt, fires AIActionPromptRendered, and returns true.
 */
export async function runGatedPlanImplement(opts: {
  productLine: ProductLine;
  requiredSettings: SettingsFieldKey[];
  actionName: string;
  returnEntityId: string;
  scope: "solution" | "story";
  buildPrompt: () => string;
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
    trackEvent("AIActionBlocked", { Action: "plan-implement", MissingFields: missing.join(",") });
    return false;
  }
  await navigator.clipboard.writeText(opts.buildPrompt());
  trackEvent("AIActionPromptRendered", { Action: "plan-implement", Scope: opts.scope });
  return true;
}
