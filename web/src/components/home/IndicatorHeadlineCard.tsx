"use client";

import { clsx } from "clsx";
import { Sparkline } from "@/components/ui/Sparkline";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { useTemporal, useYoY } from "@/hooks/useApi";
import { getPolarity } from "@/lib/constants/indicators";
import { formatMonthRange, formatNumber } from "@/lib/utils/format";
import { useFiltersStore } from "@/store/filters";
import type { IndicatorResponse } from "@/types/api";

export function IndicatorHeadlineCard({ indicator }: { indicator: IndicatorResponse }) {
  const { data: yoy, isLoading } = useYoY({ indicator_id: indicator.id });
  const temporalQuery = yoy
    ? { indicator_id: indicator.id, ano_inicio: yoy.comparison.base_year }
    : null;
  const { data: temporal } = useTemporal(temporalQuery);

  const polarity = getPolarity(indicator);
  const selectedIndicatorId = useFiltersStore((s) => s.indicatorId);
  const setIndicator = useFiltersStore((s) => s.setIndicator);
  const isSelected = selectedIndicatorId === indicator.id;

  const sparkValues = temporal?.data.map((p) => p.value) ?? [];

  return (
    <button
      type="button"
      onClick={() => setIndicator(indicator.id)}
      aria-pressed={isSelected}
      className={clsx(
        "group flex min-w-[240px] flex-1 flex-col rounded-2xl border p-5 text-left transition-all",
        isSelected
          ? "border-accent/50 bg-accent-dim"
          : "border-border bg-surface hover:border-border-strong",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] uppercase leading-tight tracking-wider text-ink-muted">
          {indicator.evento}
        </span>
        <span
          className={clsx(
            "mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
            isSelected ? "bg-accent" : "bg-transparent group-hover:bg-border-strong",
          )}
          aria-hidden
        />
      </div>

      <div className="mt-3 font-display text-4xl font-semibold tabular text-ink">
        {isLoading || !yoy ? "···" : formatNumber(yoy.comparison_value)}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <TrendBadge percent={yoy?.variation_percent ?? null} polarity={polarity} />
        {sparkValues.length > 1 && (
          <Sparkline values={sparkValues} width={84} height={26} color="var(--color-ink-secondary)" />
        )}
      </div>

      <div className="mt-3 border-t border-border pt-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
        {yoy
          ? formatMonthRange(yoy.comparison.comparison_year, 1, yoy.comparison.comparison_year, yoy.comparison.months_compared)
          : "—"}
      </div>
    </button>
  );
}
