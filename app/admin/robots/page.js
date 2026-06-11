'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminRobots() {
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/robots');
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setRobots(data.robots || []);
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
          <p>Carregando robôs...</p>
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
          <h1 className="text-3xl font-bold">Gerenciamento de Robôs</h1>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors">
            Novo Robô
          </button>
        </div>

        {robots.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold mb-2">Nenhum robô encontrado</h2>
            <p className="text-white/60">Os robôs criados pelos alunos aparecerão aqui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {robots.map(robot => (
              <div key={robot.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{robot.name}</h2>
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-300">
                    {robot.theme}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-white/60 mb-4">
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span>{robot.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuário:</span>
                    <span className="truncate">{robot.user_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Criado:</span>
                    <span>{new Date(robot.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {robot.updated_at && (
                    <div className="flex justify-between">
                      <span>Atualizado:</span>
                      <span>{new Date(robot.updated_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
                
                {robot.config && (
                  <div className="mt-4 mb-4 pt-4 border-t border-white/10 text-sm">
                    <h3 className="font-medium text-white mb-2">Configuração:</h3>
                    <pre className="bg-black/50 p-3 rounded-lg overflow-x-auto text-xs text-white/70">
                      {(() => {
                        try {
                          return JSON.stringify(JSON.parse(robot.config), null, 2);
                        } catch (e) {
                          return robot.config;
                        }
                      })()}
                    </pre>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded text-sm transition-colors">
                    Visualizar
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 rounded text-sm transition-colors">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}