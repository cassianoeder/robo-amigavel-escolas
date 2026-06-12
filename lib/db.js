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
    
    // Criar tabela de configurações dos robôs (se não existir)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS robot_configs (
        user_id INTEGER PRIMARY KEY,
        webhookUrl TEXT,
        jwtToken TEXT,
        corDestaque TEXT,
        vozIndex INTEGER,
        velocidadeFala REAL,
        timeoutSonolencia INTEGER,
        sessaoId TEXT,
        isKidsMode INTEGER,
        topicDia TEXT,
        volumeRobo INTEGER,
        robotName TEXT,
        nomeProfessor TEXT,
        pais TEXT,
        estado TEXT,
        cidade TEXT,
        nomeEscola TEXT,
        salaLocal TEXT,
        codigoBNCC TEXT,
        descricaoBNCC TEXT,
        disciplina TEXT DEFAULT '',
        objetivoAula TEXT DEFAULT '',
        turno TEXT DEFAULT '',
        proximosEventos TEXT DEFAULT '',
        avisosGerais TEXT DEFAULT '',
        eventosHoje TEXT DEFAULT '',
        nomeDiretor TEXT DEFAULT '',
        nomeRecepcionista TEXT DEFAULT '',
        nomeSecretario TEXT DEFAULT '',
        hatEnabled INTEGER,
        hatColor TEXT,
        hatLogo TEXT,
        public_enabled INTEGER DEFAULT 0,
        public_password TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Migrações adicionais
    const pragmaRes = await db.execute("PRAGMA table_info(robot_configs)");
    const columns = pragmaRes.rows.map(row => row.name);

    if (!columns.includes('public_enabled')) {
      console.log('Adicionando public_enabled...');
      await db.execute("ALTER TABLE robot_configs ADD COLUMN public_enabled INTEGER DEFAULT 0");
    }
    if (!columns.includes('public_password')) {
      console.log('Adicionando public_password...');
      await db.execute("ALTER TABLE robot_configs ADD COLUMN public_password TEXT");
    }
    
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
