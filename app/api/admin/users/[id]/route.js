import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

// Atualizar dados de um usuário
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken();
    
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const userId = params.id;
    const body = await request.json();
    const { is_active, is_admin } = body;

    // Proteção: não permitir que um admin remova o próprio admin
    if (user.userId === parseInt(userId) && is_admin === false) {
      return NextResponse.json({ error: 'Você não pode remover seu próprio acesso de administrador.' }, { status: 400 });
    }

    let updates = [];
    let args = [];

    if (is_active !== undefined) {
      updates.push('is_active = ?');
      args.push(is_active ? 1 : 0);
    }
    
    if (is_admin !== undefined) {
      updates.push('is_admin = ?');
      args.push(is_admin ? 1 : 0);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nenhum dado para atualizar.' }, { status: 400 });
    }

    args.push(userId);

    await db.execute({
      sql: `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      args: args
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

// Excluir um usuário
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken();
    
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const userId = params.id;

    if (user.userId === parseInt(userId)) {
      return NextResponse.json({ error: 'Você não pode excluir a sua própria conta.' }, { status: 400 });
    }

    // Graças ao ON DELETE CASCADE no banco, apagar o usuário deletará as configs
    await db.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [userId]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
