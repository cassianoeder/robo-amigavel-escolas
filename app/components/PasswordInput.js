"use client";

import { useState } from 'react';

export default function PasswordInput({ label, value, onChange, placeholder, className = "" }) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white/80 mb-1.5">{label}</label>
      <div className="relative">
        <input 
          type={showPassword ? "text" : "password"}
          required
          value={value}
          onChange={onChange}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors focus:outline-none"
          title={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
}