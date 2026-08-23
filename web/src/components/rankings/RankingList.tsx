"use client";

import { clsx } from "clsx";
import { useUFRanking } from "@/hooks/useApi";
import { formatNumber } from "@/lib/utils/format";
import { useFiltersStore } from "@/store/filters";

const LIMIT = 10;

export function RankingList({
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
  const { data, isLoading } = useUFRanking(
    year ? { indicator_id: indicatorId, ano: year, limit: LIMIT } : null,
  );

  const maxValue = data?.data[0]?.value ?? 0;

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-ink-muted">
        <span>Ranking nacional</span>
        <span>{data ? `${data.unit}` : ""}</span>
      </div>

      <ol className="flex flex-col">
        {isLoading &&
          Array.from({ length: LIMIT }).map((_, i) => (
            <li key={i} className="h-10 animate-pulse border-b border-border" />
          ))}

        {data?.data.map((item) => {
          const isActive = hoveredUF === item.uf || selectedUF === item.uf;
          const pct = maxValue ? (item.value / maxValue) * 100 : 0;

          return (
            <li key={item.uf}>
              <button
                type="button"
                onMouseEnter={() => onHoverUF(item.uf)}
                onMouseLeave={() => onHoverUF(null)}
                onClick={() => onSelectUF(selectedUF === item.uf ? null : item.uf)}
                className={clsx(
                  "flex w-full items-center gap-3 border-b border-border py-2 text-left transition-colors",
                  isActive && "bg-accent-dim",
                )}
              >
                <span className="w-5 shrink-0 font-mono text-xs tabular text-ink-muted">
                  {String(item.rank).padStart(2, "0")}
                </span>
                <span className="w-8 shrink-0 font-mono text-sm font-medium text-ink">{item.uf}</span>
                <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
                  <span
                    className={clsx(
                      "absolute inset-y-0 left-0 rounded-full transition-all",
                      isActive ? "bg-accent" : "bg-ink-secondary",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-20 shrink-0 text-right font-mono text-sm tabular text-ink">
                  {formatNumber(item.value)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
