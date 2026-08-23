"use client";

import { useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { useIndicators, useMetadata, useTemporal, useYears } from "@/hooks/useApi";
import { getPolarity } from "@/lib/constants/indicators";
import { formatNumber, monthRangeLabel } from "@/lib/utils/format";
import { useFiltersStore } from "@/store/filters";

export function WhatChangedSection() {
  const indicatorId = useFiltersStore((s) => s.indicatorId);
  const { data: indicatorsData } = useIndicators();
  const { data: years } = useYears();
  const { data: meta } = useMetadata();

  const minYear = years ? Math.min(...years) : undefined;
  const { data: temporal } = useTemporal(
    minYear ? { indicator_id: indicatorId, ano_inicio: minYear } : null,
  );

  const cutoffMonth = meta?.dataset.partial_year
    ? Number(meta.dataset.end.split("-")[1])
    : 12;

  const perYear = useMemo(() => {
    if (!temporal || !years) return [];
    return [...years]
      .sort()
      .map((year) => {
        const total = temporal.data
          .filter((p) => p.year === year && p.month <= cutoffMonth)
          .reduce((sum, p) => sum + p.value, 0);
        return { year, total };
      });
  }, [temporal, years, cutoffMonth]);

  const indicator = indicatorsData?.data.find((i) => i.id === indicatorId);
  const polarity = indicator ? getPolarity(indicator) : "neutral";
  const isPartialWindow = cutoffMonth < 12;

  return (
    <section id="evolucao" className="border-b border-border py-16">
      <Container>
        <SectionHeading
          eyebrow="Comparação Anual"
          title="O que mudou?"
          description={
            indicator
              ? `${indicator.evento} — sempre comparado em períodos equivalentes de meses.`
              : undefined
          }
        />

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
          {perYear.map((point, i) => {
            const prev = perYear[i - 1];
            const percent =
              prev && prev.total !== 0 ? ((point.total - prev.total) / prev.total) * 100 : null;

            return (
              <div key={point.year} className="flex items-center gap-8">
                {i > 0 && (
                  <div className="flex flex-col items-center gap-1 text-ink-muted">
                    <span aria-hidden className="text-2xl">
                      →
                    </span>
                    <TrendBadge percent={percent} polarity={polarity} size="sm" />
                  </div>
                )}
                <div>
                  <div className="font-display text-4xl font-semibold tabular text-ink md:text-5xl">
                    {formatNumber(point.total)}
                  </div>
                  <div className="mt-1 font-mono text-xs text-ink-muted">{point.year}</div>
                </div>
              </div>
            );
          })}
        </div>

        {isPartialWindow && cutoffMonth && (
          <p className="mt-8 text-xs text-ink-muted">
            Comparação restrita a {monthRangeLabel(1, cutoffMonth)} de cada ano — o corte comparável,
            já que {meta?.dataset.end.split("-")[0]} ainda está incompleto.
          </p>
        )}
      </Container>
    </section>
  );
}
