import { BrasilEmNumeros } from "@/components/home/BrasilEmNumeros";
import { ClosingCta } from "@/components/home/ClosingCta";
import { ExploreSection } from "@/components/home/ExploreSection";
import { Hero } from "@/components/home/Hero";
import { IndicatorStrip } from "@/components/home/IndicatorStrip";
import { TemporalSection } from "@/components/home/TemporalSection";
import { WhatChangedSection } from "@/components/home/WhatChangedSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <IndicatorStrip />
        <BrasilEmNumeros />
        <ExploreSection />
        <WhatChangedSection />
        <TemporalSection />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
