# DoarCuidar

Frontend do DoarCuidar, plataforma web para consulta de organizações da sociedade civil, registro informativo de apoio e visualização de dados públicos.

Projeto desenvolvido no contexto do Projeto Integrador IV.

- Frontend em produção: https://doarcuidar-web.viviany-oliveira.workers.dev
- Backend em produção: https://backend-doarcuidar-1.onrender.com

> O DoarCuidar não processa pagamentos ou transações financeiras. O registro de apoio/doação possui finalidade informativa.

## Arquitetura

A aplicação utiliza uma arquitetura desacoplada:

```text
React
  -> API REST FastAPI
    -> Supabase
```

O frontend não acessa o Supabase diretamente. Autenticação, persistência, consultas e operações administrativas passam pelo backend FastAPI.

Nenhuma chave ou credencial do Supabase deve ser adicionada ao frontend. Toda configuração privilegiada do Supabase pertence exclusivamente ao ambiente do backend.

## Recuperação de senha

```text
React: /recuperar-senha
  -> POST /api/auth/forgot-password
    -> FastAPI
      -> Supabase Auth envia o e-mail
        -> callback para /redefinir-senha
          -> frontend captura o recovery access token somente em memória
            -> POST /api/auth/reset-password
              -> FastAPI
                -> Supabase Auth atualiza a senha
```

Na página `/redefinir-senha`, o token temporário é capturado do callback, removido da URL com `history.replaceState` e enviado explicitamente ao backend no cabeçalho `Authorization`. Ele não é salvo em `localStorage` nem em `sessionStorage`.

## Funcionalidades e rotas

| Funcionalidade | Rota | Acesso |
| --- | --- | --- |
| Início | `/` | Público |
| Login | `/login` | Público |
| Cadastro | `/cadastro` | Público |
| Recuperação de senha | `/recuperar-senha` | Público |
| Redefinição de senha | `/redefinir-senha` | Público, por callback |
| Instituições | `/instituicoes` | Público |
| Detalhes da instituição | `/detalhes/:id` | Público |
| Registro de apoio/doação | `/doar/:id` | Protegido |
| Perfil | `/perfil` | Protegido |
| Painel | `/dashboard` | Público |
| Transparência | `/transparencia` | Público |
| Análise das OSCs | `/analise-oscs` | Público |

A rota `/painel` redireciona para `/dashboard`. Os nomes técnicos de arquivos e rotas permanecem inalterados.

## Análise das OSCs

A área apresenta uma análise de dados em escala baseada no conjunto público do Mapa das OSCs/IPEA.

O Projeto Integrador IV utiliza aprendizagem de máquina não supervisionada com o algoritmo `MiniBatchKMeans` para identificar seis perfis estruturais. A interface gráfica permite explorar distribuições geográficas, atividades econômicas, naturezas jurídicas e a composição dos perfis.

Dados preservados na análise:

- 618.136 OSCs válidas;
- 27 UFs;
- 5.292 municípios;
- 388 atividades econômicas;
- 4 naturezas jurídicas;
- 6 perfis estruturais.

Os perfis são agrupamentos descritivos de características estruturais. Eles não são score, ranking ou avaliação de qualidade, confiabilidade, transparência, impacto, risco ou legitimidade das organizações.

## Tecnologias

### Aplicação

- React 19 e React DOM;
- Vite 7;
- React Router DOM 7;
- Recharts;
- Tailwind CSS 4;
- Lucide React;
- React Hot Toast.

### Desenvolvimento e qualidade

- ESLint;
- Vitest;
- Testing Library;
- jsdom;
- PostCSS e Autoprefixer.

As versões exatas estão registradas em `package.json` e `package-lock.json`.

## Configuração

Requisitos:

- Node.js 22;
- npm.

Instale as dependências:

```bash
npm install
```

Crie ou ajuste o arquivo `.env` do frontend:

```env
VITE_API_URL=https://backend-doarcuidar-1.onrender.com
```

`VITE_API_URL` é a única configuração necessária para apontar o frontend para a API. Não adicione URLs, chaves ou credenciais do Supabase aos arquivos de ambiente do frontend.

Quando `VITE_API_URL` não está definida, a aplicação utiliza `https://backend-doarcuidar-1.onrender.com` como endereço padrão.

## Execução local

```bash
npm run dev
```

Por padrão: `http://localhost:5173`.

Comandos de qualidade e produção:

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Produção

O frontend atual é uma aplicação estática hospedada no Cloudflare Workers:

https://doarcuidar-web.viviany-oliveira.workers.dev

O build é gerado pelo Vite no diretório `dist` com `npm run build`.

A API FastAPI está hospedada no Render:

https://backend-doarcuidar-1.onrender.com

## Estrutura principal

```text
DoarCuidar-web/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- hooks/
|   |-- pages/
|   |-- routes/
|   |-- services/
|   |-- testes/
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
`-- vite.config.js
```

## Segurança

- O navegador se comunica com o backend FastAPI, não diretamente com o Supabase.
- Credenciais privilegiadas permanecem exclusivamente no backend.
- O recovery access token é temporário, mantido apenas em memória e removido da URL.
- Exemplos de configuração não contêm chaves, tokens, senhas ou segredos reais.
- Rotas que exigem autenticação utilizam proteção no frontend e validação pelo backend.

## Acessibilidade

A interface utiliza HTML semântico, labels, atributos ARIA, navegação por teclado, gerenciamento de foco em menus e modais, contraste visual e layouts responsivos.

## Autores

- Fábio;
- Ingrid;
- Jessica;
- Jose Edson Rodrigues;
- Keven;
- Viviane Oliveira Soares.
