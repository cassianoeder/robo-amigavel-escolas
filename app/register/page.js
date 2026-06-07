'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '../components/PasswordInput';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      // Após criar a conta, vai pro login
      router.push('/login?registered=1');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col font-['Outfit'] items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-white/60 mt-2">Crie seu robô assistente personalizado</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
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

          <PasswordInput
            label="Repetir Senha"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="space-y-5"
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1B3A6B] hover:bg-[#254d8c] text-white font-medium py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-8">
          Já tem uma conta? <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
