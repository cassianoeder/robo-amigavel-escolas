'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setVisible(false);
  }

  function reject() {
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-[slideUp_0.4s_ease-out]"
      style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
    >
      <div className="max-w-4xl mx-auto bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center gap-5">
        {/* Icon + Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🍪</span>
            <h3 className="text-white font-semibold text-sm">Aviso de Cookies — LGPD</h3>
          </div>
          <p className="text-white/55 text-sm leading-relaxed">
            Este site utiliza <strong className="text-white/80">cookies essenciais</strong> para
            autenticação e funcionamento da plataforma (sessão de login via JWT).
            Não utilizamos cookies de rastreamento, publicidade ou analytics.
            Ao continuar, você concorda com nossa{' '}
            <Link href="/privacidade" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
              Política de Privacidade
            </Link>.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={reject}
            className="px-5 py-2.5 text-sm font-medium text-white/70 border border-white/15 hover:border-white/30 hover:text-white rounded-xl transition-all"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 text-sm font-semibold bg-[#1B3A6B] hover:bg-[#254d8c] text-white rounded-xl transition-all shadow-lg shadow-[#1B3A6B]/20"
          >
            Aceitar Cookies
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
