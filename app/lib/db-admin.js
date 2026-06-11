import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Função para inicializar o banco de dados
export async function initDatabase() {
  try {
    console.log('Inicializando banco de dados...');
    
    // Criar tabela de usuários (se não existir)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Criar tabela de robôs (se não existir)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS robots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        theme TEXT DEFAULT 'Azul Escuro',
        config JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
    
    // Criar tabela de logs de atividade (opcional mas útil)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
    
    console.log('✅ Banco de dados inicializado com sucesso');
    
    // Verificar se o usuário admin já existe
    const existingAdmin = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: ['edersonw9@gmail.com']
    });
    
    if (existingAdmin.rows.length === 0) {
      console.log('👤 Criando usuário admin...');
      // O usuário admin será criado no momento da autenticação, mas podemos adicionar uma função para isso
      console.log('⚠ Usuário admin ainda não existe. Será criado na primeira autenticação.');
    } else {
      console.log('✅ Usuário admin já existe');
    }
    
  } catch (error) {
    console.error('❌ Erro ao inicializar o banco de dados:', error);
    throw error;
  }
}

// Função para converter usuário para admin
export async function promoteToAdmin(email) {
  try {
    const result = await db.execute({
      sql: 'UPDATE users SET is_admin = TRUE WHERE email = ?',
      args: [email]
    });
    
    if (result.rowsAffected > 0) {
      console.log(`✅ Usuário ${email} promovido para administrador`);
      return true;
    } else {
      console.log(`⚠ Usuário ${email} não encontrado`);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao promover usuário para admin:', error);
    throw error;
  }
}