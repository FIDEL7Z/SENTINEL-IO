"use client";

import { useEffect, useState } from "react";
import { BrazilMap } from "@/components/maps/BrazilMap";
import { IndicatorSelect } from "@/components/filters/IndicatorSelect";
import { RankingList } from "@/components/rankings/RankingList";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useIndicators, useYears } from "@/hooks/useApi";
import { useFiltersStore } from "@/store/filters";

export function ExploreSection() {
  const { data: indicatorsData } = useIndicators();
  const { data: years } = useYears();

  const indicatorId = useFiltersStore((s) => s.indicatorId);
  const setIndicator = useFiltersStore((s) => s.setIndicator);
  const year = useFiltersStore((s) => s.year);
  const setYear = useFiltersStore((s) => s.setYear);

  const [hoveredUF, setHoveredUF] = useState<string | null>(null);
  const [selectedUF, setSelectedUF] = useState<string | null>(null);

  useEffect(() => {
    if (year === null && years && years.length > 0) {
      setYear(Math.max(...years));
    }
  }, [year, years, setYear]);

  const selectedIndicator = indicatorsData?.data.find((i) => i.id === indicatorId);

  return (
    <section id="explorar" className="border-b border-border py-16">
      <Container>
        <SectionHeading
          eyebrow="Distribuição Geográfica"
          title="Onde os registros se concentram"
          description="Totais por unidade federativa. Passe o cursor sobre o mapa ou o ranking — eles respondem juntos."
        />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {indicatorsData && (
            <IndicatorSelect
              indicators={indicatorsData.data}
              value={indicatorId}
              onChange={setIndicator}
            />
          )}
          {years && year !== null && (
            <SegmentedControl
              options={[...years].sort().map((y) => ({ value: y, label: String(y) }))}
              value={year}
              onChange={setYear}
            />
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            <BrazilMap
              year={year ?? undefined}
              hoveredUF={hoveredUF}
              onHoverUF={setHoveredUF}
              selectedUF={selectedUF}
              onSelectUF={setSelectedUF}
            />
          </div>
          <div className="flex flex-col justify-center">
            {selectedIndicator && (
              <p className="mb-2 text-xs text-ink-muted">
                {selectedIndicator.evento} · {selectedIndicator.unidade}
              </p>
            )}
            <RankingList
              year={year ?? undefined}
              hoveredUF={hoveredUF}
              onHoverUF={setHoveredUF}
              selectedUF={selectedUF}
              onSelectUF={setSelectedUF}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
