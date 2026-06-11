import { db } from './app/lib/db-local.js';

async function testConnection() {
  try {
    console.log('✅ Conexão com o banco local bem-sucedida!');
    
    // Verificar usuários
    const users = await db.all('SELECT email, created_at FROM users');
    console.log('👥 Usuários cadastrados:', users);
    
    // Testar login do admin
    const admin = await db.get('SELECT email FROM users WHERE email = ?', ['admin@roboeducacional.com']);
    if (admin) {
      console.log('🔑 Usuário admin encontrado:', admin.email);
    } else {
      console.log('❌ Usuário admin não encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
  }
}

testConnection();