"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout as doLogout } from "@/lib/auth";

/** Guards an admin page: redirects to login when no valid token is present. */
export function useAuth() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setAuthenticated(true);
    setReady(true);

    // Re-check periodically so a long-open tab whose token expires gets bounced
    // to login BEFORE the user tries to save (avoids a dead-end 401 on write).
    const id = setInterval(() => {
      if (!isAuthenticated()) {
        setAuthenticated(false);
        router.replace("/admin/login?expired=1");
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [router]);

  return {
    ready,
    authenticated,
    logout: () => doLogout(true),
  };
}
