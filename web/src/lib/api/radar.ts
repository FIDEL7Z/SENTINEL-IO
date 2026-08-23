import { apiGet } from "./client";
import type { RadarQuery, RadarResponse } from "@/types/api";

export function getRadar(query?: RadarQuery) {
  return apiGet<RadarResponse>(
    "/radar",
    query as unknown as Record<string, string | number>,
  );
}
