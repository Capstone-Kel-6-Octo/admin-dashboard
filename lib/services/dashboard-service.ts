import { apiClient } from "./api-client";

export interface DashboardResponse {
  summary: {
    total_users: number;
    active_users: number;
    feature_clicks: number;
    ctr: number;
  };
  engagement_trend: {
    label: string;
    value: number;
  }[];
}

export const DashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    return apiClient.get("/admin/dashboard", {
      summary: {
        total_users: 0,
        active_users: 0,
        feature_clicks: 0,
        ctr: 0,
      },
      engagement_trend: [],
    });
  },
};
