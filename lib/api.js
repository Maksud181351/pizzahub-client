import { API_URL } from "@/lib/constants";

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

let cached = { token: null, exp: 0 };
export const clearToken = () => (cached = { token: null, exp: 0 });

/** Gets a JWT from Better Auth (needs the session cookie) and caches it for 10 minutes */
async function getToken(force = false) {
  if (!force && cached.token && Date.now() < cached.exp) return cached.token;
  const res = await fetch("/api/auth/token", { credentials: "include", cache: "no-store" });
  if (!res.ok) return null;
  const { token } = await res.json();
  cached = { token, exp: Date.now() + 10 * 60 * 1000 };
  return token;
}

/** fetch wrapper for the Express API. Adds the Bearer token and turns errors into ApiError. */
export async function api(path, { method = "GET", body, auth = true } = {}, retried = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getToken(retried);
    if (!token) throw new ApiError("Please sign in to continue", 401);
    headers.Authorization = `Bearer ${token}`;
  }
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection and try again", 0);
  }
  if (res.status === 401 && auth && !retried) return api(path, { method, body, auth }, true); // token may have expired
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || "Request failed", res.status, data.code);
  return data;
}

/** Upload one image through the Next.js route (ImgBB key stays on the server) */
export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || "Image upload failed", res.status);
  return data.url;
}
