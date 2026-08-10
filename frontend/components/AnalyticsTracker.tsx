"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisit } from "@/lib/analytics";

/** Records a public page visit on route change. Skips the admin area. */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return;
    trackVisit(pathname);
  }, [pathname]);

  return null;
}
