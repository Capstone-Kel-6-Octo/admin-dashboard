"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/sidebar";
import { Header } from "../components/layout/header";
import { LoginView } from "../components/views/login-view";
import { RegisterView } from "../components/views/register-view";
import { DashboardView } from "../components/views/dashboard-view";
import { UserAnalyticsView } from "../components/views/user-analytics-view";
import { PersonalizationView } from "../components/views/personalization-view";
import { FeaturesView } from "../components/views/features-view";
import { ModelsView } from "../components/views/models-view";
import { ConsentView } from "../components/views/consent-view";
import { LogsView } from "../components/views/logs-view";

interface UserProfile {
  name: string;
  email: string;
  jabatan?: string;
  departemen?: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<string>("login"); // login, register, dashboard, users, personalization, features

  // Avoid Next.js hydration issues by waiting until mounted on the client
  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("octo_admin_active_session");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView("dashboard");
    }
  }, []);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem("octo_admin_active_session", JSON.stringify(profile));
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("octo_admin_active_session");
    setView("login");
  };

  const handleRegisterSuccess = () => {
    setView("login");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <svg
          className="animate-spin h-8 w-8 text-[#b3000d]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  // Handle Authentication Views
  if (view === "login") {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setView("register")}
      />
    );
  }

  if (view === "register") {
    return (
      <RegisterView
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateToLogin={() => setView("login")}
      />
    );
  }

  // Compute page headers title
  const getHeaderTitle = () => {
    switch (view) {
      case "dashboard":
        return "Dashboard Overview";
      case "users":
        return "User Analytics";
      case "personalization":
        return "Personalization Analytics";
      case "features":
        return "Feature Analytics";
      case "models":
        return "Model Monitoring";
      case "consent":
        return "Consent Analytics";
      case "logs":
        return "Admin Action Logs";
      default:
        return "OCTO Mobile Admin";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-700">
      {/* Sidebar Layout */}
      <Sidebar
        currentView={view}
        onViewChange={(v) => setView(v)}
        onLogout={handleLogout}
        user={user || undefined}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Layout */}
        <Header
          title={getHeaderTitle()}
          onLogout={handleLogout}
          user={user || undefined}
        />

        {/* Scrollable Sub-View Content */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-6xl mx-auto pb-12">
            {view === "dashboard" && <DashboardView />}
            {view === "users" && <UserAnalyticsView />}
            {view === "personalization" && <PersonalizationView />}
            {view === "features" && <FeaturesView />}
            {view === "models" && <ModelsView />}
            {view === "consent" && <ConsentView />}
            {view === "logs" && <LogsView />}
          </div>
        </main>
      </div>
    </div>
  );
}
