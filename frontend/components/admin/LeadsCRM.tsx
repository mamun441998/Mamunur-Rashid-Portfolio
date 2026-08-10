"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Trash2, Send, Check } from "lucide-react";
import { api } from "@/lib/api";
import type { ContactMessage, LeadStatus } from "@/lib/types";
import {
  SectionHeader,
  Panel,
  Field,
  TextInput,
  TextArea,
  PrimaryButton,
  GhostButton,
  EmptyState,
  StatusToast,
} from "./ui";
import { useConfirm } from "./ConfirmDialog";

type Status = { type: "success" | "error"; message: string } | null;

const STAGES: { key: LeadStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "#38bdf8" },
  { key: "contacted", label: "Contacted", color: "#a78bfa" },
  { key: "meeting", label: "Meeting", color: "#00FFC2" },
  { key: "closed", label: "Closed", color: "#64748b" },
];

const ORDER: LeadStatus[] = ["new", "contacted", "meeting", "closed"];
const stageMeta = (s: LeadStatus) => STAGES.find((x) => x.key === s) || STAGES[0];

/** Unified inbox + pipeline: read messages, reply by email, convert status, delete. */
export default function LeadsCRM({
  onChanged,
  refreshSignal = 0,
}: {
  onChanged?: () => void;
  refreshSignal?: number;
}) {
  const confirm = useConfirm();
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const selected = useMemo(
    () => items.find((m) => m.id === selectedId) || null,
    [items, selectedId]
  );

  const load = async (keepSelection = true) => {
    const list = await api.contact.list().catch(() => []);
    setItems(list);
    if (!keepSelection || selectedId === null) {
      if (list.length) openLead(list[0], list);
    }
  };

  useEffect(() => {
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live refresh on each poll tick — new messages appear without losing selection.
  useEffect(() => {
    if (refreshSignal > 0) load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  const openLead = async (m: ContactMessage, current?: ContactMessage[]) => {
    setSelectedId(m.id);
    setSubject(`Re: ${m.subject || "Your Portfolio Message"}`);
    setBody("");
    setStatus(null);
    if (!m.is_read) {
      // Optimistic: flip the dot immediately so the badge drops 1 -> 0.
      setItems((prev) =>
        (current || prev).map((x) => (x.id === m.id ? { ...x, is_read: true } : x))
      );
      try {
        await api.contact.markRead(m.id);
      } catch {
        /* ignore; will resync on next load */
      }
      onChanged?.(); // refresh sidebar unread badge from /stats
    }
  };

  const changeStatus = async (m: ContactMessage, next: LeadStatus) => {
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: next } : x)));
    try {
      await api.contact.updateStatus(m.id, next);
      onChanged?.();
    } catch {
      load();
    }
  };

  const remove = async (id: number) => {
    if (!(await confirm({ title: "Delete message?", message: "This message will be permanently deleted." }))) return;
    await api.contact.remove(id);
    const remaining = items.filter((m) => m.id !== id);
    setItems(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id ?? null);
    onChanged?.();
  };

  const sendReply = async () => {
    if (!selected || !body.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      await api.contact.reply({ to_email: selected.email, subject, reply_message: body });
      setStatus({ type: "success", message: `Sent ✓ — reply delivered to ${selected.email}` });
      setBody("");
      // Sending a reply implies contact was made.
      if (selected.status === "new") changeStatus(selected, "contacted");
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Failed to send reply." });
    } finally {
      setSending(false);
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const s of ORDER) c[s] = items.filter((m) => m.status === s).length;
    return c;
  }, [items]);

  const visible = filter === "all" ? items : items.filter((m) => m.status === filter);

  return (
    <div>
      <SectionHeader
        title="Messages & Leads"
        subtitle="Inbox and sales pipeline in one place — read, reply, and convert."
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", ...ORDER] as const).map((key) => {
          const isActive = filter === key;
          const label = key === "all" ? "All" : stageMeta(key).label;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition ${
                isActive
                  ? "bg-[#00FFC2]/10 border-[#00FFC2] text-[#00FFC2]"
                  : "bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {label}
              <span className="ml-1.5 opacity-70">{counts[key] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState label="No messages yet. Contact submissions appear here." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* List */}
          <div className="lg:col-span-5 space-y-2 max-h-[72vh] overflow-y-auto custom-scrollbar pr-1">
            {visible.length === 0 ? (
              <EmptyState label="No leads in this stage." />
            ) : (
              visible.map((m) => {
                const meta = stageMeta(m.status);
                return (
                  <button
                    key={m.id}
                    onClick={() => openLead(m)}
                    className={`w-full text-left p-4 rounded-xl border transition ${
                      selectedId === m.id
                        ? "bg-[#00FFC2]/10 border-[#00FFC2]/50"
                        : "bg-[#080a10]/90 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white font-semibold text-sm flex items-center gap-2 truncate">
                        {!m.is_read && <span className="w-2 h-2 rounded-full bg-[#00FFC2] shrink-0" />}
                        {m.name}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 shrink-0">
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{m.subject}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.message}</p>
                    <span
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: `${meta.color}1a`, color: meta.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                      {meta.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Detail + reply + pipeline */}
          <div className="lg:col-span-7">
            {selected ? (
              <Panel className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Mail className="w-4 h-4 text-[#00FFC2]" />
                      {selected.name}
                    </div>
                    <a href={`mailto:${selected.email}`} className="text-xs font-mono text-[#00FFC2] hover:underline">
                      {selected.email}
                    </a>
                    <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                      {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                  <GhostButton onClick={() => remove(selected.id)} className="hover:!border-red-500/50 hover:!text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </GhostButton>
                </div>

                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                  <p className="text-[11px] font-mono text-gray-500 mb-2">SUBJECT: {selected.subject}</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Pipeline stage buttons */}
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">Pipeline Stage</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {STAGES.map((s) => {
                      const isCurrent = selected.status === s.key;
                      return (
                        <button
                          key={s.key}
                          onClick={() => changeStatus(selected, s.key)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition inline-flex items-center gap-1.5 ${
                            isCurrent ? "text-black" : "text-gray-300 hover:text-white border-white/10"
                          }`}
                          style={isCurrent ? { background: s.color, borderColor: s.color } : undefined}
                        >
                          {isCurrent && <Check className="w-3.5 h-3.5" />}
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reply */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <Send className="w-3.5 h-3.5 text-[#00FFC2]" />COMPOSE EMAIL REPLY
                  </div>
                  <Field label="Subject"><TextInput value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
                  <Field label="Message"><TextArea rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your reply…" /></Field>
                  {status && <StatusToast status={status} />}
                  <div className="flex justify-end">
                    <PrimaryButton onClick={sendReply} disabled={sending || !body.trim()}>
                      {sending ? "Sending…" : <><Send className="w-4 h-4" />Send Email Reply</>}
                    </PrimaryButton>
                  </div>
                </div>
              </Panel>
            ) : (
              <EmptyState label="Select a lead to view." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
