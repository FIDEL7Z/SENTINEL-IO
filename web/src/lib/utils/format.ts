const MONTH_ABBR_PT = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
] as const;

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value));
}

/** Rounds to one decimal only when the value isn't already a whole number. */
export function formatNumberSmart(value: number): string {
  return Number.isInteger(value) ? numberFormatter.format(value) : decimalFormatter.format(value);
}

export function formatSigned(value: number): string {
  const formatted = formatNumber(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `−${formatted}`;
  return formatted;
}

export function formatPercent(value: number | null, { signed = true } = {}): string {
  if (value === null || Number.isNaN(value)) return "—";
  const abs = Math.abs(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  if (!signed) return `${abs}%`;
  if (value > 0) return `+${abs}%`;
  if (value < 0) return `−${abs}%`;
  return `${abs}%`;
}

export function monthAbbrPt(month: number): string {
  return MONTH_ABBR_PT[Math.min(Math.max(month - 1, 0), 11)];
}

export function formatPeriod(year: number, month: number): string {
  return `${monthAbbrPt(month)} ${year}`;
}

export function formatPeriodShort(yyyymm: string): string {
  const [year, month] = yyyymm.split("-").map(Number);
  return `${monthAbbrPt(month)} ${year}`;
}

export function monthRangeLabel(startMonth: number, endMonth: number): string {
  if (startMonth === endMonth) return monthAbbrPt(startMonth);
  return `${monthAbbrPt(startMonth)}–${monthAbbrPt(endMonth)}`;
}

export function formatMonthRange(
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number,
): string {
  if (startYear === endYear) {
    return `${monthAbbrPt(startMonth)}–${monthAbbrPt(endMonth)} ${endYear}`;
  }
  return `${monthAbbrPt(startMonth)} ${startYear} – ${monthAbbrPt(endMonth)} ${endYear}`;
}

/** Compact form for dense contexts (rankings, tooltips): 1,2 mi / 85,4 mil. */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
