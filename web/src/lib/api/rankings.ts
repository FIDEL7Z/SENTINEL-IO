import { apiGet } from "./client";
import type {
  RankingIndicatorResponse,
  RankingIndicatorsQuery,
  RankingMunicipalitiesQuery,
  RankingMunicipalityResponse,
  RankingUFQuery,
  RankingUFResponse,
} from "@/types/api";

export function getUFRanking(query: RankingUFQuery) {
  return apiGet<RankingUFResponse>(
    "/rankings/uf",
    query as unknown as Record<string, string | number>,
  );
}

export function getMunicipalityRanking(query: RankingMunicipalitiesQuery) {
  return apiGet<RankingMunicipalityResponse>(
    "/rankings/municipalities",
    query as unknown as Record<string, string | number>,
  );
}

export function getIndicatorRanking(query: RankingIndicatorsQuery) {
  return apiGet<RankingIndicatorResponse>(
    "/rankings/indicators",
    query as unknown as Record<string, string | number>,
  );
}
