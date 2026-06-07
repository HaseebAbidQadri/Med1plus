/**
 * API base URL helper.
 *
 * In development (Vite dev server):
 *   VITE_API_URL is not set → API calls use relative paths like `/api/...`
 *   The Vite dev server proxy (vite.config.ts) forwards them to localhost:3000.
 *
 * In production (Vercel frontend + Railway backend):
 *   VITE_API_URL is set to the Railway backend URL (e.g. https://med1plus.railway.app)
 *   All API calls are prefixed with that URL to cross-origin correctly.
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? '';

/**
 * Builds a full API URL from a relative path like `/api/medicines`
 * Works in both development and production automatically.
 */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
