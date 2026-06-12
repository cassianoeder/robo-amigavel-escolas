'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SimpleAdmin() {
  const [user, setUser] = useState(null);
  const [usersWithRobots, setUsersWithRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRobotConfig, setShowRobotConfig] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsersWithRobots(usersData.users || []);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    if (!confirm(`Deseja realmente ${targetUser.is_active ? 'bloquear' : 'desbloquear'} o usuário ${targetUser.email}?`)) return;
    setProcessingId(targetUser.id);
    try {
      await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !targetUser.is_active })
      });
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert('Erro ao alterar status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleAdmin = async (targetUser) => {
    if (!confirm(`Deseja realmente ${targetUser.is_admin ? 'remover o cargo de admin' : 'promover a admin'} o usuário ${targetUser.email}?`)) return;
    setProcessingId(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_admin: !targetUser.is_admin })
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Erro ao alterar admin.');
      }
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert('Erro ao alterar admin.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    const isSure = window.confirm(`CUIDADO: Você está prestes a EXCLUIR DEFINITIVAMENTE o usuário ${targetUser.email} e todos os seus robôs. Deseja continuar?`);
    if (!isSure) return;
    
    setProcessingId(targetUser.id);
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Erro ao excluir usuário.');
      }
      await fetchUsers();
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir usuário.');
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Verificar se é admin através do cookie/token
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        // Permitir acesso para usuários admin
        if (data.authenticated && data.isAdmin) {
          setUser({ ...data.user, isAdmin: true });
          
          // Buscar usuários reais do banco
          await fetchUsers();
        }
      } catch (error) {
        console.error('Erro ao verificar admin:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center bg-red-500/10 border border-red-500/20 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Acesso Negado</h2>
          <p className="text-white/60 mb-6">
            Você precisa fazer login como administrador para acessar esta área.
          </p>
          <p className="text-white/60 mb-6 text-sm">
            Dica: Se você é o administrador, faça logout e login novamente para atualizar suas permissões.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">✅ Painel Administrativo</h1>
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Bem-vindo, {user.email}!</h2>
          <p className="text-white/80">Acesso administrativo confirmado</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Total de Usuários</h3>
            <p className="text-3xl font-bold text-emerald-400">{usersWithRobots.length}</p>
          </div>
          
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Administradores</h3>
            <p className="text-3xl font-bold text-purple-400">{usersWithRobots.filter(u => u.is_admin).length}</p>
          </div>
          
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Usuários Ativos</h3>
            <p className="text-3xl font-bold text-blue-400">{usersWithRobots.filter(u => u.is_active).length}</p>
          </div>
          
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Robôs Criados</h3>
            <p className="text-3xl font-bold text-orange-400">0</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Usuários do Sistema</h3>
            <button 
              onClick={() => window.location.reload()} 
              className="px-3 py-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded text-sm transition-colors"
            >
              🔄 Atualizar
            </button>
          </div>
          
          {usersWithRobots.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👥</div>
              <h4 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h4>
              <p className="text-white/60 text-sm">
                {user?.isAdmin
                  ? 'Você pode estar logado, mas os dados do banco podem não estar carregando ainda.'
                  : 'Nenhum usuário foi encontrado no sistema.'
                }
              </p>
              {user?.isAdmin && (
                <div className="mt-4 text-sm text-orange-300">
                  <p>💡 Dica: Verifique se você tem acesso ao banco de dados Turso e se a tabela &apos;users&apos; existe.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {usersWithRobots.map(u => (
                <div key={u.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-colors gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-lg flex items-center gap-2">
                      {u.email}
                      {u.is_admin && <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300">Admin</span>}
                      {!u.is_active && <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-red-500/20 text-red-300">Bloqueado</span>}
                    </p>
                    <p className="text-sm text-white/50">Criado em: {new Date(u.created_at).toLocaleDateString('pt-BR')}</p>
                    
                    {u.robots && u.robots.length > 0 && (
                      <div className="mt-2 text-xs text-white/70 bg-black/20 p-2 rounded-lg inline-block">
                        🤖 Robô ativo: <span className="font-semibold text-emerald-400">{u.robots[0].name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      href={`/robot?adminEdit=${u.id}`}
                      className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-sm transition-colors border border-indigo-500/30 flex items-center gap-1"
                    >
                      ⚙️ Editar Robô
                    </Link>
                    
                    <button 
                      onClick={() => handleToggleAdmin(u)}
                      disabled={processingId === u.id || user.userId === u.id}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      {u.is_admin ? 'Remover Admin' : 'Tornar Admin'}
                    </button>
                    
                    <button 
                      onClick={() => handleToggleStatus(u)}
                      disabled={processingId === u.id || user.userId === u.id}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 ${u.is_active ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'}`}
                    >
                      {u.is_active ? 'Bloquear' : 'Desbloquear'}
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteUser(u)}
                      disabled={processingId === u.id || user.userId === u.id}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors border border-red-500/30 disabled:opacity-50"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors mr-4">
            Voltar ao Início
          </Link>
          <Link href="/robot" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors">
            🤖 Voltar ao Robô
          </Link>
          {user?.isAdmin && (
            <div className="mt-4">
              <p className="text-white/60 text-sm mb-2">
                Se o botão de admin não apareceu no robô:
              </p>
              <button 
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors text-sm"
              >
                🔄 Fazer logout e login novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}