"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Layers,
  LogOut,
  Cpu,
  FileCheck,
  Terminal,
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  user?: {
    name: string;
    email: string;
    jabatan?: string;
    departemen?: string;
  };
}

export function Sidebar({ currentView, onViewChange, onLogout, user }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Analytics", icon: Users },
    { id: "personalization", label: "Personalization", icon: Sparkles },
    { id: "features", label: "Features", icon: Layers },
    { id: "models", label: "Model Monitoring", icon: Cpu },
    { id: "consent", label: "Consent Analytics", icon: FileCheck },
    { id: "logs", label: "Admin Logs", icon: Terminal },
  ];

  const getInitials = (name: string) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3.5 border-b border-slate-50">
        <div className="w-10 h-10 rounded-full bg-[#b3000d] flex items-center justify-center text-white font-black text-xl shadow-[0_4px_12px_rgba(179,0,13,0.2)]">
          O
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
            OCTO Mobile
          </h1>
          <p className="text-[10px] font-bold text-slate-400">Admin Panel</p>
        </div>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#b3000d] text-white shadow-[0_4px_16px_-4px_rgba(179,0,13,0.35)] -translate-y-[0.5px]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Profile & Logout Section */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex flex-col gap-2">
        <div className="flex items-center gap-3.5 p-2 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-red-100 text-[#b3000d] flex items-center justify-center font-bold text-xs shrink-0 select-none uppercase shadow-sm">
            {getInitials(user?.name || "Admin User")}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[11px] font-bold text-slate-800 truncate leading-snug">
              {user?.name || "Admin User"}
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-0.5">
              {user?.email || "admin@octo.com"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-100 hover:text-red-600 text-slate-500 text-[11px] font-bold transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
