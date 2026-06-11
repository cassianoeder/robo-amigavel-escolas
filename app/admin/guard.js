'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRouteGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificação de admin (simulação)
    const verifyAdmin = async () => {
      try {
        // Em produção, você faria uma chamada API real
        // const response = await fetch('/api/auth/check-admin');
        // const data = await response.json();
        // setIsAdmin(data.isAdmin);
        
        // Para testes, assumimos que é admin
        setIsAdmin(true);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">Verificando acesso...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center p-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-white/60 mb-6">Você não tem permissão para acessar esta área.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return children;
}