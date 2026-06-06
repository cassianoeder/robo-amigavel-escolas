import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('robo_auth_token')?.value;
  const path = request.nextUrl.pathname;

  // Paths that require authentication
  const isProtectedRoute = path === '/robot.html' || path === '/robot' || path === '/app';
  
  // Paths for authentication (redirect if already logged in)
  const isAuthRoute = path === '/login' || path === '/register';

  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch (err) {
      isAuthenticated = false;
    }
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/robot.html', request.url));
  }

  // Redirect /app or /robot to /robot.html
  if (path === '/app' || path === '/robot') {
    return NextResponse.rewrite(new URL('/robot.html', request.url));
  }

  // Se o usuário acessar a raiz e estiver logado, redireciona pro robô.
  // Se não estiver, vai mostrar a nova landing page em app/page.js
  if (path === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/robot.html', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/robot.html', '/robot', '/app', '/login', '/register', '/api/config']
};
