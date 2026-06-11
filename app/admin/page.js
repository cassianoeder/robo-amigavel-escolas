'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar usuários
        const usersResponse = await fetch('/api/admin/users');
        const usersData = await usersResponse.json();
        
        // Buscar robôs
        const robotsResponse = await fetch('/api/admin/robots');
        const robotsData = await robotsResponse.json();
        
        if (usersData.error) {
          throw new Error(usersData.error);
        }
        
        if (robotsData.error) {
          throw new Error(robotsData.error);
        }
        
        setUsers(usersData.users || []);
        setRobots(robotsData.robots || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center bg-red-500/10 border border-red-500/20 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-red-400 mb-2">Erro</h2>
          <p className="text-red-300">{error}</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a12]/80">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#brand-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <defs>
              <linearGradient id="brand-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa"/>
                <stop offset="100%" stopColor="#34d399"/>
              </linearGradient>
            </defs>
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          <span className="font-bold text-xl tracking-wide">Admin Robô Educacional</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/admin" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/users" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            Usuários
          </Link>
          <Link href="/admin/robots" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            Robôs
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">Total de Usuários</h2>
            <p className="text-3xl font-bold text-emerald-400">{users.length}</p>
          </div>
          
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">Robôs Criados</h2>
            <p className="text-3xl font-bold text-blue-400">{robots.length}</p>
          </div>
          
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">Administradores</h2>
            <p className="text-3xl font-bold text-purple-400">{users.filter(u => u.is_admin).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Usuários */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Usuários Recentes</h2>
            <div className="space-y-3">
              {users.slice(0, 5).map(user => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-lg">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-white/50">{new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.is_admin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {user.is_admin ? 'Admin' : 'Usuário'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/users" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
              Ver todos os usuários →
            </Link>
          </div>

          {/* Lista de Robôs */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Robôs Recentes</h2>
            <div className="space-y-3">
              {robots.slice(0, 5).map(robot => (
                <div key={robot.id} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-lg">
                  <div>
                    <p className="font-medium">{robot.name}</p>
                    <p className="text-sm text-white/50">Por {robot.user_email}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-300">
                    {robot.theme}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/admin/robots" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
              Ver todos os robôs →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}