"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut, CheckCircle2, Circle, Clock, FileText, Download, CalendarClock,
  Receipt, ListChecks, MessageSquare, Loader2, Sparkles,
} from "lucide-react";
import { api, downloadPortalFile } from "@/lib/api";
import { isPortalAuthenticated, portalLogout } from "@/lib/portalAuth";
import type { PortalDashboard } from "@/lib/types";
import { externalHref } from "@/lib/url";

const STATUS_LABEL: Record<string, string> = { active: "In progress", on_hold: "On hold", completed: "Completed" };

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
function fmtDate(s?: string | null) {
  if (!s) return "";
  try { return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); } catch { return ""; }
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[var(--color-accent)]">{icon}</span>
        <h2 className="font-semibold font-space-grotesk">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function PortalDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<PortalDashboard | null>(null);
  const [error, setError] = useState("");
  const [busyFile, setBusyFile] = useState<number | null>(null);

  useEffect(() => {
    if (!isPortalAuthenticated()) { router.replace("/portal"); return; }
    api.portal.me().then(setData).catch((e) => setError(e?.message || "Could not load your portal."));
  }, [router]);

  if (error) {
    return (
      <main data-theme="dark" className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">{error}</p>
          <button onClick={() => portalLogout()} className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-black text-sm font-semibold">Back to sign-in</button>
        </div>
      </main>
    );
  }
  if (!data) {
    return (
      <main data-theme="dark" className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
      </main>
    );
  }

  const { client, milestones, updates, files, invoices } = data;
  const meetingHref = externalHref(client.meeting_url);

  return (
    <main data-theme="dark" className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text-primary)] px-4 sm:px-6 lg:px-10 py-8 select-none">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-[var(--color-accent)] text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Client Portal
          </div>
          <button onClick={() => portalLogout()} className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        {/* Header / progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-3xl bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-background)] border border-[var(--color-border)] p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] font-mono">Welcome back, {client.name.split(" ")[0]}</p>
              <h1 className="text-2xl sm:text-3xl font-bold font-space-grotesk mt-1">{client.project_title || "Your Project"}</h1>
              {client.company && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{client.company}</p>}
            </div>
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
              {STATUS_LABEL[client.status] || client.status}
            </span>
          </div>
          {client.project_description && (
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-4 max-w-2xl whitespace-pre-line">{client.project_description}</p>
          )}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[var(--color-text-secondary)]">Overall progress</span>
              <span className="text-[var(--color-accent)] font-bold">{client.progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, client.progress))}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-[var(--color-accent)] rounded-full" />
            </div>
          </div>
          {meetingHref && (
            <a href={meetingHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-black text-sm font-semibold transition-transform hover:scale-[1.02]">
              <CalendarClock className="w-4 h-4" /> Schedule / Join a meeting
            </a>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Milestones */}
          <Card title="Milestones" icon={<ListChecks className="w-5 h-5" />}>
            {milestones.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] font-mono">No milestones yet.</p>
            ) : (
              <ul className="space-y-3">
                {milestones.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    {m.status === "done"
                      ? <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                      : m.status === "in_progress"
                      ? <Clock className="w-5 h-5 text-yellow-400 shrink-0" />
                      : <Circle className="w-5 h-5 text-[var(--color-text-muted)] shrink-0" />}
                    <span className={`text-sm ${m.status === "done" ? "text-[var(--color-text-secondary)] line-through" : "text-[var(--color-text-primary)]"}`}>{m.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Next steps */}
          <Card title="What we need from you" icon={<Sparkles className="w-5 h-5" />}>
            {client.next_steps?.trim()
              ? <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{client.next_steps}</p>
              : <p className="text-sm text-[var(--color-text-muted)] font-mono">Nothing needed right now — you&rsquo;re all set. 🎉</p>}
          </Card>

          {/* Files */}
          <Card title="Deliverables & files" icon={<FileText className="w-5 h-5" />}>
            {files.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] font-mono">No files shared yet.</p>
            ) : (
              <ul className="space-y-2">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] truncate">{f.filename}</p>
                      <p className="text-[11px] font-mono text-[var(--color-text-muted)]">{fmtBytes(f.size)} · {fmtDate(f.created_at)}</p>
                    </div>
                    <button
                      onClick={async () => { setBusyFile(f.id); try { await downloadPortalFile(f.id, f.filename); } finally { setBusyFile(null); } }}
                      className="p-2 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 shrink-0"
                      title="Download"
                    >
                      {busyFile === f.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Invoices */}
          <Card title="Invoices" icon={<Receipt className="w-5 h-5" />}>
            {invoices.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] font-mono">No invoices yet.</p>
            ) : (
              <ul className="space-y-2">
                {invoices.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] truncate">{i.title}</p>
                      {i.due_date && <p className="text-[11px] font-mono text-[var(--color-text-muted)]">Due {fmtDate(i.due_date)}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums">{i.currency === "USD" ? "$" : ""}{i.amount.toLocaleString()}</p>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${i.status === "paid" ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]" : "bg-yellow-500/10 text-yellow-400"}`}>{i.status.toUpperCase()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Proposal */}
        {client.proposal_text?.trim() && (
          <div className="mt-6">
            <Card title="Proposal & scope" icon={<FileText className="w-5 h-5" />}>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{client.proposal_text}</p>
            </Card>
          </div>
        )}

        {/* Updates feed */}
        <div className="mt-6">
          <Card title="Project updates" icon={<MessageSquare className="w-5 h-5" />}>
            {updates.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] font-mono">No updates yet — check back soon.</p>
            ) : (
              <ul className="space-y-4">
                {updates.map((u) => (
                  <li key={u.id} className="relative pl-5 border-l border-[var(--color-border)]">
                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
                    {u.title && <p className="text-sm font-semibold text-[var(--color-text-primary)]">{u.title}</p>}
                    {u.body && <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-0.5 whitespace-pre-line">{u.body}</p>}
                    <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-1">{fmtDate(u.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
