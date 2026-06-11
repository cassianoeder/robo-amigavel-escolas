import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 });
    }

    // Find user
    const result = await db.execute({
      sql: 'SELECT id, email, password_hash, is_admin, is_active FROM users WHERE email = ?',
      args: [email]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const user = result.rows[0];
    
    const adminEmail = process.env.ADMIN_EMAIL || 'edersonw9@gmail.com';
    
    // Se o usuário não tem a coluna is_admin (sistema antigo), assumir que é admin se for o adminEmail
    if (user.is_admin === null || user.is_admin === undefined) {
      user.is_admin = email === adminEmail;
    }
    
    // Se o usuário não tem a coluna is_active, assumir que está ativo
    if (user.is_active === null || user.is_active === undefined) {
      user.is_active = 1;
    }
    
    // Se for o admin e não estiver marcado como admin, promover
    if (email === adminEmail && !user.is_admin) {
      try {
        await db.execute({
          sql: 'UPDATE users SET is_admin = TRUE WHERE email = ?',
          args: [email]
        });
        user.is_admin = true;
        console.log(`✅ Usuário ${email} automaticamente promovido para admin`);
      } catch (error) {
        console.log('⚠️ Erro ao promover usuário para admin:', error.message);
      }
    }
    
    // Verificar se está ativo
    if (!user.is_active) {
      return NextResponse.json({ error: 'Conta desativada' }, { status: 401 });
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = 'HS256';

    const token = await new SignJWT({ 
      userId: user.id, 
      email: user.email,
      isAdmin: Boolean(user.is_admin)
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Set cookie
    const response = NextResponse.json({ message: 'Login bem-sucedido' });
    
    response.cookies.set({
      name: 'robo_auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
