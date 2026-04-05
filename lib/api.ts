import { getApiUrl } from "@/lib/utils";

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("lf_access_token", token);
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("lf_access_token");
  }
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("lf_access_token");
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${getApiUrl()}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access_token) {
      setAccessToken(data.access_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${getApiUrl()}${endpoint}`, {
    ...rest,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && token) {
    const refreshed = await refreshToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getAccessToken()}`;
      res = await fetch(`${getApiUrl()}${endpoint}`, {
        ...rest,
        headers,
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "GET" }),

  post: <T = unknown>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, { method: "POST", body }),

  put: <T = unknown>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, { method: "PUT", body }),

  delete: <T = unknown>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "DELETE" }),
};
