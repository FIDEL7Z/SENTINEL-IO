import { apiGet } from "./client";
import type { TemporalQuery, TemporalResponse, YoYQuery, YoYResponse } from "@/types/api";

export function getTemporal(query: TemporalQuery) {
  return apiGet<TemporalResponse>(
    "/temporal",
    query as unknown as Record<string, string | number>,
  );
}

export function getYoY(query: YoYQuery) {
  return apiGet<YoYResponse>(
    "/temporal/yoy",
    query as unknown as Record<string, string | number>,
  );
}
