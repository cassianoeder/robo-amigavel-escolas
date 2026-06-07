const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function setupDb() {
  try {
    console.log('Creating users table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating robot_configs table...');
    await client.execute(`
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
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('Adding fish_stt_enabled column (idempotent)...');
    try {
      await client.execute(`ALTER TABLE robot_configs ADD COLUMN fish_stt_enabled INTEGER DEFAULT 0`);
    } catch (e) {
      console.log('  fish_stt_enabled already exists or error (safe to ignore):', e.message);
    }

    console.log('Adding fish_tts_enabled column (idempotent)...');
    try {
      await client.execute(`ALTER TABLE robot_configs ADD COLUMN fish_tts_enabled INTEGER DEFAULT 0`);
    } catch (e) {
      console.log('  fish_tts_enabled already exists or error (safe to ignore):', e.message);
    }

    console.log('Database setup complete!');
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}

setupDb();
