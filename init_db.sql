-- Script para inicializar o banco de dados do sistema de robô educacional

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir um usuário administrativo para testes (senha: admin123)
-- DELETE FROM users WHERE email = 'admin@roboeducacional.com';
INSERT OR IGNORE INTO users (email, password_hash) VALUES (
    'admin@roboeducacional.com',
    '$2a$10$rOZXg6Q5J8lZ3J6L2J6J6O6J6J6J6J6J6J6J6J6J6J6J6J6J6J6J6J6J6'
);

-- Criar tabela de robôs (para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS robots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    theme TEXT DEFAULT 'Azul Escuro',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);