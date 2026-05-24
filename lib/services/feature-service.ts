import { apiClient } from "./api-client";

export const FeatureService = {
  async getFeaturesUsage() {
    const fallbackData = [
      { feature_name: "Transfer", total_usage: "85420" },
      { feature_name: "Top Up", total_usage: "72340" },
      { feature_name: "Investasi", total_usage: "54670" },
      { feature_name: "Pembayaran", total_usage: "48230" },
      { feature_name: "Payroll", total_usage: "32878" }
    ];
    return apiClient.get("/admin/analytics/features", fallbackData);
  },

  async getFeatureDetails() {
    const fallbackData = [
      { feature_name: "Transfer", interaction_type: "CLICK", total: "85420" },
      { feature_name: "Top Up", interaction_type: "CLICK", total: "72340" }
    ];
    return apiClient.get("/admin/analytics/features/detail", fallbackData);
  },

  async getFeatureTrend() {
    const fallbackData = [
      { date: "2026-05-18", feature_id: 1, total: 1200 },
      { date: "2026-05-19", feature_id: 1, total: 1450 }
    ];
    return apiClient.get("/admin/analytics/features/trend", fallbackData);
  },

  async getTopFeatures() {
    const fallbackData = [
      { feature_name: "Transfer", total: "85420" },
      { feature_name: "Top Up", total: "72340" },
      { feature_name: "Investasi", total: "54670" }
    ];
    // Solved: Fix route discrepancy to match backend '/admin/analytics/top-features'
    return apiClient.get("/admin/analytics/top-features", fallbackData);
  }
};
