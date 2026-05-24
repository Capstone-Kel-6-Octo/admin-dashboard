"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AuthService } from "../../lib/services";

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export function RegisterView({ onRegisterSuccess, onNavigateToLogin }: RegisterViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [departemen, setDepartemen] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !jabatan || !departemen || !password) {
      setError("Semua kolom data wajib diisi!");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter!");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Attempt dynamic live API registration on server
      await AuthService.register(name, email, password);
      setIsLoading(false);
      setSuccess("Pendaftaran berhasil! Mengarahkan Anda ke halaman login...");
      
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (apiError: any) {
      // 2. Client-side fallback if server is down or database handles role mapping differently
      console.warn("Backend register failed, trying local mock fallback...", apiError.message);

      const storedUsersRaw = localStorage.getItem("octo_admin_users");
      const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const exists = storedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (exists || email.toLowerCase() === "admin@octo.com") {
        setIsLoading(false);
        setError("Email sudah terdaftar! Gunakan email lain.");
        return;
      }

      // Add new admin user locally
      const newAdmin = {
        name,
        email,
        jabatan,
        departemen,
        password,
      };

      storedUsers.push(newAdmin);
      localStorage.setItem("octo_admin_users", JSON.stringify(storedUsers));

      setIsLoading(false);
      setSuccess("Pendaftaran berhasil (Local)! Mengarahkan Anda ke halaman login...");

      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans select-none">
      {/* Left branding panel - wider (45%) and more spacious */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-b from-[#4d0004] via-[#2d0002] to-[#140001] text-white flex-col justify-between p-20 relative overflow-hidden shrink-0 border-r border-red-950/20">
        {/* Glow lights backdrop */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-red-800/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Branding Logo - scaled up */}
        <div className="flex flex-col items-start gap-2.5 z-10">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4.5xl font-black tracking-tighter">OCTO</span>
            <span className="text-2xl font-light tracking-wide text-red-200">Mobile</span>
          </div>
          <span className="text-xs uppercase font-bold tracking-widest bg-red-950/60 border border-red-900/40 px-3 py-1 rounded-lg text-red-400">
            Admin Panel
          </span>
        </div>

        {/* Branding Slogan - scaled up */}
        <div className="space-y-6 max-w-md z-10 my-auto">
          <p className="text-sm uppercase font-bold text-red-400 tracking-widest">
            Buat Akun Admin Baru
          </p>
          <h2 className="text-5xl font-black tracking-tight leading-tight text-white">
            OCTO Admin
          </h2>
          <p className="text-base font-medium text-slate-300 leading-relaxed">
            Daftarkan akun untuk mulai mengelola personalisasi dan analytics OCTO Mobile.
          </p>
        </div>

        {/* Brand footer */}
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest z-10">
          BY CIMB NIAGA
        </div>
      </div>

      {/* Right form panel - scaled up from max-w-md to max-w-xl */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white overflow-y-auto">
        <div className="w-full max-w-lg space-y-8 my-8">
          {/* Header - scaled up */}
          <div className="space-y-3.5 text-center lg:text-left">
            <h2 className="text-3.5xl lg:text-4xl font-black text-slate-800 tracking-tight leading-none">
              Register Akun <span className="text-[#b3000d]">Admin</span>
            </h2>
            <p className="text-sm lg:text-base font-semibold text-slate-400 leading-normal">
              Lengkapi informasi di bawah ini untuk membuat akun admin baru.
            </p>
          </div>

          {/* Form - scaled up */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-xs font-bold text-[#b3000d] animate-in fade-in slide-in-from-top-1 duration-150">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs font-bold text-emerald-600 animate-in fade-in slide-in-from-top-1 duration-150">
                {success}
              </div>
            )}

            <div className="space-y-5">
              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-4 px-5 rounded-2xl text-base"
              />

              <Input
                label="Email"
                type="email"
                placeholder="Masukkan email resmi Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="py-4 px-5 rounded-2xl text-base"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Jabatan"
                  type="text"
                  placeholder="Contoh: Manager"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="py-4 px-5 rounded-2xl text-base"
                />

                <Input
                  label="Departemen"
                  type="text"
                  placeholder="Contoh: Marketing"
                  value={departemen}
                  onChange={(e) => setDepartemen(e.target.value)}
                  className="py-4 px-5 rounded-2xl text-base"
                />
              </div>

              <Input
                label="Kata Sandi"
                type="password"
                placeholder="Masukkan kata sandi baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-4 px-5 rounded-2xl text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-md hover:shadow-[#b3000d]/10 hover:shadow-xl transition-all mt-4"
              isLoading={isLoading}
            >
              Daftar
            </Button>

            <div className="text-center text-sm font-semibold text-slate-400 mt-6 select-none">
              Sudah memiliki akun?{" "}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-[#b3000d] hover:underline font-bold cursor-pointer transition-all hover:scale-105"
              >
                Login disini
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
