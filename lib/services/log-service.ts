import { apiClient, isMockMode } from "./api-client";

export interface AdminLog {
  id: string | number;
  name: string;
  action: string;
  description: string;
  created_at: string;
}

const LOCAL_STORAGE_KEY = "octo_admin_simulated_logs";

const getLocalLogs = (): AdminLog[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  
  const defaultLogs: AdminLog[] = [
    { id: "log-1", name: "Lead IT Administrator", action: "LOGIN", description: "Admin berhasil masuk ke dashboard utama.", created_at: new Date(Date.now() - 50000).toISOString() },
    { id: "log-2", name: "Lead IT Administrator", action: "TOGGLE_FEATURE", description: "Fitur 'Quick Transfer' berhasil diaktifkan.", created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { id: "log-3", name: "System Kernel", action: "DEPLOY_MODEL", description: "Model rekomendasi AI 'OCTO-AI v2' berhasil dideploy dengan akurasi 94.2%.", created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
    { id: "log-4", name: "Manager Product", action: "UPDATE_MODEL", description: "Mengubah parameter akurasi model v1.1.0.", created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString() }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultLogs));
  return defaultLogs;
};

export const LogService = {
  async getLogs(): Promise<AdminLog[]> {
    const fallbackData = getLocalLogs();
    // Sort local logs by date descending
    return apiClient.get("/admin/logs", fallbackData).then((logs: AdminLog[]) => {
      return logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    });
  },

  async createLog(action: string, description: string): Promise<any> {
    const fallbackResponse = {
      message: "Log created (Local)",
      data: {
        id: `log-${Date.now()}`,
        name: "Lead IT Administrator",
        action,
        description,
        created_at: new Date().toISOString()
      }
    };

    if (isMockMode()) {
      const logs = getLocalLogs();
      logs.unshift(fallbackResponse.data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
      return fallbackResponse;
    }

    try {
      const result = await apiClient.post("/admin/logs", { action, description });
      return result;
    } catch (e) {
      console.warn("[LogService] Gagal menyimpan audit log di server backend, menyimpan secara lokal.", e);
      // Fallback local save
      const logs = getLocalLogs();
      logs.unshift(fallbackResponse.data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
      return fallbackResponse;
    }
  }
};
