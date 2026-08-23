/**
 * Types mirroring the Sentinel.io Analytics API OpenAPI schema (v1.0.0).
 * Source of truth: GET /openapi.json on the API itself.
 */

export type FamiliaMedida = "vitima" | "contagem" | "peso";

export type GrupoSemantico =
  | "Vítimas"
  | "Ações Policiais"
  | "Ocorrências"
  | "Apreensões (Peso)"
  | "Apreensões (Unidade)"
  | "Serviços";

export interface IndicatorResponse {
  id: number;
  evento: string;
  familia_medida: FamiliaMedida;
  unidade: string;
  tipo_indicador: string;
  grupo_semantico: GrupoSemantico;
}

export interface IndicatorListResponse {
  data: IndicatorResponse[];
  total: number;
}

export interface KPIFiltersEcho {
  indicator_id: number | null;
  uf: string | null;
  municipio: string | null;
  ano: number | null;
  abrangencia: string | null;
}

export interface KPIItem {
  indicator_id: number;
  indicator: string;
  familia_medida: FamiliaMedida;
  value: number;
  unit: string;
  n_registros: number;
}

export interface KPIResponse {
  filters: KPIFiltersEcho;
  data: KPIItem[];
}

export interface TemporalPoint {
  year: number;
  month: number;
  value: number;
  is_partial_year: boolean;
}

export interface TemporalResponse {
  indicator: string;
  indicator_id: number;
  familia_medida: FamiliaMedida;
  unit: string;
  data: TemporalPoint[];
}

export interface YoYComparison {
  base_year: number;
  comparison_year: number;
  months_compared: number;
  partial_period: boolean;
}

export interface YoYResponse {
  indicator: string;
  indicator_id: number;
  unit: string;
  base_value: number;
  comparison_value: number;
  variation_absolute: number;
  variation_percent: number | null;
  comparison: YoYComparison;
}

export interface UFItem {
  uf: string;
  regiao: string;
  value: number;
}

export interface UFResponse {
  indicator: string;
  indicator_id: number;
  unit: string;
  data: UFItem[];
}

export interface MunicipalityItem {
  uf: string;
  municipio: string;
  value: number;
}

export interface MunicipalityResponse {
  page: number;
  page_size: number;
  total: number;
  indicator: string;
  indicator_id: number;
  unit: string;
  data: MunicipalityItem[];
}

export interface RankingUFItem {
  rank: number;
  uf: string;
  regiao: string;
  value: number;
}

export interface RankingUFResponse {
  indicator: string;
  indicator_id: number;
  unit: string;
  ano: number;
  data: RankingUFItem[];
}

export interface RankingMunicipalityItem {
  rank: number;
  uf: string;
  municipio: string;
  value: number;
}

export interface RankingMunicipalityResponse {
  indicator: string;
  indicator_id: number;
  unit: string;
  ano: number;
  data: RankingMunicipalityItem[];
}

export interface RankingIndicatorItem {
  rank: number;
  evento: string;
  grupo_semantico: string;
  value: number;
}

export interface RankingIndicatorResponse {
  grupo_semantico: string;
  ano: number;
  data: RankingIndicatorItem[];
}

export interface RadarItem {
  indicator: string;
  year: number;
  month: number;
  value: number;
  historical_mean: number;
  standard_deviation: number;
  z_score: number | null;
}

export interface RadarResponse {
  data: RadarItem[];
  total: number;
}

export interface DatasetInfo {
  /** AAAA-MM of the first available month */
  start: string;
  /** AAAA-MM of the last available month */
  end: string;
  /** TRUE if the last year of the period is incomplete */
  partial_year: boolean;
}

export interface CoverageInfo {
  indicators: number;
  ufs: number;
  municipalities: number;
}

export interface MetadataResponse {
  dataset: DatasetInfo;
  coverage: CoverageInfo;
}

export interface UFOption {
  uf: string;
  regiao: string;
}

export interface AbrangenciaOption {
  abrangencia: string;
}

export interface MunicipalityOption {
  uf: string;
  municipio: string;
}

export interface ErrorDetail {
  code: string;
  message: string;
}

export interface ErrorResponse {
  error: ErrorDetail;
}

export interface KpiQuery {
  indicator_id?: number;
  uf?: string;
  municipio?: string;
  ano?: number;
  abrangencia?: string;
}

export interface TemporalQuery {
  indicator_id: number;
  uf?: string;
  municipio?: string;
  abrangencia?: string;
  ano_inicio?: number;
  ano_fim?: number;
}

export interface YoYQuery {
  indicator_id: number;
  base_year?: number;
  comparison_year?: number;
}

export interface UFQuery {
  indicator_id: number;
  ano?: number;
  mes?: number;
  regiao?: string;
  abrangencia?: string;
}

export interface MunicipalitiesQuery {
  indicator_id: number;
  uf?: string;
  ano?: number;
  page?: number;
  page_size?: number;
}

export interface RankingUFQuery {
  indicator_id: number;
  ano: number;
  limit?: number;
}

export interface RankingMunicipalitiesQuery {
  indicator_id: number;
  ano: number;
  limit?: number;
}

export interface RankingIndicatorsQuery {
  grupo_semantico: string;
  ano: number;
  limit?: number;
}

export interface RadarQuery {
  indicator_id?: number;
  ano?: number;
  min_abs_z?: number;
  limit?: number;
}
