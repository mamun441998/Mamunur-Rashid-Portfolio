"use client";

import { RefreshCw, LogOut, ExternalLink } from "lucide-react";

export default function Topbar({
  onRefresh,
  onLogout,
  refreshing,
}: {
  onRefresh: () => void;
  onLogout: () => void;
  refreshing?: boolean;
}) {
  return (
    <header className="h-16 shrink-0 border-b border-white/10 bg-[#080a10]/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
        <span className="w-2 h-2 rounded-full bg-[#00FFC2] animate-pulse" />
        <span className="uppercase tracking-widest">MRP-OS · Admin Control</span>
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
