/**
 * Production API origin when `VITE_API_URL` is not set.
 */
export const DEFAULT_API_BASE_URL = 'https://server-production-1c6f5.up.railway.app';

/**
 * API base URL for `fetch` / axios.
 *
 * - If `VITE_API_URL` is set → use it (direct calls).
 * - In local dev (`import.meta.env.DEV`) with no `VITE_API_URL` → `''` so requests go to
 *   same-origin `/api/*` and Vite proxies to the Express server (see `vite.config.ts`).
 * - Production build without `VITE_API_URL` → {@link DEFAULT_API_BASE_URL}.
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.trim().replace(/\/$/, '');
  }
  if (import.meta.env.DEV) {
    return '';
  }
  return DEFAULT_API_BASE_URL.replace(/\/$/, '');
}

/** Build a full API path, e.g. `/api/auth/status`. */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
