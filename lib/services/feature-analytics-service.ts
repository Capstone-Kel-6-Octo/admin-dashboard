import { apiClient } from "./api-client";

export interface FeatureAnalyticsResponse {
  top_features: {
    id: number;
    feature_name: string;
    total_usage: string;
  }[];

  feature_usage: {
    feature_name: string;
    total_usage: string;
  }[];

  trend: {
    date: string;
    total: string;
  }[];
}

export const FeatureAnalyticsService = {
  async getAnalytics(): Promise<FeatureAnalyticsResponse> {
    const fallbackData: FeatureAnalyticsResponse = {
      top_features: [],
      feature_usage: [],
      trend: [],
    };

    return apiClient.get("/admin/feature-analytics", fallbackData);
  },
};
