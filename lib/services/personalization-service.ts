import { apiClient } from "./api-client";

export const PersonalizationService = {
  async getAnalytics() {
    const fallbackData = {
      before_ctr: 0,
      after_ctr: 0,
      improvement: 0,
      summary: {
        group_a_users: 0,
        group_b_users: 0,
        total_events: 0,
      },
      groups: [],
      trend: [],
    };

    return apiClient.get("/admin/personalization", fallbackData);
  },
};
