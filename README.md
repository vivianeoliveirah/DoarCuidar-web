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
VITE_API_URL=https://backend-doarcuidar.onrender.com
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

- `GET /api/instituicoes`
- `GET /api/instituicoes?uf=SP`
- `GET /api/instituicoes?nome=AMIGOS`
- `GET /api/instituicoes/:id`
- `POST /api/instituicoes`
- `PATCH /api/instituicoes/:id/status`
- `DELETE /api/instituicoes/:id`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/password-reset`
- `GET /api/doacoes`
- `POST /api/doacoes`
- `GET /api/perfil`

## Tecnologias

- React + Vite
- Node + Express
- Supabase PostgreSQL
- Supabase Auth via backend
- Netlify para frontend

## Observacao

O DoarCuidar nao processa pagamentos. Os apoios registrados sao acompanhamento interno, nao confirmacao de transacao financeira.
