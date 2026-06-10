CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    perfil VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER REFERENCES pacientes(id) ON DELETE CASCADE,
    data DATE,
    hora TIME,
    status VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200),
    descricao TEXT,
    concluida BOOLEAN DEFAULT FALSE
);

INSERT INTO usuarios (nome, email, senha, perfil)
VALUES ('Administrador', 'admin@clinica.com', '123456', 'admin')
ON CONFLICT (email) DO NOTHING;
