import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import brazilStatesRaw from "./brazil-states.json";

export interface UFFeatureProperties {
  id: number;
  name: string;
  sigla: string;
  regiao_id: string;
}

export const brazilStates = brazilStatesRaw as unknown as FeatureCollection<
  Geometry,
  UFFeatureProperties
>;

export function buildBrazilPath(width: number, height: number, padding = 8) {
  const projection = geoMercator().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    brazilStates,
  );
  return geoPath(projection);
}

export function featureCentroid(
  pathGenerator: ReturnType<typeof geoPath>,
  feature: Feature<Geometry, UFFeatureProperties>,
) {
  return pathGenerator.centroid(feature);
}
