"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Send, CheckCircle2, Circle } from "lucide-react";
import { api } from "@/lib/api";
import type { ContactMessage } from "@/lib/types";
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

type Status = { type: "success" | "error"; message: string } | null;

export default function MessagesHub({ onChanged }: { onChanged?: () => void }) {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const load = async () => {
    const list = await api.contact.list().catch(() => []);
    setItems(list);
    if (list.length && !selected) select(list[0]);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const select = async (m: ContactMessage) => {
    setSelected(m);
    setSubject(`Re: ${m.subject || "Your Portfolio Message"}`);
    setBody("");
    if (!m.is_read) {
      try {
        await api.contact.markRead(m.id);
        setItems((prev) => prev.map((x) => x.id === m.id ? { ...x, is_read: true } : x));
        onChanged?.();
      } catch { /* ignore */ }
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await api.contact.remove(id);
    const remaining = items.filter((m) => m.id !== id);
    setItems(remaining);
    if (selected?.id === id) setSelected(remaining[0] || null);
    onChanged?.();
  };

  const sendReply = async () => {
    if (!selected || !body.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      await api.contact.reply({ to_email: selected.email, subject, reply_message: body });
      setStatus({ type: "success", message: `Reply sent to ${selected.email}.` });
      setBody("");
    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Failed to send reply." });
    } finally {
      setSending(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div>
      <SectionHeader title="Messages Hub" subtitle="Inbound contact submissions and email replies." />

      {items.length === 0 ? (
        <EmptyState label="No messages yet." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* List */}
          <div className="lg:col-span-5 space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1">
            {items.map((m) => (
              <button
                key={m.id}
                onClick={() => select(m)}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  selected?.id === m.id
                    ? "bg-[#00FFC2]/10 border-[#00FFC2]/50"
                    : "bg-[#080a10]/90 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm flex items-center gap-2">
                    {m.is_read ? <Circle className="w-3 h-3 text-gray-600" /> : <span className="w-2 h-2 rounded-full bg-[#00FFC2]" />}
                    {m.name}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">{m.subject}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.message}</p>
              </button>
            ))}
          </div>

          {/* Detail + reply */}
          <div className="lg:col-span-7">
            {selected ? (
              <Panel className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-white font-semibold"><Mail className="w-4 h-4 text-[#00FFC2]" />{selected.name}</div>
                    <a href={`mailto:${selected.email}`} className="text-xs font-mono text-[#00FFC2] hover:underline">{selected.email}</a>
                  </div>
                  <GhostButton onClick={() => remove(selected.id)} className="hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-4 h-4" /></GhostButton>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                  <p className="text-[11px] font-mono text-gray-500 mb-2">SUBJECT: {selected.subject}</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400"><Send className="w-3.5 h-3.5 text-[#00FFC2]" />COMPOSE REPLY</div>
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
              <EmptyState label="Select a message to view." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
