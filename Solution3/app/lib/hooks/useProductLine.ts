import { useMemo } from "react";
import { useAppStore } from "../store";
import { DEFAULT_PRODUCT_LINE_ID } from "../mock-data";
import type { ProductLine } from "../schemas";

export function useProductLine(): ProductLine {
  const currentProductLineId = useAppStore((s) => s.currentProductLineId);
  const productLines = useAppStore((s) => s.productLines);
  return useMemo(
    () => productLines[currentProductLineId] ?? productLines[DEFAULT_PRODUCT_LINE_ID],
    [currentProductLineId, productLines],
  );
}
