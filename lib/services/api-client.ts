/**
 * Core API Client for OCTO Mobile Admin Dashboard.
 * Handles base URL, auth headers, token management, and simulated mock fallback detection.
 */

export const API_BASE_URL = "http://localhost:3000";

export const getHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("octo_admin_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token && token !== "mock-token-secret") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const isMockMode = (): boolean => {
  if (typeof window === "undefined") return true;
  const token = localStorage.getItem("octo_admin_token");
  return !token || token === "mock-token-secret";
};

export const apiClient = {
  get: async <T>(endpoint: string, fallback: T): Promise<T> => {
    if (isMockMode()) return fallback;
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getHeaders(),
      });

      const data = await response
        .clone()
        .json()
        .catch(() => null);

      console.log("================================");
      console.log("ENDPOINT:", endpoint);
      console.log("STATUS:", response.status);
      console.log("DATA:", data);
      console.log("================================");

      if (!response.ok) {
        console.warn(`[API Client] GET ${endpoint} returned status ${response.status}. Falling back to simulation data.`);
        return fallback;
      }
      return await response.json();
    } catch (e) {
      console.warn(`[API Client] Network failure GET ${endpoint}. Falling back to simulation data.`, e);
      return fallback;
    }
  },

  post: async <T>(endpoint: string, body: any, fallback?: T): Promise<any> => {
    // If fallback is provided and we are in mock mode, return fallback
    if (isMockMode()) {
      console.log("MOCK MODE:", endpoint);
      return fallback;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (e: any) {
      if (isMockMode() || e.message.includes("Failed to fetch") || e.message.includes("Koneksi")) {
        if (fallback !== undefined) {
          console.warn(`[API Client] POST ${endpoint} failed. Using fallback mock response.`);
          return fallback;
        }
      }
      throw e;
    }
  },

  put: async <T>(endpoint: string, body: any, fallback?: T): Promise<any> => {
    if (isMockMode() && fallback !== undefined) return fallback;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (e: any) {
      if (isMockMode() || e.message.includes("Failed to fetch") || e.message.includes("Koneksi")) {
        if (fallback !== undefined) {
          console.warn(`[API Client] PUT ${endpoint} failed. Using fallback mock response.`);
          return fallback;
        }
      }
      throw e;
    }
  },
};
