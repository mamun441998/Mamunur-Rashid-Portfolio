"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";
import { setPortalToken } from "@/lib/portalAuth";

export default function PortalVerify() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setError("No sign-in token found in the link."); return; }
    let done = false;
    api.portal.verify(token)
      .then((data) => {
        if (done) return;
        if (!data.access_token) throw new Error("No token returned.");
        setPortalToken(data.access_token);
        router.replace("/portal/dashboard");
      })
      .catch((err) => { if (!done) setError(err?.message || "This link is invalid or has expired."); });
    return () => { done = true; };
  }, [router]);

  return (
    <main data-theme="dark" className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text-primary)] flex items-center justify-center px-4 select-none">
      {error ? (
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-bold font-space-grotesk mb-2">Sign-in link problem</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">{error}</p>
          <Link href="/portal" className="inline-block px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-black text-sm font-semibold">
            Request a new link
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin mx-auto mb-4" />
          <p className="text-sm font-mono text-[var(--color-text-secondary)]">Signing you in securely…</p>
        </div>
      )}
    </main>
  );
}
