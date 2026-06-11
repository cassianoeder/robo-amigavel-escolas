'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setUsers(data.users || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus })
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        ));
      }
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
    }
  };

  const promoteUser = async (userId) => {
    try {
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_admin: true } : user
        ));
      }
    } catch (err) {
      console.error('Erro ao promover usuário:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p>Carregando usuários...</p>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors">
            Novo Usuário
          </button>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/[0.04] border-b border-white/[0.08]">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-white/70">Email</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-white/70">Cargo</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-white/70">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-white/70">Data Cadastro</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-white/70">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                  <td className="py-4 px-6">
                    <div className="font-medium">{user.email}</div>
                    <div className="text-xs text-white/50">{user.robots?.length || 0} robô(s)</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.is_admin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {user.is_admin ? 'Administrador' : 'Usuário'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white/60">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      {!user.is_admin && (
                        <button 
                          onClick={() => promoteUser(user.id)}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded text-sm transition-colors"
                        >
                          Promover
                        </button>
                      )}
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          user.is_active 
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                      >
                        {user.is_active ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}