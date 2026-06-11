import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SignJWT, jwtVerify } from 'jose';

async function verifyAdmin(request) {
  try {
    const token = request.cookies.get('robo_auth_token');
    if (!token) return false;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);
    
    return !!payload.isAdmin;
  } catch (error) {
    return false;
  }
}

export async function GET(request) {
  try {
    // Permitir acesso apenas para admin
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 });
    }

    // Primeiro, verificar se a tabela de robôs existe, senão criar
    try {
      await db.execute({
        sql: 'SELECT COUNT(*) as count FROM robots LIMIT 1',
        args: []
      });
      
      // Tentar adicionar as colunas novas caso a tabela já exista mas não as tenha
      try {
        await db.execute('ALTER TABLE robots ADD COLUMN config TEXT');
      } catch (colError) {}
      
      try {
        await db.execute('ALTER TABLE robots ADD COLUMN updated_at DATETIME');
      } catch (colError) {}
    } catch (error) {
      // Tabela não existe, criar
      await db.execute(`
        CREATE TABLE IF NOT EXISTS robots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          theme TEXT DEFAULT 'Azul Escuro',
          config TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
      `);
    }

    // Buscar robôs com informações do usuário
    const result = await db.execute({
      sql: `
        SELECT r.id, r.user_id, r.name, r.theme, r.config, r.created_at, r.updated_at, u.email as user_email 
        FROM robots r 
        JOIN users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC
      `,
      args: []
    });

    return NextResponse.json({ robots: result.rows });
  } catch (error) {
    console.error('Admin robots error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}