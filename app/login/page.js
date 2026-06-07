'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '../components/PasswordInput';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      router.push('/robot.html');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-['Outfit'] items-center justify-center p-6 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 group-hover:border-white/30 transition-colors">
          ←
        </span>
        <span>Voltar para home</span>
      </Link>

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4 flex justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#login-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <defs>
                <linearGradient id="login-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#60a5fa"/>
                  <stop offset="100%" stopColor="#34d399"/>
                </linearGradient>
              </defs>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="text-white/60 mt-2">Acesse sua conta para configurar seu robô</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <PasswordInput
            label="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="space-y-5"
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1B3A6B] hover:bg-[#254d8c] text-white font-medium py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-8">
          Ainda não tem conta? <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Criar agora</Link>
        </p>
      </div>
    </div>
  );
}
