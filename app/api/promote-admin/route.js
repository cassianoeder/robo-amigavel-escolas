import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    // Primeiro verificar se as colunas existem
    try {
      await db.execute({
        sql: 'ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE',
        args: []
      });
      await db.execute({
        sql: 'ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE',
        args: []
      });
    } catch (error) {
      // Colunas já existem, ignorar erro
    }

    // Promover usuário para admin
    const result = await db.execute({
      sql: 'UPDATE users SET is_admin = TRUE WHERE email = ?',
      args: [email]
    });

    if (result.rowsAffected > 0) {
      return NextResponse.json({ 
        message: `Usuário ${email} promovido para administrador com sucesso` 
      });
    } else {
      return NextResponse.json({ 
        error: 'Usuário não encontrado' 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Promote admin error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}