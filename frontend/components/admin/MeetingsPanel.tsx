"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Mail, Trash2, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import type { Meeting } from "@/lib/types";
import { SectionHeader, Panel, GhostButton, EmptyState } from "./ui";

export default function MeetingsPanel({
  onChanged,
  refreshSignal = 0,
}: {
  onChanged?: () => void;
  refreshSignal?: number;
}) {
  const [items, setItems] = useState<Meeting[]>([]);

  const load = () => api.meetings.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);
  // Live refresh on each poll tick.
  useEffect(() => { if (refreshSignal > 0) load(); }, [refreshSignal]);

  const remove = async (id: number) => {
    if (!confirm("Delete this meeting record?")) return;
    await api.meetings.remove(id);
    await load();
    onChanged?.();
  };

  return (
    <div>
      <SectionHeader
        title="Meetings Panel"
        subtitle="Calendly bookings synced via webhook."
      />

      {items.length === 0 ? (
        <EmptyState label="No meetings yet. Connect a Calendly webhook to populate this panel." />
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <Panel key={m.id} className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className={`p-2.5 rounded-xl border h-fit ${
                  m.status === "canceled"
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-[#00FFC2]/10 border-[#00FFC2]/20 text-[#00FFC2]"
                }`}>
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold font-space-grotesk">
                    {m.event_name || "Meeting"}
                    <span className={`ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      m.status === "canceled" ? "bg-red-500/10 text-red-400" : "bg-[#00FFC2]/10 text-[#00FFC2]"
                    }`}>{m.status}</span>
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">{m.invitee_name}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-gray-500 mt-1">
                    {m.invitee_email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{m.invitee_email}</span>}
                    {m.scheduled_at && <span>{new Date(m.scheduled_at).toLocaleString()}</span>}
                    {m.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location}</span>}
                  </div>
                </div>
              </div>
              <GhostButton onClick={() => remove(m.id)} className="hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-4 h-4" /></GhostButton>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
