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
    
  } catch (error) {
    console.error('❌ Erro ao inicializar o banco de dados:', error);
    throw error;
  }
}

// Função para obter todos os usuários
export async function getAllUsers() {
  try {
    const result = await db.execute({
      sql: 'SELECT id, email, is_admin, is_active, created_at FROM users ORDER BY created_at DESC',
      args: []
    });
    return result.rows;
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    return [];
  }
}

// Função para obter todos os robôs
export async function getAllRobots() {
  try {
    const result = await db.execute({
      sql: `
        SELECT r.id, r.user_id, r.name, r.theme, r.created_at, r.updated_at, 
               u.email as user_email 
        FROM robots r 
        JOIN users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC
      `,
      args: []
    });
    return result.rows;
  } catch (error) {
    console.error('❌ Erro ao buscar robôs:', error);
    return [];
  }
}

// Função para obter usuários ativos
export async function getActiveUsers() {
  try {
    const result = await db.execute({
      sql: 'SELECT id, email, is_admin, is_active, created_at FROM users WHERE is_active = 1 ORDER BY created_at DESC',
      args: []
    });
    return result.rows;
  } catch (error) {
    console.error('❌ Erro ao buscar usuários ativos:', error);
    return [];
  }
}

// Função para atualizar status do usuário
export async function updateUserStatus(userId, isActive) {
  try {
    const result = await db.execute({
      sql: 'UPDATE users SET is_active = ? WHERE id = ?',
      args: [isActive ? 1 : 0, userId]
    });
    return result.rowsAffected > 0;
  } catch (error) {
    console.error('❌ Erro ao atualizar status do usuário:', error);
    return false;
  }
}

// Função para promover usuário para admin
export async function promoteToAdmin(userId) {
  try {
    const result = await db.execute({
      sql: 'UPDATE users SET is_admin = 1 WHERE id = ?',
      args: [userId]
    });
    return result.rowsAffected > 0;
  } catch (error) {
    console.error('❌ Erro ao promover usuário para admin:', error);
    return false;
  }
}