"use client";

import React, { useState } from "react";
import { Search, Bell, User, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  title: string;
  onLogout: () => void;
  user?: {
    name: string;
    email: string;
    jabatan?: string;
    departemen?: string;
  };
}

export function Header({ title, onLogout, user }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, text: "A/B Test 'Promo Banner' increased CTR by +12%", time: "5m ago" },
    { id: 2, text: "New admin account registered: Jane Doe", time: "1h ago" },
    { id: 3, text: "Weekly active users crossed 64,000 threshold", time: "3h ago" },
  ];

  return (
    <header className="bg-white border-b border-slate-100 h-16 px-8 flex items-center justify-between select-none shrink-0 relative">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
          {title}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-50 text-slate-700 text-xs px-4 py-2 pl-9 rounded-xl border border-slate-100 transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#b3000d]/5 focus:border-[#b3000d]/20"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all duration-150 cursor-pointer relative"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b3000d] border border-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 pb-2 border-b border-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-[#b3000d] font-bold cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-60 overflow-y-auto mt-2">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50/50 last:border-b-0 cursor-pointer transition-colors duration-150">
                    <p className="text-xs font-semibold text-slate-600 leading-snug">{notif.text}</p>
                    <span className="text-[9px] font-bold text-slate-400 mt-1 block">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile circle dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full bg-[#b3000d] text-white flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-95 shadow-sm overflow-hidden"
          >
            <User className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Profile Card Header */}
              <div className="px-4 pb-3 border-b border-slate-50">
                <h4 className="text-xs font-bold text-slate-800 leading-none truncate">
                  {user?.name || "Admin User"}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold truncate mt-1 leading-none">
                  {user?.email || "admin@octo.com"}
                </p>
                {user?.jabatan && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-red-50 text-[#b3000d] text-[9px] font-bold rounded-lg uppercase tracking-wide">
                    {user.jabatan}
                  </span>
                )}
              </div>

              {/* Profile Menu Items */}
              <div className="mt-2.5 space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert("Settings feature is coming soon!");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-semibold tracking-wide transition-colors duration-150 text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  Settings
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 hover:text-red-600 text-slate-500 text-xs font-semibold tracking-wide transition-colors duration-150 text-left cursor-pointer border-t border-slate-50/50 mt-1"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
