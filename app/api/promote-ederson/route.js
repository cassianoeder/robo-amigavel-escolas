import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Primeiro, verificar se as colunas existem
    try {
      await db.execute({
        sql: 'ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE',
        args: []
      });
      console.log('✅ Coluna is_admin adicionada');
    } catch (error) {
      // Coluna já existe, ignorar erro
    }
    
    try {
      await db.execute({
        sql: 'ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE',
        args: []
      });
      console.log('✅ Coluna is_active adicionada');
    } catch (error) {
      // Coluna já existe, ignorar erro
    }

    // Promover usuário edersonw9@gmail.com para admin
    const result = await db.execute({
      sql: 'UPDATE users SET is_admin = TRUE, is_active = TRUE WHERE email = ?',
      args: ['edersonw9@gmail.com']
    });

    if (result.rowsAffected > 0) {
      return NextResponse.json({ 
        message: 'Usuário edersonw9@gmail.com promovido para administrador com sucesso' 
      });
    } else {
      // Usuário não existe, criar conta admin
      const bcrypt = require('bcryptjs');
      const password = 'admin123';
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      
      const createResult = await db.execute({
        sql: 'INSERT INTO users (email, password_hash, is_admin, is_active) VALUES (?, ?, TRUE, TRUE)',
        args: ['edersonw9@gmail.com', password_hash]
      });
      
      return NextResponse.json({ 
        message: 'Conta admin criada para edersonw9@gmail.com com sucesso',
        userId: createResult.lastID
      });
    }
  } catch (error) {
    console.error('Error promoting admin:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}