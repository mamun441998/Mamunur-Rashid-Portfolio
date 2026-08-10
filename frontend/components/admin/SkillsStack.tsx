"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Cpu } from "lucide-react";
import { api } from "@/lib/api";
import { getSkillIcon } from "@/lib/skillIcons";
import type { Skill } from "@/lib/types";
import {
  SectionHeader,
  Panel,
  Field,
  TextInput,
  PrimaryButton,
  GhostButton,
  Modal,
  EmptyState,
} from "./ui";
import { useConfirm } from "./ConfirmDialog";

const CATEGORIES = ["Backend", "Frontend", "Database", "Architecture", "Tools"];
const EMPTY: Partial<Skill> = { name: "", category: "Backend", proficiency: 80 };

export default function SkillsStack({ onChanged }: { onChanged?: () => void }) {
  const confirm = useConfirm();
  const [items, setItems] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<Partial<Skill>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => api.skills.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (s: Skill) => { setEditing(s); setForm(s); setOpen(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, proficiency: Number(form.proficiency) || 0 };
      if (editing?.id) await api.skills.update(editing.id, payload);
      else await api.skills.create(payload);
      setOpen(false);
      await load();
      onChanged?.();
    } finally { setSaving(false); }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!(await confirm({ title: "Delete skill?", message: "This skill will be permanently removed." }))) return;
    await api.skills.remove(id);
    await load();
    onChanged?.();
  };

  const grouped = CATEGORIES.map((c) => ({ category: c, list: items.filter((s) => s.category === c) }))
    .filter((g) => g.list.length > 0);
  const ungrouped = items.filter((s) => !CATEGORIES.includes(s.category));
  if (ungrouped.length) grouped.push({ category: "Other", list: ungrouped });

  return (
    <div>
      <SectionHeader
        title="Skills Stack"
        subtitle="Technical proficiencies grouped by category."
        action={<PrimaryButton onClick={openNew}><Plus className="w-4 h-4" />Add Skill</PrimaryButton>}
      />

      {items.length === 0 ? (
        <EmptyState label="No skills yet. Add your first skill." />
      ) : (
        <div className="space-y-6">
          {grouped.map((g) => (
            <div key={g.category}>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#00FFC2] mb-3">{g.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {g.list.map((s) => (
                  <Panel key={s.id} className="!p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {getSkillIcon(s.name) ? (
                          <Image src={getSkillIcon(s.name)!} alt={s.name} width={22} height={22} unoptimized className="object-contain shrink-0" />
                        ) : (
                          <span className="w-[22px] h-[22px] rounded-md bg-[#00FFC2]/10 border border-[#00FFC2]/30 flex items-center justify-center text-[#00FFC2] shrink-0">
                            <Cpu className="w-3 h-3" />
                          </span>
                        )}
                        <span className="text-white font-semibold text-sm truncate">{s.name}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-500 shrink-0">{s.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-3">
                      <div className="h-full bg-[#00FFC2] rounded-full" style={{ width: `${s.proficiency}%` }} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <GhostButton onClick={() => openEdit(s)} title="Edit" className="!px-2 !py-1"><Pencil className="w-3.5 h-3.5" /></GhostButton>
                      <GhostButton onClick={() => remove(s.id)} title="Delete" className="!px-2 !py-1 hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-3.5 h-3.5" /></GhostButton>
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Skill" : "Add Skill"}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Name"><TextInput required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Category">
            <select
              value={form.category || "Backend"}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-[#111111] border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={`Proficiency (${form.proficiency || 0}%)`}>
            <input
              type="range" min={0} max={100}
              value={Number(form.proficiency) || 0}
              onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
              className="w-full accent-[#00FFC2]"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save Skill"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
