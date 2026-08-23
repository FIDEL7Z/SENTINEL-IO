"use client";

import { Container } from "@/components/ui/Container";
import { useMetadata } from "@/hooks/useApi";
import { formatNumber, formatPeriodShort, monthAbbrPt } from "@/lib/utils/format";

function CoverageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-2xl tabular text-ink md:text-3xl">{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{label}</span>
    </div>
  );
}

export function Hero() {
  const { data: meta } = useMetadata();

  const endYear = meta ? Number(meta.dataset.end.split("-")[0]) : undefined;
  const endMonth = meta ? Number(meta.dataset.end.split("-")[1]) : undefined;

  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="grid-backdrop pointer-events-none absolute inset-0" />
      <Container className="relative py-20 md:py-28">
        <div className="fade-in font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Sentinel.io — Observatório de Dados
        </div>

        <h1 className="fade-in mt-6 font-display font-semibold leading-[0.92] tracking-tight">
          <span className="block text-[13vw] md:text-[7.5vw] lg:text-[6.5rem]">Segurança</span>
          <span className="block text-[13vw] md:text-[7.5vw] lg:text-[6.5rem]">
            Pública<span className="text-accent">.</span>
          </span>
        </h1>

        <div className="fade-in mt-8 flex flex-wrap items-end justify-between gap-8 border-t border-border pt-8">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-3xl tabular text-ink-secondary md:text-4xl">BRASIL</span>
            <span className="font-mono text-sm text-ink-muted">
              {meta ? (
                <>
                  {meta.dataset.start.split("-")[0]} — {endYear}
                  {meta.dataset.partial_year && (
                    <span className="ml-2 rounded-full border border-accent/40 bg-accent-dim px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
                      {endMonth ? `${monthAbbrPt(1)}–${monthAbbrPt(endMonth)} ${endYear} · dados parciais` : "dados parciais"}
                    </span>
                  )}
                </>
              ) : (
                "carregando período…"
              )}
            </span>
          </div>

          <div className="flex gap-10">
            <CoverageStat label="Indicadores" value={meta ? formatNumber(meta.coverage.indicators) : "—"} />
            <CoverageStat label="UFs" value={meta ? formatNumber(meta.coverage.ufs) : "—"} />
            <CoverageStat
              label="Municípios"
              value={meta ? formatNumber(meta.coverage.municipalities) : "—"}
            />
          </div>
        </div>

        {meta && (
          <p className="fade-in mt-4 text-xs text-ink-muted">
            Última atualização disponível: {formatPeriodShort(meta.dataset.end)}
          </p>
        )}
      </Container>
    </section>
  );
}
