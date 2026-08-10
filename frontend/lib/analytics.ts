import { api } from "@/lib/api";

/**
 * Fire-and-forget visit tracking. De-duped per path per browser session so a
 * single page view is not counted multiple times on re-render/navigation back.
 */
export function trackVisit(path?: string): void {
  if (typeof window === "undefined") return;

  const p = path || window.location.pathname || "/";
  const key = `mrp_tracked:${p}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    /* sessionStorage unavailable (private mode) — still attempt the track */
  }

  const referrer = typeof document !== "undefined" ? document.referrer || undefined : undefined;
  api.analytics.track(p, referrer).catch(() => {
    /* analytics must never surface errors to the user */
  });
}
