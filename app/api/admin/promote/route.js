import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jwtVerify } from 'jose';

async function verifyAdmin(request) {
  try {
    const token = request.cookies.get('robo_auth_token');
    if (!token) return false;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);
    
    return payload.isAdmin === true;
  } catch (error) {
    return false;
  }
}

export async function POST(request) {
  try {
    // Verificar se é admin
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 });
    }

    // Promover usuário para admin
    const result = await db.execute({
      sql: 'UPDATE users SET is_admin = 1 WHERE id = ?',
      args: [userId]
    });

    if (result.rowsAffected > 0) {
      return NextResponse.json({ message: 'Usuário promovido para administrador com sucesso' });
    } else {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
  } catch (error) {
    console.error('Admin promote error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}