"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useIndicators, useTemporal, useYears } from "@/hooks/useApi";
import { formatNumber, monthAbbrPt } from "@/lib/utils/format";
import { useFiltersStore } from "@/store/filters";
import type { TemporalPoint } from "@/types/api";

interface ChartPoint {
  key: string;
  label: string;
  isFirstOfYear: boolean;
  historical: number | null;
  partial: number | null;
  raw: TemporalPoint;
}

function buildChartPoints(points: TemporalPoint[]): ChartPoint[] {
  const sorted = [...points].sort((a, b) => a.year - b.year || a.month - b.month);
  const firstPartialIndex = sorted.findIndex((p) => p.is_partial_year);

  return sorted.map((p, i) => {
    const inPartial = firstPartialIndex >= 0 && i >= firstPartialIndex - 1;
    return {
      key: `${p.year}-${p.month}`,
      label: `${monthAbbrPt(p.month)} ${p.year}`,
      isFirstOfYear: p.month === 1,
      historical: inPartial && i > firstPartialIndex - 1 ? null : p.value,
      partial: inPartial ? p.value : null,
      raw: p,
    };
  });
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: ChartPoint }[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const value = point.historical ?? point.partial;

  return (
    <div className="rounded-lg border border-border-strong bg-surface-raised px-3 py-2 text-sm shadow-xl">
      <div className="font-mono text-xs text-ink-muted">{point.label}</div>
      <div className="font-mono tabular text-ink">{value !== null ? formatNumber(value) : "—"}</div>
      {point.raw.is_partial_year && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-accent">
          Ano parcial
        </div>
      )}
    </div>
  );
}

export function TemporalSection() {
  const indicatorId = useFiltersStore((s) => s.indicatorId);
  const { data: indicatorsData } = useIndicators();
  const { data: years } = useYears();
  const minYear = years ? Math.min(...years) : undefined;
  const { data: temporal } = useTemporal(
    minYear ? { indicator_id: indicatorId, ano_inicio: minYear } : null,
  );

  const chartData = useMemo(() => (temporal ? buildChartPoints(temporal.data) : []), [temporal]);
  const partialStart = chartData.find((p) => p.partial !== null)?.key;
  const partialEnd = chartData.at(-1)?.key;
  const indicator = indicatorsData?.data.find((i) => i.id === indicatorId);

  return (
    <section className="border-b border-border py-16">
      <Container>
        <SectionHeading
          eyebrow="Série Mensal"
          title="Evolução temporal"
          description={indicator ? `${indicator.evento} · ${indicator.unidade}` : undefined}
        />

        <div className="mt-10 h-[340px] w-full">
          {chartData.length > 1 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="historicalFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-seq-5)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="var(--color-seq-5)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="partialFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="var(--color-border)" strokeDasharray="0" vertical={false} />

                {partialStart && partialEnd && (
                  <ReferenceArea
                    x1={partialStart}
                    x2={partialEnd}
                    fill="var(--color-accent)"
                    fillOpacity={0.05}
                    strokeOpacity={0}
                  />
                )}

                <XAxis
                  dataKey="key"
                  tickFormatter={(key: string) => {
                    const point = chartData.find((p) => p.key === key);
                    return point?.isFirstOfYear ? key.split("-")[0] : "";
                  }}
                  axisLine={{ stroke: "var(--color-border)" }}
                  tickLine={false}
                  tick={{ fill: "var(--color-ink-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                  interval={0}
                />
                <YAxis
                  tickFormatter={(v: number) => formatNumber(v)}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-ink-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                  width={56}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border-strong)" }} />

                <Area
                  type="monotone"
                  dataKey="historical"
                  stroke="var(--color-seq-5)"
                  strokeWidth={2}
                  fill="url(#historicalFill)"
                  connectNulls={false}
                  dot={false}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="partial"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  fill="url(#partialFill)"
                  connectNulls
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-2 flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 bg-[var(--color-seq-5)]" /> período completo
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-0.5 w-3"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--color-accent) 0 4px, transparent 4px 7px)",
              }}
            />
            ano parcial
          </span>
        </div>
      </Container>
    </section>
  );
}
