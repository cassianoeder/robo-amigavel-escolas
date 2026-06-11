import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Resposta simples para forçar promoção manual
    return NextResponse.json({ 
      message: 'Para ativar as permissões de admin:',
      instructions: [
        '1. Faça logout da conta edersonw9@gmail.com',
        '2. Faça login novamente',
        '3. Recarregue a página do robô',
        '4. O botão de admin deve aparecer'
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}