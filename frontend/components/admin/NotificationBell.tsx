"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Mail, MessageSquare, CalendarClock, CheckCheck } from "lucide-react";
import { api } from "@/lib/api";
import type { AdminNotification } from "@/lib/types";
import type { AdminTab } from "./Sidebar";

const SEEN_KEY = "mrp_notif_seen"; // epoch seconds of last time the bell was opened

const ICON: Record<string, any> = { lead: Mail, reply: MessageSquare, meeting: CalendarClock };
const TONE: Record<string, string> = {
  lead: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  reply: "text-[#00FFC2] bg-[#00FFC2]/10 border-[#00FFC2]/30",
  meeting: "text-violet-400 bg-violet-500/10 border-violet-500/30",
};

function relTime(ts: number): string {
  const now = Math.floor(Date.now() / 1000);
  const d = Math.max(0, now - ts);
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  if (d < 604800) return `${Math.floor(d / 86400)}d ago`;
  return new Date(ts * 1000).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function NotificationBell({
  onNavigate,
  refreshSignal,
}: {
  onNavigate: (tab: AdminTab, entityId?: number) => void;
  refreshSignal?: number;
}) {
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(SEEN_KEY) : null;
    setSeen(raw ? Number(raw) || 0 : 0);
  }, []);

  const load = useCallback(() => {
    api.notifications.list().then((r) => setItems(r.items)).catch(() => { /* keep last */ });
  }, []);

  useEffect(() => { load(); }, [load, refreshSignal]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const unreadCount = items.filter((i) => i.ts > seen).length;

  const markAllSeen = () => {
    const now = Math.floor(Date.now() / 1000);
    localStorage.setItem(SEEN_KEY, String(now));
    setSeen(now);
  };

  const toggle = () => {
    setOpen((o) => {
      if (!o) setTimeout(markAllSeen, 1200); // let the "new" highlight show briefly, then clear badge
      return !o;
    });
  };

  const openItem = (n: AdminNotification) => {
    onNavigate(n.target as AdminTab, n.entity_id);
    setOpen(false);
    markAllSeen();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={toggle}
        title="Notifications"
        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl border transition ${
          open ? "bg-[#00FFC2]/10 border-[#00FFC2]/50 text-[#00FFC2]" : "bg-white/5 border-white/10 text-gray-300 hover:border-[#00FFC2]/50 hover:text-[#00FFC2]"
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#7C3AED] text-white text-[10px] font-mono font-extrabold flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.7)]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-[360px] max-w-[92vw] rounded-2xl bg-[#0b0e14] border border-white/10 shadow-2xl shadow-black/60 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#00FFC2]" />
                <span className="text-sm font-semibold text-white font-space-grotesk">Notifications</span>
                {unreadCount > 0 && <span className="text-[10px] font-mono text-[#7C3AED] font-bold">{unreadCount} new</span>}
              </div>
              {items.length > 0 && (
                <button onClick={markAllSeen} className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-[#00FFC2]">
                  <CheckCheck className="w-3.5 h-3.5" /> Mark read
                </button>
              )}
            </div>

            <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="w-7 h-7 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-mono">You&rsquo;re all caught up.</p>
                </div>
              ) : (
                <ul>
                  {items.map((n) => {
                    const Icon = ICON[n.type] || Bell;
                    const isNew = n.ts > seen;
                    return (
                      <li key={n.id}>
                        <button
                          onClick={() => openItem(n)}
                          className={`w-full text-left flex gap-3 px-4 py-3 border-b border-white/5 transition hover:bg-white/[0.04] ${isNew ? "bg-[#00FFC2]/[0.04]" : ""}`}
                        >
                          <span className={`shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${TONE[n.type] || "text-gray-400 bg-white/5 border-white/10"}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white truncate">{n.title}</p>
                              {isNew && <span className="shrink-0 w-2 h-2 rounded-full bg-[#7C3AED]" />}
                            </div>
                            {n.subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{n.subtitle}</p>}
                            <p className="text-[10px] font-mono text-gray-600 mt-1">{relTime(n.ts)}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
