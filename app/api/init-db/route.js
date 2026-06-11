import { NextResponse } from 'next/server';
import { initDatabase, promoteToAdmin } from '@/lib/db';

export async function GET(request) {
  try {
    // Apenas rodar em desenvolvimento ou com uma chave secreta
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Endpoint não disponível em produção' }, { status: 403 });
    }

    await initDatabase();
    
    const adminEmail = process.env.ADMIN_EMAIL || 'edersonw9@gmail.com';
    await promoteToAdmin(adminEmail);

    return NextResponse.json({ message: 'Banco de dados inicializado com sucesso!' });
  } catch (error) {
    console.error('Init DB error:', error);
    return NextResponse.json({ error: 'Erro ao inicializar banco de dados' }, { status: 500 });
  }
}