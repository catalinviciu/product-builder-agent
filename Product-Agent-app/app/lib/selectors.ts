import { DEFAULT_PRODUCT_LINE_ID } from "./schemas";
import type { AppStore } from "./store";

/** Returns the currently active ProductLine (falls back to default). */
export const selectCurrentProductLine = (s: AppStore) =>
  s.productLines[s.currentProductLineId] ?? s.productLines[DEFAULT_PRODUCT_LINE_ID];
