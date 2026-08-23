"use client";

import { Sparkline } from "@/components/ui/Sparkline";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { useTemporal, useYoY } from "@/hooks/useApi";
import { DRUG_SEIZURE_COMPOSITE } from "@/lib/constants/indicators";
import { formatMonthRange, formatNumber } from "@/lib/utils/format";

const [COCAINE_ID, MARIJUANA_ID] = DRUG_SEIZURE_COMPOSITE.indicatorIds;

export function DrugCompositeCard() {
  const { data: yoyA } = useYoY({ indicator_id: COCAINE_ID });
  const { data: yoyB } = useYoY({ indicator_id: MARIJUANA_ID });

  const baseYear = yoyA?.comparison.base_year;
  const temporalA = useTemporal(
    baseYear ? { indicator_id: COCAINE_ID, ano_inicio: baseYear } : null,
  );
  const temporalB = useTemporal(
    baseYear ? { indicator_id: MARIJUANA_ID, ano_inicio: baseYear } : null,
  );

  const ready = yoyA && yoyB;
  const comparisonValue = ready ? yoyA.comparison_value + yoyB.comparison_value : null;
  const baseValue = ready ? yoyA.base_value + yoyB.base_value : null;
  const variationPercent =
    baseValue && baseValue !== 0 && comparisonValue !== null
      ? ((comparisonValue - baseValue) / baseValue) * 100
      : null;

  const seriesA = temporalA.data?.data ?? [];
  const seriesB = temporalB.data?.data ?? [];
  const sparkValues =
    seriesA.length && seriesB.length && seriesA.length === seriesB.length
      ? seriesA.map((p, i) => p.value + seriesB[i].value)
      : [];

  return (
    <div className="flex min-w-[240px] flex-1 flex-col rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] uppercase leading-tight tracking-wider text-ink-muted">
          {DRUG_SEIZURE_COMPOSITE.label}
        </span>
        <span
          className="mt-0.5 shrink-0 rounded-full border border-border-strong px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-muted"
          title="Soma de Apreensão de Cocaína + Apreensão de Maconha, mesma unidade (kg)"
        >
          composto
        </span>
      </div>

      <div className="mt-3 font-display text-4xl font-semibold tabular text-ink">
        {comparisonValue === null ? "···" : formatNumber(comparisonValue)}
        <span className="ml-1.5 align-middle font-sans text-sm font-normal text-ink-muted">kg</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <TrendBadge percent={variationPercent} polarity="neutral" />
        {sparkValues.length > 1 && (
          <Sparkline values={sparkValues} width={84} height={26} color="var(--color-ink-secondary)" />
        )}
      </div>

      <div className="mt-3 border-t border-border pt-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
        {yoyA
          ? formatMonthRange(yoyA.comparison.comparison_year, 1, yoyA.comparison.comparison_year, yoyA.comparison.months_compared)
          : "—"}
      </div>
    </div>
  );
}
