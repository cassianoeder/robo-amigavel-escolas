import { db } from '../app/lib/db.js';

async function promoteAdmin() {
  try {
    // Primeiro verificar se as colunas existem
    try {
      await db.execute('ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE');
      await db.execute('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
      console.log('✅ Colunas adicionadas');
    } catch (error) {
      console.log('ℹ️ Colunas já existem');
    }

    // Promover usuário para admin
    const result = await db.execute({
      sql: 'UPDATE users SET is_admin = TRUE WHERE email = ?',
      args: ['edersonw9@gmail.com']
    });

    if (result.rowsAffected > 0) {
      console.log('✅ Usuário edersonw9@gmail.com promovido para admin com sucesso');
    } else {
      console.log('⚠️ Usuário não encontrado');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error);
    process.exit(1);
  }
}

promoteAdmin();