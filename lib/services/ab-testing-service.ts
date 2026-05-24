import { apiClient } from "./api-client";

export const ABTestingService = {
  async getCTR() {
    const fallbackData = { ctr: "16.80" };
    // Solved: Fix route discrepancy to match backend '/admin/analytics/ctr'
    return apiClient.get("/admin/analytics/ctr", fallbackData);
  },

  async getCTRByGroup() {
    const fallbackData = [
      { group_type: "VARIANT", ctr: "24.60" },
      { group_type: "CONTROL", ctr: "11.20" }
    ];
    // Solved: Fix route discrepancy to match backend '/admin/analytics/ctr/group'
    return apiClient.get("/admin/analytics/ctr/group", fallbackData);
  },

  async getABGroups() {
    const fallbackData = [
      { group_type: "VARIANT", total: "62400" },
      { group_type: "CONTROL", total: "62453" }
    ];
    // Solved: Fix route discrepancy to match backend '/admin/ab-testing'
    return apiClient.get("/admin/ab-testing", fallbackData);
  }
};
