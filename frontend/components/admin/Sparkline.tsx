"use client";

import type { DayCount } from "@/lib/types";

/** SVG area chart with a faint grid — the "scientific" centerpiece of the HUD.
 *  Pure inline SVG, theme-aware via the emerald accent. */
export default function Sparkline({
  data,
  height = 160,
}: {
  data: DayCount[];
  height?: number;
}) {
  const W = 640;
  const H = height;
  const padX = 8;
  const padY = 14;

  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs font-mono text-gray-600">
        awaiting traffic signal…
      </div>
    );
  }

  const max = Math.max(1, ...data.map((d) => d.count));
  const n = data.length;
  const stepX = (W - padX * 2) / Math.max(1, n - 1);

  const x = (i: number) => padX + i * stepX;
  const y = (v: number) => padY + (H - padY * 2) * (1 - v / max);

  const linePts = data.map((d, i) => `${x(i)},${y(d.count)}`).join(" ");
  const areaPts = `${padX},${H - padY} ${linePts} ${x(n - 1)},${H - padY}`;

  const peakIdx = data.reduce((best, d, i) => (d.count > data[best].count ? i : best), 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: H }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00FFC2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00FFC2" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={padX}
          x2={W - padX}
          y1={padY + (H - padY * 2) * g}
          y2={padY + (H - padY * 2) * g}
          stroke="#ffffff"
          strokeOpacity="0.06"
          strokeDasharray="2 4"
        />
      ))}

      {/* area + line */}
      <polygon points={areaPts} fill="url(#spark-fill)" />
      <polyline
        points={linePts}
        fill="none"
        stroke="#00FFC2"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* data dots */}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(d.count)}
          r={i === peakIdx ? 3.5 : 1.8}
          fill={i === peakIdx ? "#00FFC2" : "#0b0d13"}
          stroke="#00FFC2"
          strokeWidth={i === peakIdx ? 0 : 1.2}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
