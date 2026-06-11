# Totem IA — Sistema de Onboarding Inteligente

Assistente virtual acolhedor para onboarding de colaboradores, com análise de sentimento, chat IA e check-in emocional.

## Estrutura

```
totem-ia/
├── backend/          # API Express + PostgreSQL + IA Engine
├── frontend/         # React + Vite + Tailwind + Framer Motion
└── figma-plugin/     # Plugin Figma (integração com a API)
```

## 3 Páginas (Frontend)

1. **Home** — Boas-vindas, iniciar conversa ou check-in rápido
2. **Chat IA** — Chat interativo com análise de sentimento (normal/atenção/crítico)
3. **Check-in** — Check-in emocional com emojis, modo confidencial e escalonamento

## Backend — Endpoints

- `POST /api/users` — Criar usuário
- `GET /api/users` — Listar usuários
- `PATCH /api/users/:id/phase` — Atualizar fase de onboarding
- `POST /api/messages` — Enviar mensagem (com análise de sentimento)
- `GET /api/messages/:userId` — Histórico de mensagens
- `POST /api/checkins` — Criar check-in emocional
- `GET /api/checkins/:userId` — Histórico de check-ins
- `GET /api/escalations` — Listar escalonamentos
- `PATCH /api/escalations/:id/resolve` — Resolver escalonamento
- `GET /api/escalations/dashboard` — Estatísticas do dashboard RH

## Como Rodar

### Backend

```bash
cd backend
npm install
npm run dev   # http://localhost:3001
```

Requer PostgreSQL rodando localmente. Configure as variáveis de ambiente:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `OPENAI_API_KEY` (opcional — fallback para respostas mock)

### Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

### Figma Plugin

```bash
cd figma-plugin
npm install
```

Carregue no Figma via "Import plugin from manifest" apontando para `figma-plugin/manifest.json`.

## IA Engine

- Classificação de sentimento baseada em palavras-chave (português)
- OpenAI opcional para respostas mais naturais
- Fallback automático para respostas mock quando OpenAI não configurado
- Escalonamento automático para RH em estado crítico

## RH System

- Logs de escalonamento com nível de risco
- Atualização automática de status do colaborador
- Endpoints dashboard-ready para integração com sistemas de RH
