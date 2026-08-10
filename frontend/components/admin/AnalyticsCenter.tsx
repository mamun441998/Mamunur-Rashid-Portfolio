"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AnalyticsStats } from "@/lib/types";
import { SectionHeader, Panel, EmptyState } from "./ui";
import VisitorHeatmap from "./VisitorHeatmap";

export default function AnalyticsCenter({ refreshSignal = 0 }: { refreshSignal?: number }) {
  const [data, setData] = useState<AnalyticsStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Re-fetches on each poll tick (refreshSignal) so charts stay real-time.
  useEffect(() => {
    api.analytics.stats()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoaded(true));
  }, [refreshSignal]);

  const maxDay = data?.by_day.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  return (
    <div>
      <SectionHeader title="Analytics Center" subtitle="Visitor traffic, geography, and top pages." />

      {loaded && !data ? (
        <EmptyState label="Analytics unavailable." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Visits · Last 14 days</h3>
            {data && data.by_day.length > 0 ? (
              <div className="flex items-end gap-1.5 h-40">
                {data.by_day.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center justify-end group">
                    <div
                      className="w-full rounded-t bg-[#00FFC2]/70 group-hover:bg-[#00FFC2] transition"
                      style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
                      title={`${d.day}: ${d.count}`}
                    />
                    <span className="text-[8px] font-mono text-gray-600 mt-1 rotate-45 origin-left whitespace-nowrap">
                      {d.day.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-gray-500 py-10 text-center">No traffic data yet.</p>
            )}

            <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/10">
              {[
                { label: "Total", value: data?.total_visits ?? 0 },
                { label: "Unique", value: data?.unique_visitors ?? 0 },
                { label: "This Week", value: data?.this_week ?? 0 },
                { label: "Today", value: data?.today ?? 0 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold font-space-grotesk text-white">{s.value}</div>
                  <div className="text-[10px] font-mono uppercase text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </Panel>

          <VisitorHeatmap data={data?.by_country ?? []} />

          <Panel className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white mb-4">Top Pages</h3>
            {data && data.top_paths.length > 0 ? (
              <div className="space-y-2">
                {data.top_paths.map((p) => (
                  <div key={p.path} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-gray-300 truncate">{p.path}</span>
                    <span className="font-mono text-gray-500">{p.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-gray-500 py-6 text-center">No page views yet.</p>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}
