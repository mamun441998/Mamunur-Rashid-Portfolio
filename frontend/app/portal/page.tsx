"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, ArrowLeft, Send } from "lucide-react";
import { api } from "@/lib/api";
import { isPortalAuthenticated } from "@/lib/portalAuth";

export default function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPortalAuthenticated()) router.replace("/portal/dashboard");
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.portal.requestLink(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <main data-theme="dark" className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text-primary)] flex items-center justify-center px-4 py-24 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] mb-6">
          <ArrowLeft size={14} /> Back to site
        </Link>

        <div className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-8 shadow-xl">
          <div className="flex items-center gap-2 text-[var(--color-accent)] mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-widest">Client Portal</span>
          </div>

          {sent ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              <h1 className="text-xl font-bold font-space-grotesk mb-2">Check your inbox</h1>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                If <span className="text-[var(--color-text-primary)]">{email}</span> belongs to a client, a secure sign-in link is on its way. It expires in 15 minutes.
              </p>
              <button onClick={() => { setSent(false); setEmail(""); }} className="mt-6 text-xs font-mono text-[var(--color-accent)] hover:underline">
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h1 className="text-2xl font-bold font-space-grotesk mb-1">Sign in to your portal</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">Enter your email and we&rsquo;ll send you a secure sign-in link — no password needed.</p>

              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono">{error}</div>}

              <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">Email</label>
              <div className="relative mb-5">
                <Mail className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] focus:border-[var(--color-accent)] text-[var(--color-text-primary)] text-sm focus:outline-none"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[var(--color-accent)] text-black font-semibold text-sm transition-transform hover:scale-[1.02] disabled:opacity-50">
                {loading ? "Sending…" : "Send me a secure link"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-[11px] text-[var(--color-text-muted)] font-mono mt-4">
          Access is invite-only. Ask Mamunur to set up your portal.
        </p>
      </motion.div>
    </main>
  );
}
