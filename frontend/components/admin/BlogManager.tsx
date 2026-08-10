"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Newspaper, Upload, Copy, Check, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import type { Blog } from "@/lib/types";
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

const EMPTY: Partial<Blog> = {
  title: "",
  slug: "",
  excerpt: "",
  meta_description: "",
  tags: "",
  read_time: "",
  hero_image_url: "",
  content_html: "",
  author: "Mamunur Rashid",
  published: true,
};

export default function BlogManager({ onChanged }: { onChanged?: () => void }) {
  const confirm = useConfirm();
  const [items, setItems] = useState<Blog[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState<Partial<Blog>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.blogs.listAll().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setUploadedUrl(""); setErr(""); setOpen(true); };
  const openEdit = (x: Blog) => { setEditing(x); setForm({ ...x }); setUploadedUrl(""); setErr(""); setOpen(true); };

  const set = (k: keyof Blog, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    setUploading(true); setErr("");
    try {
      const { url } = await api.blogs.uploadImage(file);
      setUploadedUrl(url);
    } catch (e: any) {
      setErr(e?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const copyLink = async () => {
    if (!uploadedUrl) return;
    try { await navigator.clipboard.writeText(uploadedUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      if (editing?.id) await api.blogs.update(editing.id, form);
      else await api.blogs.create(form);
      setOpen(false);
      await load();
      onChanged?.();
    } catch (e: any) {
      setErr(e?.message || "Failed to save blog.");
    } finally { setSaving(false); }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!(await confirm({ title: "Delete this blog?", message: "The article will be permanently removed from the live site." }))) return;
    await api.blogs.remove(id);
    await load();
    onChanged?.();
  };

  return (
    <div>
      <SectionHeader
        title="Blog Studio"
        subtitle="Write articles in HTML — they go live instantly and are SEO-optimized."
        action={<PrimaryButton onClick={openNew}><Plus className="w-4 h-4" />New Article</PrimaryButton>}
      />

      {items.length === 0 ? (
        <EmptyState label="No blog posts yet. Click “New Article” to publish your first." />
      ) : (
        <div className="space-y-4">
          {items.map((x) => (
            <Panel key={x.id} className="flex items-start justify-between gap-4">
              <div className="flex gap-4 min-w-0">
                {x.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={x.hero_image_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" />
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#00FFC2]/10 border border-[#00FFC2]/20 text-[#00FFC2] h-fit"><Newspaper className="w-5 h-5" /></div>
                )}
                <div className="min-w-0">
                  <h3 className="text-white font-semibold font-space-grotesk truncate">{x.title}</h3>
                  <p className="text-[11px] text-[#00FFC2] font-mono mt-0.5 truncate">/blog/{x.slug}</p>
                  <p className="text-sm text-gray-400 mt-1.5 line-clamp-2 max-w-2xl">{x.excerpt}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {!x.published && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">DRAFT</span>}
                    <a href={`/blog/${x.slug}`} target="_blank" rel="noreferrer" className="text-[11px] font-mono text-gray-500 hover:text-[#00FFC2] inline-flex items-center gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Article" : "New Article"} wide>
        <form onSubmit={save} className="space-y-4">
          {err && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono">{err}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title"><TextInput required value={form.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="How I build scalable SaaS…" /></Field>
            <Field label="Slug (URL — leave blank to auto-generate)"><TextInput value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="build-scalable-saas" /></Field>
          </div>

          <Field label="Excerpt (short summary shown in the list)">
            <TextArea rows={2} value={form.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tags (comma-separated — SEO keywords)"><TextInput value={form.tags || ""} onChange={(e) => set("tags", e.target.value)} placeholder="SaaS, FastAPI, Next.js" /></Field>
            <Field label="Read time"><TextInput value={form.read_time || ""} onChange={(e) => set("read_time", e.target.value)} placeholder="6 min read" /></Field>
          </div>

          <Field label="Meta description (SEO — 150-160 chars for Google)">
            <TextArea rows={2} value={form.meta_description || ""} onChange={(e) => set("meta_description", e.target.value)} />
          </Field>

          {/* Hero image: upload -> get link -> paste into the URL box */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm font-semibold text-white">Hero Image</span>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files?.[0])} />
              <GhostButton type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload className="w-4 h-4" />{uploading ? "Uploading…" : "Upload Image"}
              </GhostButton>
            </div>

            {uploadedUrl && (
              <div className="flex items-center gap-2 rounded-lg bg-[#00FFC2]/5 border border-[#00FFC2]/30 px-3 py-2">
                <span className="text-[11px] font-mono text-[#00FFC2] truncate flex-1">{uploadedUrl}</span>
                <button type="button" onClick={copyLink} className="p-1.5 rounded-md hover:bg-white/10 text-gray-300" title="Copy link">
                  {copied ? <Check className="w-4 h-4 text-[#00FFC2]" /> : <Copy className="w-4 h-4" />}
                </button>
                <button type="button" onClick={() => set("hero_image_url", uploadedUrl)} className="text-[11px] font-mono px-2 py-1 rounded-md bg-[#00FFC2] text-black font-bold">
                  Use ↓
                </button>
              </div>
            )}

            <Field label="Hero Image URL (paste the uploaded link here, or any image URL)">
              <TextInput value={form.hero_image_url || ""} onChange={(e) => set("hero_image_url", e.target.value)} placeholder="https://…/api/blogs/image/1" />
            </Field>
            {form.hero_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.hero_image_url} alt="preview" className="w-full max-h-40 object-cover rounded-lg border border-white/10" />
            ) : null}
          </div>

          <Field label="Content (HTML — use <h2>, <p>, <ul>, <pre><code>, <blockquote>, <img>, etc.)">
            <TextArea rows={12} value={form.content_html || ""} onChange={(e) => set("content_html", e.target.value)} className="font-mono text-xs" placeholder="<h2>Introduction</h2>\n<p>Your story…</p>" />
          </Field>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={!!form.published} onChange={(e) => set("published", e.target.checked)} className="accent-[#00FFC2]" />
            Published (visible on the live site)
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <GhostButton type="button" onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Save Article"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
