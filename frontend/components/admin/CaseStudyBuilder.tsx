"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Link2 } from "lucide-react";
import { api } from "@/lib/api";
import type { CaseStudy, CaseStudyMetric } from "@/lib/types";
import {
  SectionHeader,
  Panel,
  Field,
  TextInput,
  TextArea,
  PrimaryButton,
  GhostButton,
  Modal,
  EmptyState,
} from "./ui";

interface Form {
  slug: string;
  title: string;
  subtitle: string;
  challenge: string;
  github_repo_url: string;
  code_snippet: string;
  order: number;
  metrics: CaseStudyMetric[];
}

const EMPTY: Form = {
  slug: "",
  title: "",
  subtitle: "",
  challenge: "",
  github_repo_url: "",
  code_snippet: "",
  order: 0,
  metrics: [{ label: "", value: "", sub: "" }],
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseMetrics(raw: string): CaseStudyMetric[] {
  try {
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function CaseStudyBuilder({ onChanged }: { onChanged?: () => void }) {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => api.caseStudies.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (c: CaseStudy) => {
    setEditing(c);
    setForm({
      slug: c.slug, title: c.title, subtitle: c.subtitle, challenge: c.challenge,
      github_repo_url: c.github_repo_url || "", code_snippet: c.code_snippet,
      order: c.order, metrics: parseMetrics(c.metrics),
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<CaseStudy> = {
        slug: form.slug.trim() || slugify(form.title),
        title: form.title,
        subtitle: form.subtitle,
        challenge: form.challenge,
        github_repo_url: form.github_repo_url || null,
        code_snippet: form.code_snippet,
        order: Number(form.order) || 0,
        metrics: JSON.stringify(form.metrics.filter((m) => m.label || m.value)),
      };
      if (editing?.id) await api.caseStudies.update(editing.id, payload);
      else await api.caseStudies.create(payload);
      setOpen(false);
      await load();
      onChanged?.();
    } finally { setSaving(false); }
  };

  const remove = async (id?: number) => {
    if (!id || !confirm("Delete this case study?")) return;
    await api.caseStudies.remove(id);
    await load();
    onChanged?.();
  };

  const setMetric = (i: number, key: keyof CaseStudyMetric, value: string) =>
    setForm((f) => ({ ...f, metrics: f.metrics.map((m, idx) => idx === i ? { ...m, [key]: value } : m) }));
  const addMetric = () => setForm((f) => ({ ...f, metrics: [...f.metrics, { label: "", value: "", sub: "" }] }));
  const removeMetric = (i: number) => setForm((f) => ({ ...f, metrics: f.metrics.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <SectionHeader
        title="Case Study Builder"
        subtitle="Deep-dive architecture case studies with metrics & code."
        action={<PrimaryButton onClick={openNew}><Plus className="w-4 h-4" />Add Case Study</PrimaryButton>}
      />

      {items.length === 0 ? (
        <EmptyState label="No case studies yet." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((c) => {
            const metrics = parseMetrics(c.metrics);
            return (
              <Panel key={c.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-white font-semibold font-space-grotesk">{c.title}</h3>
                    <p className="text-xs font-mono text-[#00FFC2]">{c.subtitle}</p>
                    <p className="text-[11px] font-mono text-gray-500 mt-1">/{c.slug}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {c.github_repo_url && <a href={c.github_repo_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#00FFC2] pt-1"><Link2 className="w-4 h-4" /></a>}
                    <GhostButton onClick={() => openEdit(c)} title="Edit"><Pencil className="w-4 h-4" /></GhostButton>
                    <GhostButton onClick={() => remove(c.id)} title="Delete" className="hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-4 h-4" /></GhostButton>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-3 line-clamp-2">{c.challenge}</p>
                {metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {metrics.slice(0, 4).map((m, i) => (
                      <div key={i} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                        <div className="text-[#00FFC2] font-bold text-sm">{m.value}</div>
                        <div className="text-[10px] font-mono text-gray-500">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Case Study" : "Add Case Study"} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title"><TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Subtitle"><TextInput value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Slug (auto if blank)"><TextInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
            <Field label="GitHub Repo URL"><TextInput value={form.github_repo_url} onChange={(e) => setForm({ ...form, github_repo_url: e.target.value })} /></Field>
          </div>
          <Field label="Challenge"><TextArea rows={4} value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} /></Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Metrics</span>
              <GhostButton onClick={addMetric} className="!px-2 !py-1 text-xs"><Plus className="w-3.5 h-3.5" />Add Metric</GhostButton>
            </div>
            <div className="space-y-2">
              {form.metrics.map((m, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                  <TextInput placeholder="Label" value={m.label} onChange={(e) => setMetric(i, "label", e.target.value)} />
                  <TextInput placeholder="Value" value={m.value} onChange={(e) => setMetric(i, "value", e.target.value)} />
                  <TextInput placeholder="Sub" value={m.sub || ""} onChange={(e) => setMetric(i, "sub", e.target.value)} />
                  <GhostButton onClick={() => removeMetric(i)} className="!px-2 !py-2 hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-4 h-4" /></GhostButton>
                </div>
              ))}
            </div>
          </div>

          <Field label="Code Snippet"><TextArea rows={5} value={form.code_snippet} onChange={(e) => setForm({ ...form, code_snippet: e.target.value })} className="font-mono !text-xs" /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save Case Study"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
