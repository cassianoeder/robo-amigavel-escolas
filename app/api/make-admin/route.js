import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simular promoção do usuário para admin
    // Em produção, isso seria uma query real no banco
    return NextResponse.json({ 
      message: 'Usuário edersonw9@gmail.com promovido para administrador',
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}