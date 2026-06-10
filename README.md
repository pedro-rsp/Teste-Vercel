# Clínica IHC - Vercel + Supabase

Sistema web simples para gestão básica de clínica psicológica, com autenticação, pacientes, agenda e tarefas.

## Estrutura

- `public/index.html`: tela de login.
- `public/pacientes.html`: cadastro e listagem de pacientes.
- `public/agenda.html`: cadastro e listagem de agendamentos.
- `public/tarefas.html`: cadastro e listagem de tarefas.
- `public/css/style.css`: estilos da interface.
- `public/js`: scripts do frontend.
- `api`: rotas serverless da Vercel.
- `sql/schema.sql`: script para criar as tabelas no Supabase.

## Configuração do banco

No Supabase, abra o SQL Editor e execute o arquivo `sql/schema.sql`.

Usuário inicial criado pelo script:

- E-mail: `admin@clinica.com`
- Senha: `123456`

## Variáveis na Vercel

Configure em Settings > Environment Variables:

- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_KEY`: anon/public key do Supabase.

Também funciona com `SUPABASE_ANON_KEY` no lugar de `SUPABASE_KEY`.

## Rotas da API

- `POST /api/login`
- `POST /api/add-paciente`
- `GET /api/listar-pacientes`
- `POST /api/add-agenda`
- `GET /api/listar-agenda`
- `POST /api/add-tarefa`
- `GET /api/listar-tarefas`

## Observação acadêmica

A autenticação foi mantida simples para demonstração acadêmica. Em um sistema real, as senhas deveriam ser criptografadas com hash seguro, e as rotas deveriam usar controle de sessão/token no backend.
