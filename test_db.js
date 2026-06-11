import { db } from './app/lib/db.js';

async function testConnection() {
  try {
    console.log('Testando conexão com o banco...');
    const result = await db.execute({ sql: 'SELECT 1 as test' });
    console.log('✅ Conexão bem-sucedida:', result);
    
    // Verificar se a tabela users existe
    const tables = await db.execute({ sql: "SELECT name FROM sqlite_master WHERE type='table'" });
    console.log('📋 Tabelas existentes:', tables.rows.map(row => row.name));
    
    // Listar usuários
    const users = await db.execute({ sql: 'SELECT email, created_at FROM users' });
    console.log('👥 Usuários cadastrados:', users.rows);
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
  }
}

testConnection();