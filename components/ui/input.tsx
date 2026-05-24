import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, className = "", icon, ...props }: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-[#e2e8f0]/40 text-slate-800 text-sm font-medium px-4 py-3 rounded-xl border border-transparent transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#b3000d]/30 focus:ring-4 focus:ring-[#b3000d]/5 ${
            icon ? "pl-11" : ""
          } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}
