import useSWR from "swr";
import {
  getIndicatorRanking,
  getKpis,
  getMunicipalityRanking,
  getRadar,
  getTemporal,
  getUFRanking,
  getUFTotals,
  getYoY,
  listIndicators,
  listUFs,
} from "@/lib/api";
import { getMetadata, listYears } from "@/lib/api/metadata";
import type {
  KpiQuery,
  RadarQuery,
  RankingIndicatorsQuery,
  RankingMunicipalitiesQuery,
  RankingUFQuery,
  TemporalQuery,
  UFQuery,
  YoYQuery,
} from "@/types/api";

const REVALIDATE = { revalidateOnFocus: false, dedupingInterval: 60_000 };

export function useMetadata() {
  return useSWR("metadata", getMetadata, REVALIDATE);
}

export function useIndicators() {
  return useSWR("indicators", listIndicators, REVALIDATE);
}

export function useUFOptions() {
  return useSWR("ufs", listUFs, REVALIDATE);
}

export function useYears() {
  return useSWR("years", listYears, REVALIDATE);
}

export function useKpis(query: KpiQuery) {
  return useSWR(["kpis", query], () => getKpis(query), REVALIDATE);
}

export function useTemporal(query: TemporalQuery | null) {
  return useSWR(query ? ["temporal", query] : null, () => getTemporal(query as TemporalQuery), REVALIDATE);
}

export function useYoY(query: YoYQuery | null) {
  return useSWR(query ? ["yoy", query] : null, () => getYoY(query as YoYQuery), REVALIDATE);
}

export function useUFTotals(query: UFQuery | null) {
  return useSWR(query ? ["uf-totals", query] : null, () => getUFTotals(query as UFQuery), REVALIDATE);
}

export function useUFRanking(query: RankingUFQuery | null) {
  return useSWR(query ? ["uf-ranking", query] : null, () => getUFRanking(query as RankingUFQuery), REVALIDATE);
}

export function useMunicipalityRanking(query: RankingMunicipalitiesQuery | null) {
  return useSWR(
    query ? ["municipality-ranking", query] : null,
    () => getMunicipalityRanking(query as RankingMunicipalitiesQuery),
    REVALIDATE,
  );
}

export function useIndicatorRanking(query: RankingIndicatorsQuery | null) {
  return useSWR(
    query ? ["indicator-ranking", query] : null,
    () => getIndicatorRanking(query as RankingIndicatorsQuery),
    REVALIDATE,
  );
}

export function useRadar(query?: RadarQuery) {
  return useSWR(["radar", query ?? {}], () => getRadar(query), REVALIDATE);
}
