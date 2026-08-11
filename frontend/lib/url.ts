/**
 * Normalize a user-entered URL into a safe absolute href.
 * "www.freedomwithdxn.com" or "freedomwithdxn.com" -> "https://www.freedomwithdxn.com"
 * so links open the external site instead of being treated as a relative path
 * on the portfolio domain. Already-absolute URLs and mailto/tel are left as-is.
 */
export function externalHref(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^(https?:)?\/\//i.test(trimmed)) {
    // protocol-relative "//host" -> force https
    return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
  }
  if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}
