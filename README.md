# DoarCuidar Web

Frontend React/Vite para consulta de instituicoes beneficentes via API remota do DoarCuidar.

## Arquitetura

```txt
Frontend React/Vite
  -> API remota DoarCuidar
```

O frontend nao conecta diretamente ao Supabase. Ele consome apenas a API do backend configurada em `VITE_API_URL`.

## Variaveis de ambiente

Frontend, arquivo `.env` na raiz:

```env
VITE_API_URL=https://doarcuidar-1.onrender.com
```

Nunca coloque `SUPABASE_SERVICE_ROLE_KEY` no frontend ou em variaveis `VITE_*`.

## Como executar

Instale dependencias:

```bash
npm install
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
- `POST /api/auth/forgot-password`
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
