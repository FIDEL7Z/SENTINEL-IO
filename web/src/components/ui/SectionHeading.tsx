import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</div>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-xl text-sm text-ink-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
