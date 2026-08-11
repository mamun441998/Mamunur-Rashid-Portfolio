// Client-portal token handling — kept fully separate from the admin token.
import { decodeJwt } from "@/lib/auth";

export const PORTAL_TOKEN_KEY = "mrp_portal_token";

export function getPortalToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PORTAL_TOKEN_KEY);
}

export function setPortalToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PORTAL_TOKEN_KEY, token);
}

export function removePortalToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PORTAL_TOKEN_KEY);
}

/** True when a non-expired portal session token is present. */
export function isPortalAuthenticated(): boolean {
  const token = getPortalToken();
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) { removePortalToken(); return false; }
  if (typeof payload.exp === "number" && payload.exp <= Math.floor(Date.now() / 1000)) {
    removePortalToken();
    return false;
  }
  return true;
}

export function portalLogout(redirect = true): void {
  removePortalToken();
  if (redirect && typeof window !== "undefined") window.location.href = "/portal";
}
