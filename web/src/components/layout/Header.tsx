import { Container } from "@/components/ui/Container";

const NAV = [
  { label: "Explorar", href: "#explorar" },
  { label: "Análises", href: "#evolucao" },
  { label: "Sobre", href: "#sobre" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-page/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          <span className="font-display text-sm font-semibold tracking-[0.14em]">SENTINEL.IO</span>
        </a>
        <nav className="flex items-center gap-7">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-wider text-ink-secondary transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
