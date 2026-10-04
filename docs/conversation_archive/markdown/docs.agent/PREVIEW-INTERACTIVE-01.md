# Whilo — Preview interativo 01

## Objetivo

A Vercel publica o PWA estático sem backend. Para que o produto seja avaliável antes de conectar as quatro plataformas, o web export agora entra automaticamente em **Preview mode** quando `EXPO_PUBLIC_API_URL` não existe.

## Interações demonstráveis

| Área | O que funciona no Preview |
|---|---|
| Overview | KPI cards, command center, plano do dia e review de compra |
| Inbox | Lista agrupada por decisão/insight/travel com abertura interativa |
| Tasks | Busca, criação, estados Ready/Waiting/Done e abertura de tarefa |
| Trips | Comparação, itinerário, preço, origem e handoff sem booking |
| Automations | Toggle, pausa, retomada, frequência e quiet hours |
| Approval | Drawer com merchant, total, destino e grant one-shot explícito |
| Navegação | Sidebar persistente entre as cinco superfícies |
| Feedback | Toasts de ações e estados seguros |

## Modos

- **Preview:** visual e interações locais, sem fingir que uma API externa foi chamada.
- **Connected:** se `EXPO_PUBLIC_API_URL` existir, o fluxo original de sessão, CopilotKit e workspace continua ativo.

## Preview Vercel

O build estático usa `vercel.json`, serve `apps/mobile/dist/web` e mantém backend/worker/computer/documentação fora do upload via `.vercelignore`. A rota `/manus-routes.json` descreve as superfícies públicas do preview.

## Limites honestos

O Preview não envia email, não cobra cartão, não faz booking e não executa browser actions. Essas ações aparecem como revisão e handoff, exatamente para não simular efeitos externos.
