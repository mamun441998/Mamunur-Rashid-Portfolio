"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Link2, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";
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

const EMPTY: Partial<Project> = {
  title: "",
  description: "",
  tech_stack: "",
  project_url: "",
  github_url: "",
  image_url: "",
};

export default function ProjectsManager({ onChanged }: { onChanged?: () => void }) {
  const [items, setItems] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Partial<Project>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => api.projects.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm(p); setOpen(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?.id) await api.projects.update(editing.id, form);
      else await api.projects.create(form);
      setOpen(false);
      await load();
      onChanged?.();
    } finally { setSaving(false); }
  };

  const remove = async (id?: number) => {
    if (!id || !confirm("Delete this project?")) return;
    await api.projects.remove(id);
    await load();
    onChanged?.();
  };

  return (
    <div>
      <SectionHeader
        title="Projects Manager"
        subtitle="Featured work shown on the public site."
        action={<PrimaryButton onClick={openNew}><Plus className="w-4 h-4" />Add Project</PrimaryButton>}
      />

      {items.length === 0 ? (
        <EmptyState label="No projects yet. Add your first project." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((p) => (
            <Panel key={p.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-white font-semibold font-space-grotesk mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-3 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tech_stack.split(",").map((t) => t.trim()).filter(Boolean).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-gray-400">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex gap-2 text-gray-500">
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="hover:text-[#00FFC2]"><Link2 className="w-4 h-4" /></a>}
                  {p.project_url && <a href={p.project_url} target="_blank" rel="noreferrer" className="hover:text-[#00FFC2]"><ExternalLink className="w-4 h-4" /></a>}
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => openEdit(p)} title="Edit"><Pencil className="w-4 h-4" /></GhostButton>
                  <GhostButton onClick={() => remove(p.id)} title="Delete" className="hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-4 h-4" /></GhostButton>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Project" : "Add Project"} wide>
        <form onSubmit={save} className="space-y-4">
          <Field label="Title"><TextInput required value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Description"><TextArea rows={4} required value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Tech Stack (comma-separated)"><TextInput value={form.tech_stack || ""} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Project URL"><TextInput value={form.project_url || ""} onChange={(e) => setForm({ ...form, project_url: e.target.value })} /></Field>
            <Field label="GitHub URL"><TextInput value={form.github_url || ""} onChange={(e) => setForm({ ...form, github_url: e.target.value })} /></Field>
          </div>
          <Field label="Image URL"><TextInput value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save Project"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
