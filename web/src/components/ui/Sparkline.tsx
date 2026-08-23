"use client";

import { useId, useMemo } from "react";

export function Sparkline({
  values,
  width = 140,
  height = 40,
  color = "var(--color-accent)",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const gradientId = useId();

  const { linePath, areaPath, endPoint } = useMemo(() => {
    if (values.length < 2) return { linePath: "", areaPath: "", endPoint: null };

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const padY = 4;
    const usableH = height - padY * 2;

    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = padY + usableH - ((v - min) / range) * usableH;
      return [x, y] as const;
    });

    const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
    const area = `${line} L${width},${height} L0,${height} Z`;
    const last = points[points.length - 1];

    return { linePath: line, areaPath: area, endPoint: last };
  }, [values, width, height]);

  if (!linePath) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {endPoint && (
        <circle cx={endPoint[0]} cy={endPoint[1]} r={3.5} fill={color} stroke="var(--color-surface)" strokeWidth={2} />
      )}
    </svg>
  );
}
