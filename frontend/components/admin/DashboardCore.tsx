"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  TrendingUp,
  Mail,
  CalendarClock,
  FolderKanban,
  Layers,
  Users,
  Activity,
  Globe2,
  Cpu,
  Radio,
} from "lucide-react";
import { api } from "@/lib/api";
import type { AnalyticsStats, ContactStats } from "@/lib/types";
import AnimatedNumber from "./AnimatedNumber";
import Sparkline from "./Sparkline";
import VisitorHeatmap from "./VisitorHeatmap";

interface Counts {
  projects: number;
  services: number;
  meetings: number;
}

/** Faint grid + corner brackets give panels a scientific instrument feel. */
function gridBg(): React.CSSProperties {
  return {
    backgroundImage:
      "linear-gradient(rgba(0,255,194,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,194,0.05) 1px, transparent 1px)",
    backgroundSize: "22px 22px",
  };
}

function Corner({ pos }: { pos: string }) {
  return (
    <span
      className={`absolute ${pos} w-3 h-3 border-[#00FFC2]/40 pointer-events-none`}
      style={{
        borderTopWidth: pos.includes("top") ? 1 : 0,
        borderBottomWidth: pos.includes("bottom") ? 1 : 0,
        borderLeftWidth: pos.includes("left") ? 1 : 0,
        borderRightWidth: pos.includes("right") ? 1 : 0,
      }}
    />
  );
}

function HudCard({
  icon: Icon,
  label,
  value,
  sub,
  index,
}: {
  icon: any;
  label: string;
  value: number;
  sub?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative bg-[#080a10]/90 border border-white/10 rounded-2xl p-5 overflow-hidden group hover:border-[#00FFC2]/40 transition"
    >
      <div className="absolute inset-0 opacity-30" style={gridBg()} />
      <Corner pos="top-2 left-2" />
      <Corner pos="top-2 right-2" />
      <Corner pos="bottom-2 left-2" />
      <Corner pos="bottom-2 right-2" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-[#00FFC2]/10 border border-[#00FFC2]/20 text-[#00FFC2]">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-mono text-gray-600 tracking-widest">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="text-4xl font-bold font-space-grotesk text-white tabular-nums">
          <AnimatedNumber value={value} />
        </div>
        <div className="text-[10px] font-mono text-[#00FFC2]/80 mt-1 uppercase tracking-widest">
          {label}
        </div>
        {sub && <div className="text-[11px] text-gray-500 mt-1 font-mono">{sub}</div>}
      </div>
    </motion.div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
      <span className="text-sm font-mono text-[#00FFC2]">{value}</span>
    </div>
  );
}

export default function DashboardCore({
  counts,
  refreshSignal = 0,
}: {
  counts: Counts;
  refreshSignal?: number;
}) {
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [contact, setContact] = useState<ContactStats | null>(null);

  useEffect(() => {
    api.analytics.stats().then(setAnalytics).catch(() => setAnalytics(null));
    api.contact.stats().then(setContact).catch(() => setContact(null));
  }, [refreshSignal]);

  const byDay = analytics?.by_day ?? [];
  const peak = byDay.reduce((m, d) => Math.max(m, d.count), 0);
  const avg = byDay.length ? Math.round(byDay.reduce((s, d) => s + d.count, 0) / byDay.length) : 0;
  const total = analytics?.total_visits ?? 0;
  const unique = analytics?.unique_visitors ?? 0;
  const uniqueRatio = total > 0 ? Math.round((unique / total) * 100) : 0;
  const countries = analytics?.by_country?.length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-space-grotesk text-white tracking-tight">Dashboard Core</h1>
          <p className="text-xs font-mono text-[#00FFC2]/70 mt-1">
            <span className="text-gray-500">//</span> live system telemetry · real-time visitor analytics
          </p>
        </div>
        <div className="hidden md:flex items-center gap-6 px-4 py-2 rounded-xl bg-[#080a10]/90 border border-white/10">
          <Readout label="Signal" value="ONLINE" />
          <Readout label="Nodes" value={`${countries} geo`} />
          <Readout label="Peak/day" value={String(peak)} />
        </div>
      </div>

      {/* HUD cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <HudCard icon={Eye} label="Total Visits" value={total} sub={`${unique} unique nodes`} index={0} />
        <HudCard icon={TrendingUp} label="This Week" value={analytics?.this_week ?? 0} sub={`${analytics?.today ?? 0} today`} index={1} />
        <HudCard icon={Mail} label="Unread Leads" value={contact?.unread ?? 0} sub={`${contact?.total ?? 0} total signals`} index={2} />
        <HudCard icon={CalendarClock} label="Meetings" value={counts.meetings} sub="via Google Calendar" index={3} />
      </div>

      {/* Traffic signal + geography */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 relative bg-[#080a10]/90 border border-white/10 rounded-2xl p-5 overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={gridBg()} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Activity className="w-4 h-4 text-[#00FFC2]" />
                Traffic Signal
                <span className="text-[10px] font-mono text-gray-500">/ 14-day</span>
              </div>
              <div className="flex items-center gap-5">
                <Readout label="Peak" value={String(peak)} />
                <Readout label="Avg" value={String(avg)} />
                <Readout label="Total" value={String(total)} />
              </div>
            </div>
            <Sparkline data={byDay} />
            <div className="flex justify-between mt-2 text-[9px] font-mono text-gray-600">
              <span>{byDay[0]?.day?.slice(5) ?? ""}</span>
              <span>{byDay[byDay.length - 1]?.day?.slice(5) ?? "now"}</span>
            </div>
          </div>
        </div>

        <VisitorHeatmap data={analytics?.by_country ?? []} />
      </div>

      {/* System status strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatusCell icon={Radio} label="API" value="ONLINE" hint="backend reachable" ok />
        <StatusCell icon={Cpu} label="Unique ratio" value={`${uniqueRatio}%`} hint={`${unique}/${total}`} ok />
        <StatusCell icon={FolderKanban} label="Projects" value={String(counts.projects)} hint="published" />
        <StatusCell icon={Layers} label="Services" value={String(counts.services)} hint="live cards" />
        <StatusCell
          icon={Users}
          label="Pipeline"
          value={String(contact ? contact.contacted + contact.meeting : 0)}
          hint={`${contact?.new ?? 0} new · ${contact?.closed ?? 0} closed`}
        />
      </div>
    </div>
  );
}

function StatusCell({
  icon: Icon,
  label,
  value,
  hint,
  ok = false,
}: {
  icon: any;
  label: string;
  value: string;
  hint: string;
  ok?: boolean;
}) {
  return (
    <div className="relative bg-[#080a10]/90 border border-white/10 rounded-2xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#00FFC2]" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
        {ok && <span className="ml-auto w-2 h-2 rounded-full bg-[#00FFC2] animate-pulse" />}
      </div>
      <div className="text-xl font-bold font-space-grotesk text-white tabular-nums">{value}</div>
      <div className="text-[10px] font-mono text-gray-500 mt-0.5">{hint}</div>
    </div>
  );
}
