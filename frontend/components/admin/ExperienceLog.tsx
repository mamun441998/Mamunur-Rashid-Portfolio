"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { api } from "@/lib/api";
import type { Experience } from "@/lib/types";
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

const EMPTY: Partial<Experience> = {
  role: "",
  company: "",
  description: "",
  start_date: "2026-01-01",
  end_date: "",
  is_current: false,
};

export default function ExperienceLog({ onChanged }: { onChanged?: () => void }) {
  const confirm = useConfirm();
  const [items, setItems] = useState<Experience[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Partial<Experience>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => api.experiences.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (x: Experience) => { setEditing(x); setForm({ ...x, end_date: x.end_date || "" }); setOpen(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<Experience> = {
        ...form,
        end_date: form.is_current ? null : (form.end_date || null),
      };
      if (editing?.id) await api.experiences.update(editing.id, payload);
      else await api.experiences.create(payload);
      setOpen(false);
      await load();
      onChanged?.();
    } finally { setSaving(false); }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!(await confirm({ title: "Delete experience?", message: "This experience entry will be permanently removed." }))) return;
    await api.experiences.remove(id);
    await load();
    onChanged?.();
  };

  return (
    <div>
      <SectionHeader
        title="Experience Log"
        subtitle="Professional roles shown on the career timeline."
        action={<PrimaryButton onClick={openNew}><Plus className="w-4 h-4" />Add Experience</PrimaryButton>}
      />

      {items.length === 0 ? (
        <EmptyState label="No experience entries yet." />
      ) : (
        <div className="space-y-4">
          {items.map((x) => (
            <Panel key={x.id} className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="p-2.5 rounded-xl bg-[#00FFC2]/10 border border-[#00FFC2]/20 text-[#00FFC2] h-fit"><Briefcase className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-white font-semibold font-space-grotesk">{x.role}</h3>
                  <p className="text-sm text-[#00FFC2] font-mono">{x.company}</p>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {x.start_date} → {x.is_current ? "Present" : x.end_date || "—"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2 max-w-2xl">{x.description}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <GhostButton onClick={() => openEdit(x)} title="Edit"><Pencil className="w-4 h-4" /></GhostButton>
                <GhostButton onClick={() => remove(x.id)} title="Delete" className="hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-4 h-4" /></GhostButton>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Experience" : "Add Experience"} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Role"><TextInput required value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} /></Field>
            <Field label="Company"><TextInput required value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date"><TextInput type="date" required value={form.start_date || ""} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></Field>
            <Field label="End Date"><TextInput type="date" disabled={!!form.is_current} value={form.end_date || ""} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={!!form.is_current} onChange={(e) => setForm({ ...form, is_current: e.target.checked })} className="accent-[#00FFC2]" />
            Currently working here
          </label>
          <Field label="Description"><TextArea rows={4} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save Experience"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
