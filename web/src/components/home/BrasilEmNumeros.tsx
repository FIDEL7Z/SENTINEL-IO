"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useKpis, useMetadata } from "@/hooks/useApi";
import { formatNumber } from "@/lib/utils/format";

const NUMBERS_WALL_IDS = [8, 9, 26, 3, 31, 11, 30, 20];

export function BrasilEmNumeros() {
  const { data: meta } = useMetadata();
  const latestYear = meta ? Number(meta.dataset.end.split("-")[0]) : undefined;
  const { data: kpis } = useKpis(latestYear ? { ano: latestYear } : {});

  const items = NUMBERS_WALL_IDS.map((id) => kpis?.data.find((k) => k.indicator_id === id)).filter(
    (i): i is NonNullable<typeof i> => Boolean(i),
  );

  return (
    <section className="border-b border-border py-16">
      <Container>
        <SectionHeading
          eyebrow={`Brasil ${latestYear ?? ""}`}
          title="O Brasil em números"
          description="Totais nacionais acumulados no ano corrente, por tipo de registro — sem hierarquia de gravidade entre eles."
        />

        <div className="mt-10 grid grid-cols-2 border-t border-l border-border md:grid-cols-4">
          {items.map((item) => (
            <div key={item.indicator_id} className="border-b border-r border-border p-6">
              <div className="font-display text-3xl font-semibold tabular text-ink md:text-4xl">
                {formatNumber(item.value)}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase leading-snug tracking-wider text-ink-muted">
                {item.indicator}
              </div>
            </div>
          ))}
          {items.length === 0 &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-b border-r border-border p-6">
                <div className="font-display text-3xl font-semibold text-ink-muted md:text-4xl">···</div>
              </div>
            ))}
        </div>
      </Container>
    </section>
  );
}
