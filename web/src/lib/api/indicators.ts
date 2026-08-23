import { apiGet } from "./client";
import type { IndicatorListResponse, IndicatorResponse } from "@/types/api";

export function listIndicators() {
  return apiGet<IndicatorListResponse>("/indicators");
}

export function getIndicator(indicatorId: number) {
  return apiGet<IndicatorResponse>(`/indicators/${indicatorId}`);
}
