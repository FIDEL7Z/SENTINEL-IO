import { apiGet } from "./client";
import type { MunicipalitiesQuery, MunicipalityResponse, UFQuery, UFResponse } from "@/types/api";

export function getUFTotals(query: UFQuery) {
  return apiGet<UFResponse>(
    "/geography/uf",
    query as unknown as Record<string, string | number>,
  );
}

export function getMunicipalityTotals(query: MunicipalitiesQuery) {
  return apiGet<MunicipalityResponse>(
    "/geography/municipalities",
    query as unknown as Record<string, string | number>,
  );
}
