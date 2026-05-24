import { apiClient } from "./api-client";

export interface UserConsent {
  id: string | number;
  name: string;
  email: string;
  consent_given: boolean;
  created_at: string;
}

export interface ConsentSummary {
  consent_given: boolean;
  total: string | number;
}

export interface ConsentTrend {
  date: string;
  consent_given: boolean;
  total: string | number;
}

export const ConsentService = {
  async getConsents(): Promise<UserConsent[]> {
    const fallbackData: UserConsent[] = [
      { id: 1, name: "Budi Santoso", email: "budi.santoso@gmail.com", consent_given: true, created_at: "2026-05-24T10:15:30Z" },
      { id: 2, name: "Siti Rahma", email: "siti.rahma@yahoo.com", consent_given: true, created_at: "2026-05-24T09:40:12Z" },
      { id: 3, name: "Andi Wijaya", email: "andi.wijaya@gmail.com", consent_given: false, created_at: "2026-05-24T08:12:45Z" },
      { id: 4, name: "Dewi Lestari", email: "dewi.lestari@outlook.com", consent_given: true, created_at: "2026-05-23T16:22:10Z" },
      { id: 5, name: "Eko Prasetyo", email: "eko.prasetyo@cimb.co.id", consent_given: true, created_at: "2026-05-23T14:05:55Z" },
      { id: 6, name: "Farida Utami", email: "farida.utami@gmail.com", consent_given: false, created_at: "2026-05-23T11:30:18Z" }
    ];
    return apiClient.get("/admin/consents", fallbackData);
  },

  async getConsentSummary(): Promise<ConsentSummary[]> {
    const fallbackData: ConsentSummary[] = [
      { consent_given: true, total: "105420" },
      { consent_given: false, total: "19433" }
    ];
    return apiClient.get("/admin/consents/summary", fallbackData);
  },

  async getConsentTrend(): Promise<ConsentTrend[]> {
    const fallbackData: ConsentTrend[] = [
      { date: "2026-05-18", consent_given: true, total: 14500 },
      { date: "2026-05-18", consent_given: false, total: 2900 },
      { date: "2026-05-19", consent_given: true, total: 15100 },
      { date: "2026-05-19", consent_given: false, total: 2850 },
      { date: "2026-05-20", consent_given: true, total: 15900 },
      { date: "2026-05-20", consent_given: false, total: 2980 },
      { date: "2026-05-21", consent_given: true, total: 16200 },
      { date: "2026-05-21", consent_given: false, total: 3100 },
      { date: "2026-05-22", consent_given: true, total: 17400 },
      { date: "2026-05-22", consent_given: false, total: 3010 },
      { date: "2026-05-23", consent_given: true, total: 18200 },
      { date: "2026-05-23", consent_given: false, total: 3200 },
      { date: "2026-05-24", consent_given: true, total: 19500 },
      { date: "2026-05-24", consent_given: false, total: 3400 }
    ];
    return apiClient.get("/admin/consents/trend", fallbackData);
  }
};
