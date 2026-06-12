import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { shareId, password } = body;

    if (!shareId) {
      return NextResponse.json({ error: 'ID de compartilhamento não fornecido' }, { status: 400 });
    }

    const effectiveUserId = parseInt(shareId, 10);
    if (isNaN(effectiveUserId)) {
      return NextResponse.json({ error: 'ID de compartilhamento inválido' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'SELECT * FROM robot_configs WHERE user_id = ?',
      args: [effectiveUserId]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
    }

    const config = result.rows[0];

    if (!config.public_enabled) {
      return NextResponse.json({ error: 'Este robô não está disponível publicamente' }, { status: 403 });
    }

    if (config.public_password && config.public_password !== password) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Get public config error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
