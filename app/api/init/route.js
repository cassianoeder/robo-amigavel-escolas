import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    return NextResponse.json({ 
      message: 'Banco de dados inicializado com sucesso' 
    });
  } catch (error) {
    console.error('Database init error:', error);
    return NextResponse.json({ 
      error: 'Erro ao inicializar banco de dados' 
    }, { status: 500 });
  }
}