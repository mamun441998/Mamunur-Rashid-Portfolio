"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Users, ArrowLeft, Send, Save, Upload, Download,
  CheckCircle2, Circle, Clock, ExternalLink,
} from "lucide-react";
import { api, downloadPortalFile } from "@/lib/api";
import type { PortalClient, PortalDashboard, Milestone, ClientUpdate, Invoice } from "@/lib/types";
import {
  SectionHeader, Panel, Field, TextInput, TextArea, PrimaryButton, GhostButton, Modal, EmptyState, StatusToast,
} from "./ui";
import { useConfirm } from "./ConfirmDialog";

type Toast = { type: "success" | "error"; message: string } | null;
const MS_STATES = ["pending", "in_progress", "done"] as const;

export default function ClientsManager({ onChanged, focusClientId, focusNonce }: { onChanged?: () => void; focusClientId?: number | null; focusNonce?: number }) {
  const confirm = useConfirm();
  const [clients, setClients] = useState<PortalClient[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<PortalDashboard | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  // client create/edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortalClient | null>(null);
  const [cForm, setCForm] = useState<Partial<PortalClient>>({});

  const flash = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 3500); };
  const loadClients = () => api.clients.list().then(setClients).catch(() => setClients([]));
  const loadDetail = (id: number) => api.clients.detail(id).then(setDetail).catch(() => setDetail(null));

  useEffect(() => { loadClients(); }, []);
  useEffect(() => { if (selectedId) loadDetail(selectedId); else setDetail(null); }, [selectedId]);

  // Deep-link from a notification: jump straight into a specific client's Manage view.
  useEffect(() => {
    if (focusNonce && focusClientId) setSelectedId(focusClientId);
  }, [focusNonce, focusClientId]);

  // ---------- client CRUD ----------
  const openNew = () => { setEditing(null); setCForm({ status: "active", progress: 0 }); setModalOpen(true); };
  const openEdit = (c: PortalClient) => { setEditing(c); setCForm({ ...c }); setModalOpen(true); };
  const saveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing?.id) await api.clients.update(editing.id, cForm);
      else await api.clients.create(cForm);
      setModalOpen(false); await loadClients(); onChanged?.();
      flash({ type: "success", message: "Client saved." });
    } catch (err: any) { flash({ type: "error", message: err?.message || "Save failed." }); }
  };
  const removeClient = async (c: PortalClient) => {
    if (!(await confirm({ title: "Delete client?", message: `${c.name} and all their portal data will be permanently removed.` }))) return;
    await api.clients.remove(c.id); await loadClients(); onChanged?.();
    if (selectedId === c.id) setSelectedId(null);
  };
  const sendLink = async (c: PortalClient) => {
    try { const r = await api.clients.sendLink(c.id); flash({ type: "success", message: r.message }); }
    catch (err: any) { flash({ type: "error", message: err?.message || "Could not send link." }); }
  };

  // ---------- detail: project fields ----------
  const [dForm, setDForm] = useState<Partial<PortalClient>>({});
  useEffect(() => { if (detail) setDForm({ ...detail.client }); }, [detail]);
  const saveProject = async () => {
    if (!selectedId) return;
    try {
      await api.clients.update(selectedId, {
        project_title: dForm.project_title, project_description: dForm.project_description,
        status: dForm.status, progress: Number(dForm.progress) || 0,
        meeting_url: dForm.meeting_url, proposal_text: dForm.proposal_text, next_steps: dForm.next_steps,
      });
      await loadDetail(selectedId); await loadClients();
      flash({ type: "success", message: "Project details saved." });
    } catch (err: any) { flash({ type: "error", message: err?.message || "Save failed." }); }
  };

  // ---------- milestones ----------
  const [msTitle, setMsTitle] = useState("");
  const addMilestone = async () => {
    if (!selectedId || !msTitle.trim()) return;
    await api.clients.addMilestone(selectedId, { title: msTitle.trim(), status: "pending", order: (detail?.milestones.length || 0) + 1 });
    setMsTitle(""); await loadDetail(selectedId);
  };
  const cycleMilestone = async (m: Milestone) => {
    const next = MS_STATES[(MS_STATES.indexOf(m.status as any) + 1) % MS_STATES.length];
    await api.clients.updateMilestone(m.client_id, m.id, { status: next }); await loadDetail(m.client_id);
  };
  const delMilestone = async (m: Milestone) => { await api.clients.deleteMilestone(m.client_id, m.id); await loadDetail(m.client_id); };

  // ---------- updates ----------
  const [upTitle, setUpTitle] = useState(""); const [upBody, setUpBody] = useState("");
  const addUpdate = async () => {
    if (!selectedId || (!upTitle.trim() && !upBody.trim())) return;
    await api.clients.addUpdate(selectedId, { title: upTitle.trim(), body: upBody.trim() });
    setUpTitle(""); setUpBody(""); await loadDetail(selectedId); onChanged?.();
  };
  const delUpdate = async (u: ClientUpdate) => { await api.clients.deleteUpdate(u.client_id, u.id); await loadDetail(u.client_id); };

  // ---------- invoices ----------
  const [invForm, setInvForm] = useState<{ title: string; amount: string; status: string }>({ title: "", amount: "", status: "due" });
  const addInvoice = async () => {
    if (!selectedId || !invForm.title.trim()) return;
    await api.clients.addInvoice(selectedId, { title: invForm.title.trim(), amount: Number(invForm.amount) || 0, currency: "USD", status: invForm.status });
    setInvForm({ title: "", amount: "", status: "due" }); await loadDetail(selectedId);
  };
  const toggleInvoice = async (i: Invoice) => { await api.clients.updateInvoice(i.client_id, i.id, { status: i.status === "paid" ? "due" : "paid" }); await loadDetail(i.client_id); };
  const delInvoice = async (i: Invoice) => { await api.clients.deleteInvoice(i.client_id, i.id); await loadDetail(i.client_id); };

  // ---------- files ----------
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const uploadFile = async (f?: File | null) => {
    if (!selectedId || !f) return;
    setUploading(true);
    try { await api.clients.uploadFile(selectedId, f); await loadDetail(selectedId); }
    catch (err: any) { flash({ type: "error", message: err?.message || "Upload failed." }); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };
  const delFile = async (fid: number) => { if (!selectedId) return; await api.clients.deleteFile(selectedId, fid); await loadDetail(selectedId); };

  // ===================== render =====================
  if (selectedId && detail) {
    const c = detail.client;
    return (
      <div>
        {toast && <div className="mb-4"><StatusToast status={toast} /></div>}
        <button onClick={() => setSelectedId(null)} className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#00FFC2] mb-4">
          <ArrowLeft className="w-4 h-4" /> All clients
        </button>
        <SectionHeader
          title={c.name}
          subtitle={[c.company, c.email].filter(Boolean).join(" · ")}
          action={<PrimaryButton onClick={() => sendLink(c)}><Send className="w-4 h-4" />Email portal link</PrimaryButton>}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Project fields */}
          <Panel className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Project overview</h3>
              <PrimaryButton onClick={saveProject}><Save className="w-4 h-4" />Save</PrimaryButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Project title"><TextInput value={dForm.project_title || ""} onChange={(e) => setDForm({ ...dForm, project_title: e.target.value })} /></Field>
              <Field label="Status">
                <select value={dForm.status || "active"} onChange={(e) => setDForm({ ...dForm, status: e.target.value })}
                  className="w-full bg-[#111111] border border-white/10 focus:border-[#00FFC2] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
                  <option value="active">Active</option><option value="on_hold">On hold</option><option value="completed">Completed</option>
                </select>
              </Field>
            </div>
            <Field label="Project description"><TextArea rows={3} value={dForm.project_description || ""} onChange={(e) => setDForm({ ...dForm, project_description: e.target.value })} /></Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={`Overall progress: ${dForm.progress || 0}%`}>
                <input type="range" min={0} max={100} value={dForm.progress || 0} onChange={(e) => setDForm({ ...dForm, progress: Number(e.target.value) })} className="w-full accent-[#00FFC2]" />
              </Field>
              <Field label="Meeting / booking URL"><TextInput value={dForm.meeting_url || ""} onChange={(e) => setDForm({ ...dForm, meeting_url: e.target.value })} placeholder="https://calendar.google.com/…" /></Field>
            </div>
            <Field label="What we need from the client (next steps)"><TextArea rows={2} value={dForm.next_steps || ""} onChange={(e) => setDForm({ ...dForm, next_steps: e.target.value })} /></Field>
            <Field label="Proposal & scope"><TextArea rows={3} value={dForm.proposal_text || ""} onChange={(e) => setDForm({ ...dForm, proposal_text: e.target.value })} /></Field>
          </Panel>

          {/* Milestones */}
          <Panel className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Milestones</h3>
            <div className="flex gap-2">
              <TextInput value={msTitle} onChange={(e) => setMsTitle(e.target.value)} placeholder="Add a milestone…" onKeyDown={(e) => { if (e.key === "Enter") addMilestone(); }} />
              <GhostButton onClick={addMilestone}><Plus className="w-4 h-4" /></GhostButton>
            </div>
            {detail.milestones.length === 0 ? <p className="text-xs text-gray-500 font-mono">None yet.</p> : (
              <ul className="space-y-2">
                {detail.milestones.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2">
                    <button onClick={() => cycleMilestone(m)} className="flex items-center gap-2 text-left min-w-0" title="Click to change status">
                      {m.status === "done" ? <CheckCircle2 className="w-4 h-4 text-[#00FFC2] shrink-0" /> : m.status === "in_progress" ? <Clock className="w-4 h-4 text-yellow-400 shrink-0" /> : <Circle className="w-4 h-4 text-gray-500 shrink-0" />}
                      <span className={`text-sm truncate ${m.status === "done" ? "text-gray-500 line-through" : "text-white"}`}>{m.title}</span>
                    </button>
                    <button onClick={() => delMilestone(m)} className="text-gray-500 hover:text-red-400 shrink-0"><Trash2 className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Invoices */}
          <Panel className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Invoices</h3>
            <div className="flex gap-2">
              <TextInput value={invForm.title} onChange={(e) => setInvForm({ ...invForm, title: e.target.value })} placeholder="Title" />
              <TextInput value={invForm.amount} onChange={(e) => setInvForm({ ...invForm, amount: e.target.value })} placeholder="$" type="number" className="max-w-[90px]" />
              <GhostButton onClick={addInvoice}><Plus className="w-4 h-4" /></GhostButton>
            </div>
            {detail.invoices.length === 0 ? <p className="text-xs text-gray-500 font-mono">None yet.</p> : (
              <ul className="space-y-2">
                {detail.invoices.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2">
                    <span className="text-sm text-white truncate">{i.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold tabular-nums text-white">${i.amount.toLocaleString()}</span>
                      <button onClick={() => toggleInvoice(i)} className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${i.status === "paid" ? "bg-[#00FFC2]/15 text-[#00FFC2]" : "bg-yellow-500/10 text-yellow-400"}`}>{i.status.toUpperCase()}</button>
                      <button onClick={() => delInvoice(i)} className="text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Files */}
          <Panel className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Deliverables</h3>
              <input ref={fileRef} type="file" hidden onChange={(e) => uploadFile(e.target.files?.[0])} />
              <GhostButton onClick={() => fileRef.current?.click()} disabled={uploading}><Upload className="w-4 h-4" />{uploading ? "Uploading…" : "Upload"}</GhostButton>
            </div>
            {detail.files.length === 0 ? <p className="text-xs text-gray-500 font-mono">No files.</p> : (
              <ul className="space-y-2">
                {detail.files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-2 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2">
                    <span className="text-sm text-white truncate">{f.filename}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => downloadPortalFile(f.id, f.filename)} className="text-gray-400 hover:text-[#00FFC2]"><Download className="w-4 h-4" /></button>
                      <button onClick={() => delFile(f.id)} className="text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Updates */}
          <Panel className="space-y-3 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Post an update</h3>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-start">
              <TextInput value={upTitle} onChange={(e) => setUpTitle(e.target.value)} placeholder="Title (optional)" />
              <TextInput value={upBody} onChange={(e) => setUpBody(e.target.value)} placeholder="Update message…" />
              <GhostButton onClick={addUpdate}><Plus className="w-4 h-4" />Post</GhostButton>
            </div>
            {detail.updates.length > 0 && (
              <ul className="space-y-2 pt-2">
                {detail.updates.map((u) => {
                  const fromClient = u.author === "client";
                  return (
                    <li key={u.id} className={`flex items-start justify-between gap-2 rounded-lg px-3 py-2 border ${fromClient ? "bg-[#00FFC2]/5 border-[#00FFC2]/30" : "bg-white/[0.02] border-white/5"}`}>
                      <div className="min-w-0">
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${fromClient ? "text-[#00FFC2]" : "text-gray-500"}`}>
                          {fromClient ? "↩ Client reply" : "You"}
                        </span>
                        {u.title && <p className="text-sm font-semibold text-white">{u.title}</p>}
                        {u.body && <p className="text-sm text-gray-400">{u.body}</p>}
                      </div>
                      <button onClick={() => delUpdate(u)} className="text-gray-500 hover:text-red-400 shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    );
  }

  // list view
  return (
    <div>
      {toast && <div className="mb-4"><StatusToast status={toast} /></div>}
      <SectionHeader
        title="Client Portal"
        subtitle="Give each client a private, secure area for status, files, invoices & updates."
        action={<PrimaryButton onClick={openNew}><Plus className="w-4 h-4" />Add Client</PrimaryButton>}
      />

      {clients.length === 0 ? (
        <EmptyState label="No clients yet. Add your first client to give them a private portal." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((c) => (
            <Panel key={c.id} className="flex items-start justify-between gap-4">
              <div className="flex gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-[#00FFC2]/10 border border-[#00FFC2]/20 text-[#00FFC2] h-fit"><Users className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold font-space-grotesk truncate">{c.name}</h3>
                  <p className="text-[11px] text-[#00FFC2] font-mono truncate">{c.email}</p>
                  <p className="text-xs text-gray-400 mt-1 truncate">{c.project_title || "—"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">{c.status}</span>
                    <span className="text-[10px] font-mono text-gray-500">{c.progress}%</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <GhostButton onClick={() => setSelectedId(c.id)} title="Manage"><ExternalLink className="w-4 h-4" />Manage</GhostButton>
                <div className="flex gap-1.5">
                  <GhostButton onClick={() => sendLink(c)} title="Email portal link"><Send className="w-4 h-4" /></GhostButton>
                  <GhostButton onClick={() => openEdit(c)} title="Edit"><Pencil className="w-4 h-4" /></GhostButton>
                  <GhostButton onClick={() => removeClient(c)} title="Delete" className="hover:!border-red-500/50 hover:!text-red-400"><Trash2 className="w-4 h-4" /></GhostButton>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Client" : "Add Client"}>
        <form onSubmit={saveClient} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name"><TextInput required value={cForm.name || ""} onChange={(e) => setCForm({ ...cForm, name: e.target.value })} /></Field>
            <Field label="Email (sign-in address)"><TextInput type="email" required value={cForm.email || ""} onChange={(e) => setCForm({ ...cForm, email: e.target.value })} /></Field>
          </div>
          <Field label="Company"><TextInput value={cForm.company || ""} onChange={(e) => setCForm({ ...cForm, company: e.target.value })} /></Field>
          <Field label="Project title"><TextInput value={cForm.project_title || ""} onChange={(e) => setCForm({ ...cForm, project_title: e.target.value })} /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton onClick={() => setModalOpen(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit">{editing ? "Save" : "Create client"}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
