# DoarCuidar Web

Plataforma React/Vite para consulta de instituicoes beneficentes com backend Node/Express e banco Supabase PostgreSQL.

## Arquitetura

```txt
Frontend React/Vite
  -> Backend Node/Express
  -> Supabase PostgreSQL
  -> Backend Node/Express
  -> Frontend React/Vite
```

O frontend nao conecta diretamente ao Supabase. Ele consome apenas a API do backend configurada em `VITE_API_URL`.

## Variaveis de ambiente

Frontend, arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3001
```

Backend, arquivo `backend/.env`:

```env
SUPABASE_URL=https://rdfuuxaxsqhjvhnxhrgw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

Nunca coloque `SUPABASE_SERVICE_ROLE_KEY` no frontend ou em variaveis `VITE_*`.

## Como executar

Instale dependencias:

```bash
npm install
```

Inicie o backend:

```bash
npm run dev:backend
```

Inicie o frontend:

```bash
npm run dev
```

## Endpoints principais

- `GET /health`
- `GET /instituicoes`
- `GET /instituicoes?uf=SP`
- `GET /instituicoes?nome=AMIGOS`
- `GET /instituicoes/:id`
- `POST /instituicoes`
- `PATCH /instituicoes/:id/status`
- `DELETE /instituicoes/:id`
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/password-reset`
- `GET /doacoes`
- `POST /doacoes`
- `GET /perfil`

## Tecnologias

- React + Vite
- Node + Express
- Supabase PostgreSQL
- Supabase Auth via backend
- Netlify para frontend

## Observacao

O DoarCuidar nao processa pagamentos. Os apoios registrados sao acompanhamento interno, nao confirmacao de transacao financeira.
