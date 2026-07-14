/**
 * Centralised HTTP client for the external admin API.
 *
 * Base URL: process.env.NEXT_PUBLIC_API_URL + "/api/admin"
 * All paths passed to the helpers must be relative (e.g. "/tools", "/auth/login").
 * The Authorization header is attached automatically when a token is provided.
 */

const getBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    // Provide a clear runtime error instead of a cryptic network failure.
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. " +
      "Set it to your Railway API base URL, e.g. https://omni-shift-ai-api-production.up.railway.app",
    );
  }
  // Strip any trailing slash before appending the fixed suffix.
  return apiUrl.replace(/\/$/, "") + "/api/admin";
};

type FetchOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function apiRequest<T = unknown>(
  path: string,
  { method = "GET", body, token }: FetchOptions = {},
): Promise<T> {
  const url = getBaseUrl() + path;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Disable Next.js static caching for admin API calls
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (errorBody as { error?: string }).error ??
        `API request failed: ${res.status} ${res.statusText}`,
    );
  }

  return res.json() as Promise<T>;
}
