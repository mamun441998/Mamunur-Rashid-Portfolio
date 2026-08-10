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
  }, [router]);

  return {
    ready,
    authenticated,
    logout: () => doLogout(true),
  };
}
