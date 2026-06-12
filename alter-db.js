const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addColumns() {
  const columns = [
    'robotName TEXT',
    'nomeProfessor TEXT',
    'pais TEXT',
    'estado TEXT',
    'cidade TEXT',
    'nomeEscola TEXT',
    'salaLocal TEXT',
    'codigoBNCC TEXT',
    'descricaoBNCC TEXT',
    'hatEnabled INTEGER',
    'hatColor TEXT',
    'hatLogo TEXT',
    'elevenlabs_enabled INTEGER',
    'elevenlabs_agent_id TEXT'
  ];

  for (const col of columns) {
    try {
      console.log(`Adding column ${col}...`);
      await client.execute(`ALTER TABLE robot_configs ADD COLUMN ${col}`);
    } catch (e) {
      console.log(`Failed or already exists: ${col}`);
    }
  }
  console.log('Done!');
}

addColumns();
