"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useIndicators } from "@/hooks/useApi";
import { HEADLINE_INDICATOR_IDS } from "@/lib/constants/indicators";
import { DrugCompositeCard } from "./DrugCompositeCard";
import { IndicatorHeadlineCard } from "./IndicatorHeadlineCard";

export function IndicatorStrip() {
  const { data } = useIndicators();

  const headline = HEADLINE_INDICATOR_IDS.map((id) =>
    data?.data.find((i) => i.id === id),
  ).filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <section className="border-b border-border py-16">
      <Container>
        <SectionHeading
          eyebrow="Panorama Nacional"
          title="Principais indicadores"
          description="Totais do último período disponível, comparados ao mesmo intervalo do ano anterior. Selecione um indicador para explorá-lo no mapa abaixo."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {headline.map((indicator) => (
            <IndicatorHeadlineCard key={indicator.id} indicator={indicator} />
          ))}
          <DrugCompositeCard />
        </div>
      </Container>
    </section>
  );
}
