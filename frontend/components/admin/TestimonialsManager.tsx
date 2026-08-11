"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Star, Upload, Quote } from "lucide-react";
import { api } from "@/lib/api";
import type { Testimonial } from "@/lib/types";
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

const EMPTY: Partial<Testimonial> = {
  name: "",
  role: "",
  company: "",
  avatar_url: "",
  quote: "",
  rating: 5,
  featured: false,
  order: 0,
};

export default function TestimonialsManager({ onChanged }: { onChanged?: () => void }) {
  const confirm = useConfirm();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.testimonials.list().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setErr(""); setOpen(true); };
  const openEdit = (x: Testimonial) => { setEditing(x); setForm({ ...x }); setErr(""); setOpen(true); };
  const set = (k: keyof Testimonial, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    setUploading(true); setErr("");
    try {
      const { url } = await api.testimonials.uploadImage(file);
      set("avatar_url", url);
    } catch (e: any) {
      setErr(e?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      const payload = { ...form, rating: Number(form.rating) || 5, order: Number(form.order) || 0 };
      if (editing?.id) await api.testimonials.update(editing.id, payload);
      else await api.testimonials.create(payload);
      setOpen(false);
      await load();
      onChanged?.();
    } catch (e: any) {
      setErr(e?.message || "Failed to save testimonial.");
    } finally { setSaving(false); }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!(await confirm({ title: "Delete this testimonial?", message: "It will be removed from the live site." }))) return;
    await api.testimonials.remove(id);
    await load();
    onChanged?.();
  };

  return (
    <div>
      <SectionHeader
        title="Testimonials"
        subtitle="Client & colleague reviews shown in the moving social-proof section."
        action={<PrimaryButton onClick={openNew}><Plus className="w-4 h-4" />Add Testimonial</PrimaryButton>}
      />

      {items.length === 0 ? (
        <EmptyState label="No testimonials yet. Add your first client review." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((x) => (
            <Panel key={x.id} className="flex items-start justify-between gap-4">
              <div className="flex gap-4 min-w-0">
                {x.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={x.avatar_url} alt={x.name} className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0" />
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#00FFC2]/10 border border-[#00FFC2]/20 text-[#00FFC2] h-fit"><Quote className="w-5 h-5" /></div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold font-space-grotesk truncate">{x.name}</h3>
                    <span className="flex items-center gap-0.5 shrink-0">
                      {Array.from({ length: x.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#00FFC2] text-[#00FFC2]" />
                      ))}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#00FFC2] font-mono mt-0.5 truncate">{[x.role, x.company].filter(Boolean).join(" · ")}</p>
                  <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">{x.quote}</p>
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Testimonial" : "Add Testimonial"} wide>
        <form onSubmit={save} className="space-y-4">
          {err && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono">{err}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name"><TextInput required value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Role"><TextInput value={form.role || ""} onChange={(e) => set("role", e.target.value)} placeholder="Founder, CTO…" /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company"><TextInput value={form.company || ""} onChange={(e) => set("company", e.target.value)} /></Field>
            <Field label="Display order (lower = first)"><TextInput type="number" value={String(form.order ?? 0)} onChange={(e) => set("order", e.target.value)} /></Field>
          </div>

          <Field label="Quote"><TextArea rows={4} required value={form.quote || ""} onChange={(e) => set("quote", e.target.value)} /></Field>

          {/* Rating picker */}
          <div>
            <span className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">Rating</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => set("rating", n)} className="p-0.5" title={`${n} star${n > 1 ? "s" : ""}`}>
                  <Star className={`w-6 h-6 transition ${n <= (Number(form.rating) || 0) ? "fill-[#00FFC2] text-[#00FFC2]" : "text-gray-600 hover:text-gray-400"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Avatar upload */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm font-semibold text-white">Avatar (optional)</span>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files?.[0])} />
              <GhostButton type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload className="w-4 h-4" />{uploading ? "Uploading…" : "Upload Image"}
              </GhostButton>
            </div>
            <Field label="Avatar URL (auto-filled after upload, or paste any image URL)">
              <TextInput value={form.avatar_url || ""} onChange={(e) => set("avatar_url", e.target.value)} placeholder="https://…" />
            </Field>
            {form.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatar_url} alt="preview" className="w-16 h-16 rounded-full object-cover border border-white/10" />
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-[#00FFC2]" />
            Featured (highlight this review)
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <GhostButton type="button" onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save Testimonial"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
