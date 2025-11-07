const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const buildApiUrl = (path: string) => {
  if (!path.startsWith("/")) {
    throw new Error("API paths must start with a forward slash");
  }

  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${base}${path}`;
};

export const apiFetch = async <T = unknown>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(buildApiUrl(path), init);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(errorBody || `API request failed with status ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export type ApiResponse<T> = {
  data: T;
};


