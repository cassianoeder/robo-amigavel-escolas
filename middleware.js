import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('robo_auth_token');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Só precisamos interceptar as rotas de admin
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!token) {
    // Redireciona para login se não houver token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secret);

    if (isAdminRoute && !payload.isAdmin) {
      // Token válido mas não é admin
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token inválido ou expirado
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
