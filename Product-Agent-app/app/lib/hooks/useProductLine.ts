import { useAppStore } from "../store";
import { selectCurrentProductLine } from "../selectors";
import type { ProductLine } from "../schemas";

export function useProductLine(): ProductLine {
  return useAppStore(selectCurrentProductLine);
}
