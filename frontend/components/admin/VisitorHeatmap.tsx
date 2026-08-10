"use client";

import type { CountryCount } from "@/lib/types";
import { Globe2 } from "lucide-react";

/** Simple horizontal country activity heatmap from analytics.by_country. */
export default function VisitorHeatmap({ data }: { data: CountryCount[] }) {
  const top = [...data].sort((a, b) => b.count - a.count).slice(0, 8);
  const max = top.reduce((m, c) => Math.max(m, c.count), 0) || 1;

  return (
    <div className="bg-[#080a10]/90 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5 text-sm font-semibold text-white">
        <Globe2 className="w-4 h-4 text-[#00FFC2]" />
        Visitor Geography
      </div>
      {top.length === 0 ? (
        <p className="text-xs font-mono text-gray-500 py-6 text-center">
          No visits recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {top.map((c) => (
            <div key={`${c.country}-${c.country_code}`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-gray-300">
                  {c.country_code ? `${flag(c.country_code)} ` : ""}
                  {c.country}
                </span>
                <span className="text-gray-500">{c.count}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#00FFC2] shadow-[0_0_8px_#00FFC2]"
                  style={{ width: `${Math.max(6, (c.count / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Turn a 2-letter country code into a flag emoji. */
function flag(code: string): string {
  if (!code || code.length !== 2) return "";
  const A = 0x1f1e6;
  const up = code.toUpperCase();
  return String.fromCodePoint(
    A + (up.charCodeAt(0) - 65),
    A + (up.charCodeAt(1) - 65)
  );
}
