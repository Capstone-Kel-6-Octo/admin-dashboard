import { apiClient, isMockMode } from "./api-client";

export interface MLModel {
  id: string | number;
  model_name: string;
  version: string;
  accuracy: string | number;
  status: "ACTIVE" | "INACTIVE" | "TRAINING";
  last_run: string;
}

const LOCAL_STORAGE_KEY = "octo_admin_simulated_models";

const getLocalModels = (): MLModel[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const defaultModels: MLModel[] = [
    { id: "mod-1", model_name: "OCTO-AI v2", version: "2.1.0", accuracy: 94.2, status: "ACTIVE", last_run: new Date(Date.now() - 360000).toISOString() },
    { id: "mod-2", model_name: "K-Means Cluster Classifier", version: "1.4.2", accuracy: 89.6, status: "ACTIVE", last_run: new Date(Date.now() - 2 * 360000).toISOString() },
    { id: "mod-3", model_name: "CTR Predictor Core", version: "1.0.8", accuracy: 91.5, status: "TRAINING", last_run: new Date().toISOString() },
    { id: "mod-4", model_name: "Baseline Random Forest", version: "0.9.0", accuracy: 78.4, status: "INACTIVE", last_run: new Date(Date.now() - 5 * 24 * 360000).toISOString() }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultModels));
  return defaultModels;
};

export const ModelService = {
  async getModels(): Promise<MLModel[]> {
    const fallbackData = getLocalModels();
    return apiClient.get("/admin/models", fallbackData).then((models: MLModel[]) => {
      // Clean and normalize status types if coming from backend as lowercase
      return models.map(m => ({
        ...m,
        status: (m.status || "ACTIVE").toUpperCase() as any
      }));
    });
  },

  async createModel(model_name: string, version: string, accuracy: number, status: string): Promise<any> {
    const newModel: MLModel = {
      id: `mod-${Date.now()}`,
      model_name,
      version,
      accuracy,
      status: status.toUpperCase() as any,
      last_run: new Date().toISOString()
    };

    const fallbackResponse = {
      message: "Model added (Local)",
      data: newModel
    };

    if (isMockMode()) {
      const models = getLocalModels();
      models.unshift(newModel);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(models));
      return fallbackResponse;
    }

    try {
      const result = await apiClient.post("/admin/models", { model_name, version, accuracy, status });
      return result;
    } catch (e) {
      console.warn("[ModelService] Gagal menambahkan model ke server backend, menggunakan penyimpanan lokal.", e);
      const models = getLocalModels();
      models.unshift(newModel);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(models));
      return fallbackResponse;
    }
  },

  async updateModel(id: string | number, accuracy: number, status: string): Promise<any> {
    const fallbackResponse = {
      message: "Model updated (Local)",
      data: {
        id,
        accuracy,
        status: status.toUpperCase() as any,
        last_run: new Date().toISOString()
      }
    };

    if (isMockMode()) {
      const models = getLocalModels();
      const idx = models.findIndex(m => String(m.id) === String(id));
      if (idx !== -1) {
        models[idx].accuracy = accuracy;
        models[idx].status = status.toUpperCase() as any;
        models[idx].last_run = new Date().toISOString();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(models));
      }
      return fallbackResponse;
    }

    try {
      const result = await apiClient.put(`/admin/models/${id}`, { accuracy, status });
      return result;
    } catch (e) {
      console.warn(`[ModelService] Gagal memperbarui model ${id} di backend, menggunakan penyimpanan lokal.`, e);
      const models = getLocalModels();
      const idx = models.findIndex(m => String(m.id) === String(id));
      if (idx !== -1) {
        models[idx].accuracy = accuracy;
        models[idx].status = status.toUpperCase() as any;
        models[idx].last_run = new Date().toISOString();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(models));
      }
      return fallbackResponse;
    }
  }
};
