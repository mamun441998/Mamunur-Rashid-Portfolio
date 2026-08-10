"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Mail, Video, AlertTriangle, Info, Trash2, Check } from "lucide-react";
import { api } from "@/lib/api";
import type { GoogleMeeting, MeetingState } from "@/lib/types";
import { SectionHeader, Panel, EmptyState } from "./ui";

const STATES: { key: MeetingState; label: string; color: string }[] = [
  { key: "pending", label: "Pending", color: "#38bdf8" },
  { key: "completed", label: "Completed", color: "#00FFC2" },
  { key: "closed", label: "Closed", color: "#64748b" },
];
const stateMeta = (s?: string) => STATES.find((x) => x.key === s) || STATES[0];

export default function MeetingsPanel({
  onChanged,
  refreshSignal = 0,
}: {
  onChanged?: () => void;
  refreshSignal?: number;
}) {
  const [items, setItems] = useState<GoogleMeeting[]>([]);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = () =>
    api.meetings
      .list()
      .then((r) => {
        setConfigured(r.configured);
        setError(r.error || null);
        setItems(r.meetings || []);
      })
      .catch(() => {
        setConfigured(true);
        setError("Failed to load meetings.");
        setItems([]);
      })
      .finally(() => setLoaded(true));

  useEffect(() => { load(); }, []);
  useEffect(() => { if (refreshSignal > 0) load(); }, [refreshSignal]);

  const setState = async (m: GoogleMeeting, next: MeetingState) => {
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, state: next } : x)));
    try {
      await api.meetings.setStatus(m.id, next);
      onChanged?.();
    } catch { load(); }
  };

  const dismiss = async (m: GoogleMeeting) => {
    if (!confirm("Remove this meeting from the panel? (It stays in your Google Calendar.)")) return;
    setItems((prev) => prev.filter((x) => x.id !== m.id));
    try {
      await api.meetings.dismiss(m.id);
      onChanged?.();
    } catch { load(); }
  };

  return (
    <div>
      <SectionHeader
        title="Meetings Panel"
        subtitle="Bookings synced from your Google Calendar (Google Meet)."
      />

      {/* Not configured → setup instructions */}
      {loaded && !configured && (
        <Panel className="border-[#00FFC2]/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#00FFC2] shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300 space-y-2">
              <p className="text-white font-semibold">Connect your Google Calendar to see bookings here</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400">
                <li>Google Calendar → <span className="text-gray-200">Settings</span> → click your calendar on the left.</li>
                <li>Scroll to <span className="text-gray-200">“Integrate calendar”</span> → copy the <span className="text-[#00FFC2]">Secret address in iCal format</span> URL.</li>
                <li>In <span className="text-gray-200">Render</span> → your backend → Environment → add
                  <span className="font-mono text-[#00FFC2]"> GOOGLE_CALENDAR_ICAL_URL</span> = that URL → Save (redeploys).</li>
              </ol>
              <p className="text-[11px] text-gray-500">Bookings then appear automatically. Note: Google’s iCal feed can lag a few minutes before new bookings show.</p>
            </div>
          </div>
        </Panel>
      )}

      {/* Configured but feed error */}
      {loaded && configured && error && (
        <Panel className="border-red-500/30 mb-4">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold">Couldn’t read the calendar feed</p>
              <p className="text-gray-400 mt-1 font-mono text-xs break-all">{error}</p>
              <p className="text-gray-500 mt-1 text-xs">Check that GOOGLE_CALENDAR_ICAL_URL on Render is the correct secret iCal URL.</p>
            </div>
          </div>
        </Panel>
      )}

      {/* Configured, no error, no meetings */}
      {loaded && configured && !error && items.length === 0 && (
        <EmptyState label="No upcoming bookings. New Google Calendar appointments will appear here automatically." />
      )}

      {/* Meetings list */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((m) => {
            const canceled = m.status === "canceled";
            const meta = stateMeta(m.state);
            return (
              <Panel key={m.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 min-w-0">
                    <div className={`p-2.5 rounded-xl border h-fit ${
                      canceled
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-[#00FFC2]/10 border-[#00FFC2]/20 text-[#00FFC2]"
                    }`}>
                      <CalendarClock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold font-space-grotesk flex items-center gap-2 flex-wrap">
                        {m.event_name || "Meeting"}
                        {canceled ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">canceled</span>
                        ) : (
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                            style={{ background: `${meta.color}1a`, color: meta.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                            {meta.label}
                          </span>
                        )}
                      </h3>
                      {m.invitee_name && <p className="text-sm text-gray-300 mt-0.5">{m.invitee_name}</p>}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-gray-500 mt-1">
                        {m.scheduled_at && <span>{new Date(m.scheduled_at).toLocaleString()}</span>}
                        {m.invitee_email && (
                          <a href={`mailto:${m.invitee_email}`} className="flex items-center gap-1 hover:text-[#00FFC2]">
                            <Mail className="w-3 h-3" />{m.invitee_email}
                          </a>
                        )}
                      </div>
                      {m.notes && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 max-w-2xl whitespace-pre-wrap">{m.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {m.meet_link && !canceled && (
                      <a
                        href={m.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00FFC2]/10 border border-[#00FFC2]/30 text-[#00FFC2] text-sm hover:bg-[#00FFC2]/20 transition"
                      >
                        <Video className="w-4 h-4" />
                        <span className="hidden sm:inline">Join Meet</span>
                      </a>
                    )}
                    <button
                      onClick={() => dismiss(m)}
                      title="Remove from panel"
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:border-red-500/50 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status pipeline buttons */}
                {!canceled && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mr-1">Status</span>
                    {STATES.map((s) => {
                      const active = (m.state || "pending") === s.key;
                      return (
                        <button
                          key={s.key}
                          onClick={() => setState(m, s.key)}
                          className={`px-3 py-1 text-xs font-medium rounded-lg border transition inline-flex items-center gap-1.5 ${
                            active ? "text-black" : "text-gray-300 hover:text-white border-white/10"
                          }`}
                          style={active ? { background: s.color, borderColor: s.color } : undefined}
                        >
                          {active && <Check className="w-3 h-3" />}
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
