import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json({ 
        isAdmin: false, 
        authenticated: false,
        user: null 
      });
    }
    
    // Permitir acesso apenas para admin
    const isAuthorized = !!user.isAdmin;
    
    return NextResponse.json({ 
      isAdmin: isAuthorized, 
      authenticated: true,
      user: { 
        id: user.userId, 
        email: user.email 
      } 
    });
  } catch (error) {
    return NextResponse.json({ 
      isAdmin: false, 
      authenticated: false,
      user: null 
    });
  }
}