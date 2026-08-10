"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Mail } from "lucide-react";
import { api } from "@/lib/api";
import type { ContactMessage, LeadStatus } from "@/lib/types";
import { SectionHeader, EmptyState } from "./ui";

const STAGES: { key: LeadStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#38bdf8" },
  { key: "contacted", label: "Contacted", color: "#a78bfa" },
  { key: "meeting", label: "Meeting", color: "#00FFC2" },
  { key: "closed", label: "Closed", color: "#64748b" },
];

const ORDER: LeadStatus[] = ["new", "contacted", "meeting", "closed"];

export default function LeadsCRM({ onChanged }: { onChanged?: () => void }) {
  const [items, setItems] = useState<ContactMessage[]>([]);

  const load = () => api.contact.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const move = async (m: ContactMessage, dir: 1 | -1) => {
    const idx = ORDER.indexOf(m.status);
    const next = ORDER[idx + dir];
    if (!next) return;
    setItems((prev) => prev.map((x) => x.id === m.id ? { ...x, status: next } : x));
    try {
      await api.contact.updateStatus(m.id, next);
      onChanged?.();
    } catch { load(); }
  };

  return (
    <div>
      <SectionHeader title="Leads CRM" subtitle="Move contacts through your sales pipeline." />

      {items.length === 0 ? (
        <EmptyState label="No leads yet. Contact submissions appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAGES.map((stage) => {
            const list = items.filter((m) => m.status === stage.key);
            return (
              <div key={stage.key} className="bg-[#080a10]/60 border border-white/10 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                    {stage.label}
                  </div>
                  <span className="text-xs font-mono text-gray-500">{list.length}</span>
                </div>
                <div className="space-y-2 min-h-[80px]">
                  {list.map((m) => {
                    const idx = ORDER.indexOf(m.status);
                    return (
                      <div key={m.id} className="rounded-xl bg-[#0b0d13] border border-white/10 p-3">
                        <div className="text-sm text-white font-semibold truncate">{m.name}</div>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-gray-500 truncate"><Mail className="w-3 h-3" />{m.email}</div>
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{m.subject}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => move(m, -1)}
                            disabled={idx === 0}
                            className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20"
                          ><ChevronLeft className="w-4 h-4" /></button>
                          <button
                            onClick={() => move(m, 1)}
                            disabled={idx === ORDER.length - 1}
                            className="p-1 rounded text-gray-500 hover:text-[#00FFC2] disabled:opacity-20"
                          ><ChevronRight className="w-4 h-4" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
