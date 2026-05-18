# <h1 align="center">💚 Projeto Integrador III — DoarCuidar</h1>

<p align="center">
  Plataforma digital de transparência e acessibilidade para instituições beneficentes.
</p>

<p align="center">
  <a href="#-descrição-do-projeto">Descrição</a> •
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-como-executar">Como executar</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-dashboard-e-análise-de-dados">Dashboard</a> •
  <a href="#-acessibilidade">Acessibilidade</a> •
  <a href="#-estrutura-do-projeto">Estrutura</a> •
  <a href="#-roteiro-e-status">Status</a> •
  <a href="#-autores">Autores</a>
</p>

---

# 📄 Descrição do projeto

O **DoarCuidar** é uma plataforma digital desenvolvida no Projeto Integrador III com foco em:

- transparência digital;
- acessibilidade;
- confiança informacional;
- impacto social;
- visualização de dados;
- visibilidade para instituições beneficentes.

O sistema foi idealizado para conectar doadores a instituições confiáveis por meio de consultas organizadas, indicadores visuais e validação cadastral baseada em CNPJ.

O projeto utiliza arquitetura desacoplada:

- **Frontend:** React + Vite
- **Backend:** FastAPI (Python)
- **Banco de dados:** PostgreSQL/Supabase
- **Deploy:** Vercel + Render

---

# Sobre o projeto

O DoarCuidar foi criado para ajudar usuários a encontrar instituições beneficentes de forma mais segura, transparente e acessível.

Muitas pequenas organizações possuem baixa visibilidade digital, dificultando o contato com possíveis doadores. Além disso, usuários frequentemente encontram dificuldades para verificar a confiabilidade de instituições em ambientes digitais.

O projeto busca resolver esse problema por meio de:

- busca organizada de instituições;
- validação/simulação de consulta de CNPJ;
- dashboards analíticos;
- indicadores de impacto social;
- experiência acessível e intuitiva;
- transparência informacional.

⚠️ O sistema NÃO realiza processamento financeiro.  
Seu objetivo é atuar como intermediador informacional entre doadores e instituições.

---

# Funcionalidades

## 🔎 Instituições

- [x] Busca de instituições por:
  - nome
  - palavra-chave
  - UF
  - CNPJ
- [x] Listagem organizada em cards
- [x] Página de detalhes da instituição
- [x] Instituições em destaque

---

## 👤 Usuários

- [x] Cadastro de usuário
- [x] Login
- [x] Perfil do usuário
- [x] Edição básica de dados

---

## 📊 Dashboard e análise de dados

- [x] Dashboard analítico
- [x] Indicadores sociais
- [x] Métricas visuais
- [x] Cards estatísticos
- [x] Estrutura para gráficos
- [x] Indicadores de impacto social

---

## 🔐 Segurança

- [x] Estrutura para autenticação JWT
- [x] Rotas protegidas
- [x] Integração preparada para OAuth2
- [x] Variáveis de ambiente

---

## Acessibilidade

- [x] Estrutura responsiva
- [x] HTML semântico
- [x] Labels e aria-attributes
- [x] Navegação intuitiva
- [x] Contraste visual consistente

---

## Ambiente DEMO

- [x] Dados fictícios para apresentação
- [x] Fallback automático quando a API não estiver disponível
- [x] Proteção contra respostas HTML inesperadas

---

# Arquitetura

O projeto utiliza arquitetura desacoplada:

```txt
Frontend (React/Vite)
        ↓
API REST (FastAPI)
        ↓
PostgreSQL / Supabase
```

Estrutura baseada em:

- componentização;
- separação de responsabilidades;
- services;
- hooks;
- layouts reutilizáveis;
- API REST;
- persistência em nuvem.

---

# 🚀 Como executar

## 1️⃣ Clonar o projeto

```bash
git clone https://github.com/<usuario>/<repositorio>.git
```

---

## 2️⃣ Frontend

```bash
cd frontend-doarcuidar
npm install
npm run dev
```

Aplicação:

```txt
http://localhost:5173
```

---

## 3️⃣ Backend

