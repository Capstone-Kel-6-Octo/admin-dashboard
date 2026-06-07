import { apiClient } from "./api-client";

export const UserAnalyticsService = {
  getAnalytics: async () => {
    return apiClient.get("/admin/user-analytics", {
      summary: {
        total_users: 0,
        active_users: 0,
        new_this_month: 0,
        churn_rate: 0,
      },
      segment_distribution: [],
      age_distribution: [],
    });
  },
};
