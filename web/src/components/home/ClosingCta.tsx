import { Container } from "@/components/ui/Container";

export function ClosingCta() {
  return (
    <section className="border-b border-border py-24">
      <Container className="flex flex-col items-start gap-8">
        <p className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
          31 indicadores. 27 UFs. 5.298 municípios.
          <span className="text-ink-secondary"> Todos os registros oficiais do Sinesp VDE, em um único observatório.</span>
        </p>
        <a
          href="#explorar"
          className="group inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 font-mono text-sm uppercase tracking-wider text-accent-ink transition-transform hover:translate-x-0.5"
        >
          Explorar os dados
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </Container>
    </section>
  );
}
