import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    
    // Permitir acesso apenas para admin
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    try {
      // Buscar todos os usuários
      const usersResult = await db.execute({
        sql: `
          SELECT 
            id,
            email,
            is_admin,
            is_active,
            created_at
          FROM users
          ORDER BY created_at DESC
        `,
        args: []
      });

      // Buscar todos os robôs (usando robot_configs)
      const robotsResult = await db.execute({
        sql: `
          SELECT 
            user_id,
            robotName as name,
            corDestaque as theme,
            updated_at
          FROM robot_configs
        `,
        args: []
      });

      // Agrupar robôs por usuário
      const usersWithRobots = usersResult.rows.map(u => {
        const userRobots = robotsResult.rows.filter(robot => robot.user_id === u.id);
        return {
          ...u,
          robots: userRobots
        };
      });

      return NextResponse.json({ users: usersWithRobots });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ users: [], error: 'Erro ao buscar dados' });
    }
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}