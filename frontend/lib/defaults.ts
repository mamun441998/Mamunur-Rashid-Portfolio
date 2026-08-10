import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants";
import type { SiteSetting } from "@/lib/types";

/** The values currently hard-coded across the frontend. Used to pre-fill empty
 *  CMS fields (so no box shows blank) and as live fallbacks on the public site. */
export const SETTINGS_DEFAULTS: Partial<SiteSetting> = {
  full_name: SITE_CONFIG.name,
  role_title: SITE_CONFIG.roles?.[0] || "",
  hero_tagline: SITE_CONFIG.tagline,
  email: SITE_CONFIG.email,
  phone: SITE_CONFIG.phone,
  location: SITE_CONFIG.location,
  github_url: SOCIAL_LINKS.github,
  linkedin_url: SOCIAL_LINKS.linkedin,
  facebook_url: SOCIAL_LINKS.facebook,
};

/** Fill any empty string fields of a settings object with the frontend defaults. */
export function withDefaults<T extends Partial<SiteSetting>>(settings: T): T {
  const merged: any = { ...settings };
  for (const [key, val] of Object.entries(SETTINGS_DEFAULTS)) {
    const current = merged[key];
    if (current === undefined || current === null || String(current).trim() === "") {
      merged[key] = val;
    }
  }
  return merged;
}
