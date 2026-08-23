import type { GrupoSemantico, IndicatorResponse } from "@/types/api";

/** Whether a rising value reads as favorable, unfavorable, or carries no inherent judgment. */
export type Polarity = "down-is-favorable" | "up-is-favorable" | "neutral";

/** Per-indicator overrides where the semantic group's default polarity doesn't hold. */
const POLARITY_OVERRIDES: Record<number, Polarity> = {
  21: "up-is-favorable", // Pessoa Localizada
};

const GROUP_DEFAULT_POLARITY: Record<GrupoSemantico, Polarity> = {
  Vítimas: "down-is-favorable",
  Ocorrências: "down-is-favorable",
  "Ações Policiais": "neutral",
  "Apreensões (Peso)": "neutral",
  "Apreensões (Unidade)": "neutral",
  Serviços: "neutral",
};

export function getPolarity(indicator: Pick<IndicatorResponse, "id" | "grupo_semantico">): Polarity {
  return POLARITY_OVERRIDES[indicator.id] ?? GROUP_DEFAULT_POLARITY[indicator.grupo_semantico] ?? "neutral";
}

/** id 12 — Homicídio doloso. The indicator selected by default across the home page. */
export const DEFAULT_INDICATOR_ID = 12;

/**
 * The headline strip on the home page. Chosen for national relevance and
 * coverage across the "Vítimas" and "Ocorrências" groups — never mixed with
 * the derived drug-seizure composite below, which is peso-only.
 */
export const HEADLINE_INDICATOR_IDS = [12, 10, 17, 25] as const;

/**
 * "Apreensão de Cocaína" (id 1) and "Apreensão de Maconha" (id 2) share the
 * same unit (kg) and familia_medida ("peso"), so summing them client-side is
 * safe under the API's own rule against summing across families — this never
 * crosses a peso/contagem/vitima boundary. The API intentionally never
 * returns this combined total itself.
 */
export const DRUG_SEIZURE_COMPOSITE = {
  key: "drug-seizure-composite" as const,
  label: "Apreensão de Drogas",
  unit: "kg",
  indicatorIds: [1, 2] as const,
};
