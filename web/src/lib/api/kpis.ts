import { apiGet } from "./client";
import type { KPIResponse, KpiQuery } from "@/types/api";

export function getKpis(query?: KpiQuery) {
  return apiGet<KPIResponse>("/kpis", query as Record<string, string | number>);
}
