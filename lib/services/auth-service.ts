import { API_BASE_URL } from "./api-client";

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Gagal masuk");
      }

      if (data.token) {
        if (data.user.role !== "admin") {
          throw new Error("Akses ditolak: Akun Anda belum memiliki role 'admin' di database PostgreSQL!");
        }

        localStorage.setItem("octo_admin_token", data.token);
        localStorage.setItem("octo_admin_active_session", JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          jabatan: "Lead IT Administrator",
          departemen: "IT & Personalization Core",
          role: data.user.role,
        }));
      }
      return data;
    } catch (e: any) {
      throw new Error(e.message || "Koneksi ke backend gagal");
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Gagal mendaftar");
      }
      return data;
    } catch (e: any) {
      throw new Error(e.message || "Koneksi ke backend gagal");
    }
  }
};
