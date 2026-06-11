import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password, confirmPassword } = await request.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'As senhas não coincidem' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    });

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user with default values for admin columns
    await db.execute({
      sql: 'INSERT INTO users (email, password_hash, is_admin, is_active) VALUES (?, ?, 0, 1)',
      args: [email, password_hash]
    });

    return NextResponse.json({ message: 'Usuário criado com sucesso' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
