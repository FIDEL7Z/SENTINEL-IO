import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer id="sobre" className="border-t border-border py-14">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            <span className="font-display text-sm font-semibold tracking-[0.14em]">SENTINEL.IO</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
            Observatório aberto de segurança pública. Dados oficiais do Sinesp VDE,
            tratados e publicados sem viés editorial — a leitura é de cada visitante.
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Fonte</div>
            <p className="mt-2 text-sm text-ink-secondary">Sinesp VDE</p>
            <p className="text-sm text-ink-secondary">Ministério da Justiça e Segurança Pública</p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Metodologia</div>
            <p className="mt-2 text-sm text-ink-secondary">ETL próprio · PostgreSQL</p>
            <p className="text-sm text-ink-secondary">Analytics API somente leitura</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
