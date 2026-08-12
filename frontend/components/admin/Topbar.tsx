"use client";

import { RefreshCw, LogOut, ExternalLink } from "lucide-react";
import NotificationBell from "./NotificationBell";
import type { AdminTab } from "./Sidebar";

function fmtTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Topbar({
  onRefresh,
  onLogout,
  onNavigate,
  notifSignal,
  refreshing,
  live = true,
  lastUpdated = null,
}: {
  onRefresh: () => void;
  onLogout: () => void;
  onNavigate: (tab: AdminTab) => void;
  notifSignal?: number;
  refreshing?: boolean;
  live?: boolean;
  lastUpdated?: Date | null;
}) {
  return (
    <header className="h-16 shrink-0 border-b border-white/10 bg-[#080a10]/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {/* Notification center */}
        <NotificationBell onNavigate={onNavigate} refreshSignal={notifSignal} />
        {/* LIVE indicator */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest border ${
            live
              ? "bg-[#00FFC2]/10 border-[#00FFC2]/40 text-[#00FFC2]"
              : "bg-white/5 border-white/10 text-gray-500"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${live ? "bg-[#00FFC2] animate-pulse" : "bg-gray-500"}`}
          />
          {live ? "LIVE" : "PAUSED"}
        </span>
        <span className="hidden sm:inline text-[11px] font-mono text-gray-500">
          {lastUpdated ? `updated ${fmtTime(lastUpdated)}` : "syncing…"}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:border-[#00FFC2]/50 hover:text-[#00FFC2] transition"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">View Site</span>
        </a>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:border-[#00FFC2]/50 hover:text-[#00FFC2] transition"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
