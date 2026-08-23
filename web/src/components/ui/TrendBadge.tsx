import { clsx } from "clsx";
import type { Polarity } from "@/lib/constants/indicators";
import { formatPercent } from "@/lib/utils/format";

function isFavorable(delta: number, polarity: Polarity): boolean | null {
  if (polarity === "neutral" || delta === 0) return null;
  if (polarity === "down-is-favorable") return delta < 0;
  return delta > 0;
}

export function TrendBadge({
  percent,
  polarity,
  size = "md",
}: {
  percent: number | null;
  polarity: Polarity;
  size?: "sm" | "md";
}) {
  if (percent === null) {
    return <span className="text-ink-muted text-sm tabular">—</span>;
  }

  const favorable = isFavorable(percent, polarity);
  const arrow = percent > 0 ? "↑" : percent < 0 ? "↓" : "→";

  const colorClass =
    favorable === null
      ? "text-ink-secondary"
      : favorable
        ? "text-good"
        : "text-critical";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 font-mono tabular",
        size === "sm" ? "text-xs" : "text-sm",
        colorClass,
      )}
    >
      <span aria-hidden>{arrow}</span>
      {formatPercent(percent, { signed: false })}
    </span>
  );
}
