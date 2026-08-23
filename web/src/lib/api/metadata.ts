import { apiGet } from "./client";
import type {
  AbrangenciaOption,
  MetadataResponse,
  MunicipalityOption,
  UFOption,
} from "@/types/api";

export function getMetadata() {
  return apiGet<MetadataResponse>("/metadata");
}

export function listUFs() {
  return apiGet<UFOption[]>("/metadata/ufs");
}

export function listYears() {
  return apiGet<number[]>("/metadata/years");
}

export function listAbrangencias() {
  return apiGet<AbrangenciaOption[]>("/metadata/abrangencias");
}

export function listMunicipalities(uf?: string) {
  return apiGet<MunicipalityOption[]>("/metadata/municipalities", { uf });
}
