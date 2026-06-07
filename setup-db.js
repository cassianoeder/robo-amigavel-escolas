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

    console.log('Database setup complete!');
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}

setupDb();
