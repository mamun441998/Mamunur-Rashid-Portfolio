"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SiteSetting } from "@/lib/types";

/** Public site settings, fetched once and cached. Never throws to the UI. */
export function useSettings() {
  return useQuery<SiteSetting>({
    queryKey: ["site-settings"],
    queryFn: () => api.settings.get(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
