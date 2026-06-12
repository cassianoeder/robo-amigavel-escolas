import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { shareId, password } = body;

    if (!shareId) {
      return NextResponse.json({ error: 'ID de compartilhamento não fornecido' }, { status: 400 });
    }

    let result;
    
    // Check if shareId is a number (legacy) or slug
    if (!isNaN(shareId) && !shareId.includes('-')) {
      const effectiveUserId = parseInt(shareId, 10);
      result = await db.execute({
        sql: 'SELECT * FROM robot_configs WHERE user_id = ? OR public_slug = ?',
        args: [effectiveUserId, shareId]
      });
    } else {
      result = await db.execute({
        sql: 'SELECT * FROM robot_configs WHERE public_slug = ?',
        args: [shareId]
      });
    }

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
    }

    const config = result.rows[0];

    if (!config.public_enabled) {
      return NextResponse.json({ error: 'Este robô não está disponível publicamente' }, { status: 403 });
    }

    const storedPassword = (config.public_password || '').trim();
    const providedPassword = (password || '').trim();

    if (storedPassword && storedPassword !== providedPassword) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // Map snake_case to camelCase for frontend compatibility
    const publicConfig = {
      ...config,
      publicEnabled: config.public_enabled === 1 || config.public_enabled === true,
      publicPassword: config.public_password || '',
      publicSlug: config.public_slug || '',
    };

    return NextResponse.json(publicConfig);
  } catch (error) {
    console.error('Get public config error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
