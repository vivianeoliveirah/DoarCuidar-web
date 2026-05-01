# Validação de requisitos

| Requisito | Status | Evidência no projeto |
| --- | --- | --- |
| Framework web | Atendido | React + Vite em `package.json`, `src/main.jsx` e `vite.config.js`. |
| Banco de dados | Atendido no escopo do produto | Backend configurado para API remota e documentação indicando PostgreSQL/Supabase. O frontend consome dados via `VITE_API_URL`. |
| JavaScript | Atendido | Código em JavaScript/JSX em `src/`. |
| Nuvem | Atendido | Frontend preparado para deploy e backend em Render (`VITE_API_URL=https://backend-doarcuidar.onrender.com`). |
| Acessibilidade | Parcialmente atendido | Uso de HTML semântico, `aria-label`, foco visível, labels e componentes reutilizáveis. Ainda cabem testes automatizados de acessibilidade. |
| Controle de versão | Atendido | Repositório Git com histórico e workflows. |
| Integração contínua | Atendido | GitHub Actions em `.github/workflows/ci.yml` executando lint, testes e build. |
| Testes | Parcialmente atendido | Vitest configurado e teste básico em `src/testes/basic.test.js`. Ainda faltam testes de componentes e fluxos principais. |
| Uso/fornecimento de API | Atendido | Consumo da API do backend em `src/services/api.js` e APIs públicas de CNPJ em `src/services/cnpjService.js`. |
| Análise de dados | Atendido | Dashboard com métricas de cobertura, qualidade dos dados, áreas de atuação e apoios registrados. |
| IoT | Não atendido / não aplicável | Não há integração com sensores, dispositivos ou telemetria física no escopo atual do DoarCuidar Web. |

## Observações

O DoarCuidar Web não processa pagamentos. O fluxo atual ajuda a buscar instituições por nome, CNPJ e estado, visualizar detalhes e acessar canais oficiais. Apoios registrados no sistema são acompanhamento interno, não confirmação de transação financeira.