```bash
cd backend-doarcuidar
python -m venv venv
```

### Ativar ambiente virtual

#### Windows (Git Bash)

```bash
source venv/Scripts/activate
```

---

### Instalar dependências

```bash
python -m pip install -r requirements.txt
```

---

### Executar backend

```bash
python run.py
```

ou

```bash
uvicorn app.main:app --reload
```

Producao no Render:

```bash
gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

---

# Variáveis de ambiente

## Frontend (.env)

```env
VITE_API_URL="https://sua-api.onrender.com"
```

O frontend deve chamar o backend para login, cadastro, instituicoes e doacoes. Nao exponha chaves do Supabase no Netlify para esses fluxos.

---

## Backend (.env)

```env
ENV=production
DEBUG=False
TESTING=False
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role-no-backend"
CORS_ORIGINS="https://doarcuidar-web.netlify.app,http://localhost:5173"
```

---

# 🛠 Tecnologias

## Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React

---

## Backend

- Python
- FastAPI
- Uvicorn
- Supabase Python client
- PostgreSQL
- Supabase

---

## Banco de dados

- PostgreSQL
- Supabase

---

## Nuvem / Deploy

- Vercel
- Render

---

## Controle de versão

- Git
- GitHub

---

## Integração contínua

- GitHub Actions

---

# 📊 Dashboard e análise de dados

O sistema possui estrutura para dashboards analíticos com:

- métricas sociais;
- indicadores de instituições;
- visualização de impacto;
- análise de dados;
- gráficos;
- indicadores visuais.

O objetivo é ampliar a transparência e facilitar a interpretação das informações pelos usuários.

---

# Acessibilidade

O projeto busca seguir princípios de acessibilidade digital conforme WCAG:

- contraste adequado;
- navegação intuitiva;
- responsividade;
- estrutura semântica;
- elementos acessíveis;
- foco em inclusão digital.

---

# 📁 Estrutura do projeto

```txt
frontend/
 ├── src/
 │    ├── components/
 │    ├── pages/
 │    ├── layouts/
 │    ├── services/
 │    ├── hooks/
 │    ├── assets/
 │    └── routes/
 │
 ├── App.jsx
 ├── main.jsx
 └── vite.config.js

backend/
 ├── app/
 │    ├── routes/
 │    ├── services/
 │    ├── models/
 │    ├── schemas/
 │    ├── database/
 │    └── core/
 │
 ├── run.py
 ├── requirements.txt
 └── .env
```

---

# Roteiro e status

## ✅ Implementado

- [x] React + Vite
- [x] FastAPI
- [x] PostgreSQL/Supabase
- [x] Dashboard analítico
- [x] Busca de instituições
- [x] Página de detalhes
- [x] Estrutura de autenticação
- [x] Layout responsivo
- [x] Estrutura desacoplada
- [x] Deploy preparado
- [x] Variáveis de ambiente
- [x] Integração frontend/backend
- [x] Estrutura para acessibilidade

---

## 🚧 Em desenvolvimento

- [ ] Autenticação completa OAuth2
- [ ] Testes automatizados
- [ ] Integração oficial Receita Federal
- [ ] Favoritos/donatárias persistentes
- [ ] Melhorias avançadas de acessibilidade

---

# Contexto social

O DoarCuidar busca ampliar a visibilidade de instituições beneficentes e fortalecer a confiança dos usuários em ambientes digitais de doação.

O projeto foi pensado para organizações com baixa presença digital, facilitando o acesso da população a informações confiáveis sobre causas sociais.

---

# Relevância acadêmica

O projeto integra conhecimentos de:

- desenvolvimento web;
- arquitetura desacoplada;
- APIs REST;
- banco de dados;
- acessibilidade digital;
- cloud computing;
- integração contínua;
- análise de dados;
- UX/UI;
- engenharia de software.

---

# 🦸 Autores

Projeto desenvolvido pelos alunos:

- Fábio
- Ingrid
- Jessica
- Jose Edson Rodrigues
- Keven
- Viviane Oliveira Soares

---

# 💚 DoarCuidar
