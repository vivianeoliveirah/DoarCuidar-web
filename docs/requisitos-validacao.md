# Validacao de requisitos

| Requisito | Status | Evidencia no projeto |
| --- | --- | --- |
| Framework web | Atendido | React + Vite em `package.json`, `src/main.jsx` e `vite.config.js`. |
| Backend | Fora deste repositorio | O frontend consome a API remota configurada por `VITE_API_URL`. |
| Banco de dados | Fora deste repositorio | O frontend nao acessa banco diretamente nem usa chaves Supabase. |
| JavaScript | Atendido | Codigo em JavaScript/JSX em `src/`. |
| Nuvem | Atendido | Frontend preparado para Netlify via `VITE_API_URL`. |
| Acessibilidade | Parcialmente atendido | Uso de HTML semantico, `aria-label`, foco visivel, labels e componentes reutilizaveis. |
| Controle de versao | Atendido | Repositorio Git com historico e workflows. |
| Integracao continua | Atendido | GitHub Actions em `.github/workflows/ci.yml` executando lint, testes e build. |
| Testes | Parcialmente atendido | Vitest configurado e testes em `src/testes/`. |
| Uso/fornecimento de API | Atendido | Frontend consome a API remota centralizada em `src/services/api.js` e `src/services/authService.js`. |
| Analise de dados | Atendido | Dashboard com metricas de cobertura, qualidade dos dados, areas de atuacao e apoios registrados. |
| IoT | Nao atendido / nao aplicavel | Nao ha integracao com sensores, dispositivos ou telemetria fisica no escopo atual. |

## Observacoes

O DoarCuidar Web nao processa pagamentos. O fluxo atual ajuda a buscar instituicoes por nome, CNPJ e estado, visualizar detalhes e acessar canais oficiais.
