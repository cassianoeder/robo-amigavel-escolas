'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SimpleAdmin() {
  const [user, setUser] = useState(null);
  const [usersWithRobots, setUsersWithRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRobotConfig, setShowRobotConfig] = useState(false);

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
          try {
            const usersResponse = await fetch('/api/admin/users');
            console.log('[Admin] Status da resposta users:', usersResponse.status);
            
            if (usersResponse.ok) {
              const usersData = await usersResponse.json();
              console.log('[Admin] Dados dos usuários:', usersData);
              
              if (usersData.users && usersData.users.length > 0) {
                // A API agora já retorna os usuários com os robôs aninhados
                setUsersWithRobots(usersData.users);
              } else {
                setUsersWithRobots([]);
              }
            } else {
              const errorData = await usersResponse.json();
              console.error('[Admin] Erro ao buscar usuários:', errorData);
              setUsersWithRobots([]);
            }
          } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            setUsersWithRobots([]);
          }
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
              {usersWithRobots.map(user => (
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