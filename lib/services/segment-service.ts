import { apiClient } from "./api-client";

export const SegmentService = {
  async getPersonaDistribution() {
    const fallbackData = [
      { persona_label: "REGULER", total: "64923" },
      { persona_label: "PENGUSAHA", total: "32878" },
      { persona_label: "PRIORITAS", total: "27052" }
    ];
    return apiClient.get("/admin/analytics/segments", fallbackData);
  },

  async getClusterDistribution() {
    const fallbackData = [
      { cluster_label: "TRANSFER_HEAVY", total: "45200" },
      { cluster_label: "INVESTOR_SAVER", total: "32800" },
      { cluster_label: "LOW_ACTIVITY", total: "26853" },
      { cluster_label: "BILL_PAYER", total: "20000" }
    ];
    return apiClient.get("/admin/analytics/clusters", fallbackData);
  },

  async getSegmentTrend() {
    const fallbackData = [
      { date: "2026-05-18", REGULER: 64000, PENGUSAHA: 32000, PRIORITAS: 26800 },
      { date: "2026-05-24", REGULER: 64923, PENGUSAHA: 32878, PRIORITAS: 27052 }
    ];
    return apiClient.get("/admin/analytics/segments/trend", fallbackData);
  },

  async getClusterTrend() {
    const fallbackData = [
      { date: "2026-05-18", TRANSFER_HEAVY: 44000, INVESTOR_SAVER: 32000, LOW_ACTIVITY: 26000, BILL_PAYER: 19500 },
      { date: "2026-05-24", TRANSFER_HEAVY: 45200, INVESTOR_SAVER: 32800, LOW_ACTIVITY: 26853, BILL_PAYER: 20000 }
    ];
    return apiClient.get("/admin/analytics/clusters/trend", fallbackData);
  }
};
