"use client";

import { useMemo, useRef, useState } from "react";
import { useUFTotals } from "@/hooks/useApi";
import { brazilStates, buildBrazilPath } from "@/lib/geo/projection";
import { SEQUENTIAL_RAMP, buildSequentialScale } from "@/lib/utils/colorScale";
import { formatNumber } from "@/lib/utils/format";
import { useFiltersStore } from "@/store/filters";

const WIDTH = 560;
const HEIGHT = 560;

export function BrazilMap({
  year,
  hoveredUF,
  onHoverUF,
  selectedUF,
  onSelectUF,
}: {
  year: number | undefined;
  hoveredUF: string | null;
  onHoverUF: (uf: string | null) => void;
  selectedUF: string | null;
  onSelectUF: (uf: string | null) => void;
}) {
  const indicatorId = useFiltersStore((s) => s.indicatorId);
  const { data } = useUFTotals(year ? { indicator_id: indicatorId, ano: year } : null);

  const pathGenerator = useMemo(() => buildBrazilPath(WIDTH, HEIGHT), []);

  const valuesByUF = useMemo(() => {
    const map = new Map<string, number>();
    data?.data.forEach((d) => map.set(d.uf, d.value));
    return map;
  }, [data]);

  const scale = useMemo(
    () => buildSequentialScale(Array.from(valuesByUF.values())),
    [valuesByUF],
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  function handleMove(e: React.MouseEvent<SVGPathElement>) {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const hoveredValue = hoveredUF ? valuesByUF.get(hoveredUF) : undefined;
  const hoveredFeature = hoveredUF
    ? brazilStates.features.find((f) => f.properties.sigla === hoveredUF)
    : undefined;

  const minValue = Math.min(...valuesByUF.values());
  const maxValue = Math.max(...valuesByUF.values());

  return (
    <div ref={wrapperRef} className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Mapa coroplético do Brasil por unidade federativa"
      >
        {brazilStates.features.map((feature) => {
          const sigla = feature.properties.sigla;
          const value = valuesByUF.get(sigla);
          const d = pathGenerator(feature) ?? "";
          const isHover = hoveredUF === sigla;
          const isSelected = selectedUF === sigla;

          return (
            <path
              key={sigla}
              d={d}
              fill={value !== undefined ? scale.colorFor(value) : "var(--color-surface-raised)"}
              stroke={isSelected ? "var(--color-accent)" : "var(--color-page)"}
              strokeWidth={isSelected ? 2.5 : 1}
              style={{
                transition: "fill .3s ease, opacity .2s ease",
                opacity: hoveredUF && !isHover ? 0.5 : 1,
                cursor: "pointer",
              }}
              onMouseEnter={() => onHoverUF(sigla)}
              onMouseMove={handleMove}
              onMouseLeave={() => {
                onHoverUF(null);
                setTooltipPos(null);
              }}
              onClick={() => onSelectUF(isSelected ? null : sigla)}
              onFocus={() => onHoverUF(sigla)}
              onBlur={() => onHoverUF(null)}
              tabIndex={0}
              role="button"
              aria-label={`${feature.properties.name}: ${value !== undefined ? formatNumber(value) : "sem dados"}`}
            />
          );
        })}
      </svg>

      {hoveredUF && tooltipPos && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border-strong bg-surface-raised px-3 py-2 text-sm shadow-xl"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
        >
          <div className="font-medium text-ink">{hoveredFeature?.properties.name ?? hoveredUF}</div>
          <div className="font-mono tabular text-ink-secondary">
            {hoveredValue !== undefined ? formatNumber(hoveredValue) : "sem dados"}
          </div>
        </div>
      )}

      {valuesByUF.size > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <span className="font-mono text-[10px] tabular text-ink-muted">{formatNumber(minValue)}</span>
          <div className="flex h-2 flex-1 overflow-hidden rounded-full">
            {SEQUENTIAL_RAMP.map((color) => (
              <span key={color} className="h-full flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
          <span className="font-mono text-[10px] tabular text-ink-muted">{formatNumber(maxValue)}</span>
        </div>
      )}
    </div>
  );
}
