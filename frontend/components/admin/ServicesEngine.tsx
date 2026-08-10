"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { api } from "@/lib/api";
import type { Service } from "@/lib/types";
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
import { useConfirm } from "./ConfirmDialog";

const ICONS = ["Layers", "Code2", "Cpu", "Zap", "Globe2", "ShieldCheck"];
const EMPTY: Partial<Service> = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  icon_name: "Layers",
  features: "",
  tech_stack: "",
  highlight: false,
  order: 0,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ServicesEngine({ onChanged }: { onChanged?: () => void }) {
  const confirm = useConfirm();
  const [items, setItems] = useState<Service[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Partial<Service>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => api.services.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm(s); setOpen(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug?.trim() || slugify(form.title || ""),
        order: Number(form.order) || 0,
      };
      if (editing?.id) await api.services.update(editing.id, payload);
      else await api.services.create(payload);
      setOpen(false);
      await load();
      onChanged?.();
    } finally { setSaving(false); }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!(await confirm({ title: "Delete service?", message: "This service card will be permanently removed." }))) return;
    await api.services.remove(id);
    await load();
    onChanged?.();
  };

  return (
    <div>
      <SectionHeader
        title="Services Engine"
        subtitle="Capability cards shown in the Services section."
        action={<PrimaryButton onClick={openNew}><Plus className="w-4 h-4" />Add Service</PrimaryButton>}
      />

      {items.length === 0 ? (
        <EmptyState label="No services yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((s) => (
            <Panel key={s.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{s.icon_name}</span>
                  {s.highlight && <Star className="w-4 h-4 text-[#00FFC2] fill-[#00FFC2]" />}
                </div>
                <h3 className="text-white font-semibold font-space-grotesk">{s.title}</h3>
                <p className="text-xs font-mono text-[#00FFC2] mb-2">{s.tagline}</p>
                <p className="text-sm text-gray-400 line-clamp-3">{s.description}</p>
              </div>
              <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-white/10">
                <GhostButton onClick={() => openEdit(s)} title="Edit"><Pencil className="w-4 h-4" /></GhostButton>
                <GhostButton onClick={() => remove(s.id)} title="Delete" className="hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-4 h-4" /></GhostButton>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Service" : "Add Service"} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title"><TextInput required value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Tagline"><TextInput value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></Field>
          </div>
          <Field label="Description"><TextArea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Features (comma-separated)"><TextInput value={form.features || ""} onChange={(e) => setForm({ ...form, features: e.target.value })} /></Field>
          <Field label="Tech Stack (comma-separated)"><TextInput value={form.tech_stack || ""} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Icon">
              <select value={form.icon_name || "Layers"} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="w-full bg-[#111111] border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Order"><TextInput type="number" value={String(form.order ?? 0)} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></Field>
            <Field label="Slug (auto if blank)"><TextInput value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={!!form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.checked })} className="accent-[#00FFC2]" />
            Highlight (feature this card wider)
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save Service"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
