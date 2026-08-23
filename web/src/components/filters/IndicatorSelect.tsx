"use client";

import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IndicatorResponse } from "@/types/api";

const GROUP_ORDER = [
  "Vítimas",
  "Ocorrências",
  "Ações Policiais",
  "Apreensões (Peso)",
  "Apreensões (Unidade)",
  "Serviços",
];

export function IndicatorSelect({
  indicators,
  value,
  onChange,
}: {
  indicators: IndicatorResponse[];
  value: number;
  onChange: (indicatorId: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = indicators.find((i) => i.id === value);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? indicators.filter((i) => i.evento.toLowerCase().includes(q)) : indicators;
    const map = new Map<string, IndicatorResponse[]>();
    for (const ind of filtered) {
      const list = map.get(ind.grupo_semantico) ?? [];
      list.push(ind);
      map.set(ind.grupo_semantico, list);
    }
    return GROUP_ORDER.map((group) => ({ group, items: map.get(group) ?? [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [indicators, query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-left text-sm hover:border-border-strong transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Indicador</span>
        <span className="font-medium">{selected?.evento ?? "Selecionar"}</span>
        <span className="text-ink-muted" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-30 mt-2 w-[340px] max-h-[420px] overflow-y-auto rounded-2xl border border-border-strong bg-surface-raised shadow-2xl shadow-black/50"
        >
          <div className="sticky top-0 border-b border-border bg-surface-raised p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar indicador…"
              className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="p-1.5">
            {grouped.map(({ group, items }) => (
              <div key={group} className="mb-1">
                <div className="px-2.5 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  {group}
                </div>
                {items.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    role="option"
                    aria-selected={ind.id === value}
                    onClick={() => {
                      onChange(ind.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={clsx(
                      "flex w-full items-baseline justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                      ind.id === value ? "bg-accent-dim text-accent" : "hover:bg-surface text-ink",
                    )}
                  >
                    <span>{ind.evento}</span>
                    <span className="shrink-0 font-mono text-[11px] text-ink-muted">{ind.unidade.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            ))}
            {grouped.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-ink-muted">Nenhum indicador encontrado.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
