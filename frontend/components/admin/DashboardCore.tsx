"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Eye,
  CalendarClock,
  Mail,
  FolderKanban,
  Layers,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";
import type { AnalyticsStats, ContactStats } from "@/lib/types";
import { SectionHeader } from "./ui";
import VisitorHeatmap from "./VisitorHeatmap";

interface Counts {
  projects: number;
  services: number;
  meetings: number;
}

function HudCard({
  icon: Icon,
  label,
  value,
  sub,
  delay = 0,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#080a10]/90 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#00FFC2]/40 transition"
    >
      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#00FFC2]/5 blur-2xl group-hover:bg-[#00FFC2]/10 transition" />
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-[#00FFC2]/10 border border-[#00FFC2]/20 text-[#00FFC2]">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-bold font-space-grotesk text-white">{value}</div>
      <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-wider">
        {label}
      </div>
      {sub && <div className="text-[11px] text-gray-500 mt-1">{sub}</div>}
    </motion.div>
  );
}

export default function DashboardCore({ counts }: { counts: Counts }) {
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [contact, setContact] = useState<ContactStats | null>(null);

  useEffect(() => {
    api.analytics.stats().then(setAnalytics).catch(() => setAnalytics(null));
    api.contact.stats().then(setContact).catch(() => setContact(null));
  }, []);

  return (
    <div>
      <SectionHeader
        title="Dashboard Core"
        subtitle="Live system telemetry and portfolio metrics."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <HudCard
          icon={Eye}
          label="Total Visits"
          value={analytics?.total_visits ?? "—"}
          sub={`${analytics?.unique_visitors ?? 0} unique visitors`}
          delay={0}
        />
        <HudCard
          icon={TrendingUp}
          label="This Week"
          value={analytics?.this_week ?? "—"}
          sub={`${analytics?.today ?? 0} today`}
          delay={0.05}
        />
        <HudCard
          icon={Mail}
          label="Unread Leads"
          value={contact?.unread ?? "—"}
          sub={`${contact?.total ?? 0} total messages`}
          delay={0.1}
        />
        <HudCard
          icon={CalendarClock}
          label="Meetings"
          value={counts.meetings}
          sub="scheduled via Calendly"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <HudCard icon={FolderKanban} label="Projects" value={counts.projects} delay={0.2} />
          <HudCard icon={Layers} label="Services" value={counts.services} delay={0.25} />
          <HudCard
            icon={Users}
            label="Pipeline"
            value={contact ? contact.contacted + contact.meeting : "—"}
            sub={`${contact?.new ?? 0} new · ${contact?.closed ?? 0} closed`}
            delay={0.3}
          />
        </div>
        <VisitorHeatmap data={analytics?.by_country ?? []} />
      </div>
    </div>
  );
}
