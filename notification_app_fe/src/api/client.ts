import { Log } from "../utils/logger";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api/v1";

export function getSocketUrl() {
  return import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
}

function getAuthHeader() {
  const token = localStorage.getItem("accessToken");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const method = options.method || "GET";
  await Log("frontend", "info", "api", `${method} ${path}`);
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.message || "Request failed";
      throw new Error(message);
    }

    return data as T;
  } catch (err) {
    await Log("frontend", "error", "api", (err as Error).message);
    throw err;
  }
}
