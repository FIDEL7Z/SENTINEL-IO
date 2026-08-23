export const SEQUENTIAL_RAMP = [
  "var(--color-seq-0)",
  "var(--color-seq-1)",
  "var(--color-seq-2)",
  "var(--color-seq-3)",
  "var(--color-seq-4)",
  "var(--color-seq-5)",
  "var(--color-seq-6)",
] as const;

/** Quantile breakpoints for `steps` classes over a sorted numeric array. */
export function quantileBreaks(sortedValues: number[], steps: number): number[] {
  if (sortedValues.length === 0) return [];
  const breaks: number[] = [];
  for (let i = 1; i < steps; i++) {
    const pos = (i / steps) * (sortedValues.length - 1);
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    const value = sortedValues[lo] + (sortedValues[hi] - sortedValues[lo]) * (pos - lo);
    breaks.push(value);
  }
  return breaks;
}

export function bucketIndex(value: number, breaks: number[]): number {
  let i = 0;
  while (i < breaks.length && value > breaks[i]) i++;
  return i;
}

/** Builds a value -> ramp color lookup for a set of UF/municipality totals. */
export function buildSequentialScale(values: number[]) {
  const steps = SEQUENTIAL_RAMP.length;
  const sorted = [...values].sort((a, b) => a - b);
  const breaks = quantileBreaks(sorted, steps);

  return {
    breaks,
    colorFor: (value: number) => SEQUENTIAL_RAMP[bucketIndex(value, breaks)],
  };
}
