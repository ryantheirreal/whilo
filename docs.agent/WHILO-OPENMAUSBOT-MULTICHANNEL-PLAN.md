# Whilo sobre OpenMausBot — plano técnico multicanal

**Status:** planejamento aprovado para execução posterior.

**Escopo desta entrega:** documentação e decisões de arquitetura. Nenhum código de produção foi substituído nesta etapa.

## Resumo executivo

O OpenMausBot é uma base mais adequada para o formato de produto que o Whilo quer: múltiplos agentes apresentados como contatos, cada bot com modelo, computador, apps, memória, rotinas e aprovações. O caminho recomendado não é fazer um merge superficial entre os dois projetos.

A estratégia é:

> **adotar o OpenMausBot como nova camada de runtime e shell multicanal; reconstruir o Whilo como produto, política, identidade, commerce e billing sobre essa base.**

O OpenMausBot deve fornecer o “sistema nervoso” de agentes. O Whilo deve fornecer a camada que o torna confiável, premium, comercializável e governado.

## Estado confirmado em 09/10/2026

O checkout local do Whilo ainda apresenta:

- `openbot` como submódulo em `v0.1.0`;
- remote `origin` apontando para `ryantheirreal/whilo`;
- remote `upstream` apontando para `CopilotKit/openmuse`;
- nenhuma pasta, submódulo ou remote `OpenMausBot`;
- documentação e UI do Whilo já construídas sobre o stack anterior;
- plano S+ existente, mas ActionKernel ainda não intercepta automaticamente todos os executores legados.

**Conclusão:** o OpenMausBot não está “on” dentro do Whilo nesta workspace. O fork pode existir na conta do usuário, mas ainda precisa ser conectado, auditado e escolhido como base através de um PR/migração explícita.

## Decisão arquitetural

### O que vem do OpenMausBot

- Shell de chat com bots tratados como contatos.
- Lista/sidebar de agentes e threads.
- Harness local para processos de agentes.
- Normalização de eventos de providers/CLIs.
- Model picker e BYO-agent/BYO-model.
- Computer panel e desktop takeover.
- Approval/question cards inline.
- Conectores via OAuth e app marketplace.
- Routines e jobs agendados.
- Desktop companion para macOS/Windows/Linux.
- Mobile companion para acompanhamento e aprovação.
- Cloud mode para agents sempre ativos.
- Templates/teams/marketplace de bots.

### O que continua sendo Whilo

- Marca, orca, assets, copy e sistema visual próprio.
- `ActionKernel` como único caminho de side effect.
- Grants, claims, idempotência, budgets e approval gates.
- Commerce: quotes, cart, checkout, payment intent, refund e reconciliation.
- Travel: comparação, itinerário, alteração e recuperação.
- Stripe, pagamentos e billing Whilo.
- Supabase/Postgres, tenant model, RLS e storage privado.
- Cloudflare ingress, queues, webhooks assinados e DLQ.
- Receipts verificáveis, audit export e outcome unknown.
- Spaces, Pages, Missions e Handoffs como entidades Whilo.
- SLOs, métricas, observabilidade e suporte operacional.
- Modelo de assinatura, compute credits e virtual computers Whilo.

### O que não deve ser importado diretamente

- Identidade/marca do OpenMausBot.
- Mascotes, logos ou copy do upstream.
- Provider bypass que não passe no ActionKernel.
- Secrets locais como fonte de verdade cloud.
- Modelo de aprovação que não inclua payload hash, ator, escopo e validade.
- Feature flags que anunciem capacidades não conectadas.
- Qualquer armazenamento local como substituto permanente de tenant/RLS.

## Arquitetura alvo

```text
                         ┌───────────────────────────┐
                         │ Whilo Web / PWA            │
                         │ Threads · Commerce · Pages │
                         └─────────────┬─────────────┘
                                       │ AG-UI / SSE / WebSocket
                         ┌─────────────▼─────────────┐
                         │ Whilo Mobile Companion     │
                         │ Voice · approvals · status │
                         └─────────────┬─────────────┘
                                       │ signed device session
                         ┌─────────────▼─────────────┐
                         │ Whilo Desktop Companion     │
                         │ local agents · takeover     │
                         └─────────────┬─────────────┘
                                       │
                 ┌─────────────────────▼─────────────────────┐
                 │ Whilo Control Plane                        │
                 │ Auth · tenant · ActionKernel · grants     │
                 │ claims · policies · budgets · receipts    │
                 └──────┬──────────────┬──────────────┬───────┘
                        │              │              │
              ┌─────────▼──────┐ ┌─────▼────────┐ ┌───▼─────────────┐
              │ OpenMausBot    │ │ Commerce     │ │ Supabase         │
              │ Harness         │ │ Orchestrator │ │ Postgres/RLS     │
              │ Agents/events   │ │ Stripe/travel│ │ events/artifacts │
              └───────┬─────────┘ └──────────────┘ └─────────────────┘
                      │
          ┌───────────▼───────────┐
          │ Isolated computers     │
          │ cloud VM · local VM    │
          │ browser · file · shell │
          └────────────────────────┘
```

### Princípio de fronteira

O OpenMausBot pode solicitar uma ação, mas **não pode disparar diretamente** uma ação externa do Whilo. Todo pedido precisa virar um `ActionIntent` e passar pelo Control Plane.

```text
OpenMausBot event
  → adapter Whilo
  → ActionIntent
  → policy evaluation
  → grant/approval
  → atomic claim
  → provider dispatch
  → reconciliation
  → signed receipt
  → thread event
```

## Contratos de integração

### Agent adapter

Criar uma camada `openmausbot-adapter` que converta o evento do harness para um contrato Whilo estável:

```ts
type WhiloAgentEvent = {
  tenantId: string;
  workspaceId: string;
  agentId: string;
  threadId: string;
  runId: string;
  invocationId: string;
  source: "openmausbot-local" | "openmausbot-cloud";
  type: "message" | "thinking" | "tool_intent" | "question" | "approval" | "artifact" | "status";
  payload: unknown;
  occurredAt: string;
  providerEventId: string;
  signature?: string;
};
```

### ActionIntent

```ts
type ActionIntent = {
  actionId: string;
  tenantId: string;
  actorId: string;
  agentId: string;
  threadId: string;
  runId: string;
  tool: string;
  risk: "read" | "prepare" | "external" | "destructive";
  target: string;
  requestHash: string;
  policyVersion: string;
  expiresAt: string;
  estimatedCost?: number;
  requiresApproval: boolean;
};
```

### Commerce contracts

O OpenMausBot pode pesquisar e preparar, mas o Whilo controla os estados:

```text
quote.proposed
→ quote.compared
→ cart.prepared
→ checkout.review
→ payment.approval
→ payment.claimed
→ provider.dispatch
→ payment.reconciled
→ receipt.verified | outcome_unknown
```

Nenhum bot deve receber diretamente dados de cartão. O máximo permitido é operar uma sessão de checkout isolada e mostrar um `ReviewCard` com merchant, itens, impostos, frete, total, política e expiração.

## Arquitetura multicanal

### Desktop

**Função:** local-first, agentes persistentes, escolha de provider, controle de computador e routines.

Componentes:

- OpenMausBot harness local.
- Whilo desktop shell/companion.
- Device identity com chave armazenada no sistema operacional.
- Local event buffer criptografado.
- Outbox assinado para sincronizar com cloud.
- Approvals que podem ser respondidos no desktop.
- Computer takeover com indicação clara de ownership.
- Modo offline para leitura e preparação, nunca para afirmar sucesso externo.

### Mobile

**Função:** acompanhar, falar, aprovar, parar e revisar.

Componentes:

- Lista de agents como conversas/pets.
- Push notifications para approval, failure e outcome_unknown.
- Voice call e captions.
- Activity View resumida.
- Review cards com ações grandes.
- Deep link para thread/run/approval.
- Biometria/re-auth para ações sensíveis.
- Sem armazenamento de secrets de provider.

### Cloud

**Função:** agentes sempre ativos, jobs agendados, webhooks, filas, compute e colaboração.

Componentes:

- Worker de eventos.
- Queue e DLQ.
- Scheduler de routines.
- Supabase/Postgres + RLS.
- Storage privado de artifacts.
- VMs por job ou workspace.
- Provider adapters.
- Reconciliation workers.
- Observabilidade e SLO.

### Sincronização

- `deviceId`, `sessionId`, `tenantId`, `threadId`, `runId` e `eventId` são obrigatórios.
- Eventos são append-only; correções geram novos eventos.
- Outbox local faz retry somente de eventos idempotentes.
- A cloud é autoridade para approvals, claims, billing e receipts.
- Conflitos de mensagens resolvem por event ordering e não por “última tela aberta”.
- Dados privados do local não sobem sem consentimento de escopo.

## Commerce e pagamentos

### Features a preservar e elevar

1. Pesquisa de preço e condições.
2. Comparação de viagens.
3. Itinerário com fontes.
4. Carrinho preparado.
5. Checkout review.
6. Stripe payment intent.
7. Créditos de uso.
8. Assinaturas Whilo.
9. Reembolsos preparados.
10. Reconciliação de provider.
11. Recibos e garantias.
12. Alertas de preço.

### Separação de domínios

```text
OpenMausBot agent intent
  → Whilo Commerce API
  → quote/cart/payment/booking state machine
  → approval gate
  → ActionKernel
  → provider adapter
  → reconciliation
```

O OpenMausBot não deve ser dono de Stripe customer, payment method, billing subscription ou ledger. Ele pode ser um cliente/orquestrador do domínio Commerce.

### Billing do Whilo

- Free: agents limitados, demo e jobs read-only.
- Pro: agents, voice, memória controlável e cota de compute.
- Family: Spaces, roles e privacidade por membro.
- Team: RLS, approvals, audit export, connectors e supervisor.
- Cloud/Compute: job VM, persistent VM e team pool.
- Marketplace: templates/agents com revisão e revenue share futuro.

Mostrar sempre:

- custo estimado;
- cota incluída;
- consumo atual;
- teto configurado;
- custo de VM/model/provider;
- ação para interromper.

## Plano de migração em fases

### Fase 0 — decisão e freeze

- Criar branch de integração separada.
- Registrar commit/tag exato do OpenMausBot escolhido.
- Conferir Apache-2.0, NOTICE, third-party notices e dependências.
- Não apagar `openbot` ainda.
- Criar matriz OpenMausBot → Whilo.
- Congelar nomes de entidades e eventos.
- Fazer backup do estado atual e de screenshots.

**Gate:** o checkout atual continua buildável e o novo fork ainda não é publicado como produção.

### Fase 1 — importar o shell OpenMausBot

- Adicionar o fork como submodule ou subtree conforme decisão de manutenção.
- Compilar desktop/web do OpenMausBot sem customização de marca.
- Rodar testes upstream.
- Registrar pontos de entrada de agents, event bus, computer, apps, routines e storage.
- Mapear o harness para `WhiloAgentEvent`.
- Criar uma tela de diagnóstico, não pública.

**Gate:** um agent local pode emitir mensagem, thinking, tool intent, approval e result no adapter.

### Fase 2 — substituir a identidade

- Criar `WhiloWordmark`, `WhiloAppIcon`, `WhiloAvatar` e `AgentAvatar`.
- Remover referências visuais não autorizadas do upstream das superfícies Whilo.
- Migrar tokens para semantic colors.
- Localizar copy em pt-BR.
- Implementar sidebar de pets/threads com tokens Whilo.
- Preservar a forma de chat do OpenMausBot, não seus assets.

**Gate:** desktop, mobile e web mostram Whilo de ponta a ponta e nenhum asset upstream aparece em runtime.

### Fase 3 — colocar o Control Plane no caminho

- Toda `tool_intent` vira `ActionIntent`.
- Mapear permission broker do OpenMausBot para grants Whilo.
- Inserir `requestHash`, `policyVersion`, `actorId` e `expiresAt`.
- Adicionar claims one-shot.
- Persistir approval event antes do dispatch.
- Bloquear dispatch direto de providers não adaptados.

**Gate:** zero side effect de browser, file, shell, connector, payment ou booking fora do ActionKernel.

### Fase 4 — conectar cloud e Supabase

- Criar migrations para tenants, devices, agents, threads, events, runs, approvals, receipts, connectors, artifacts e usage.
- Habilitar RLS cross-tenant.
- Criar event ingestion idempotente.
- Criar outbox/inbox e DLQ.
- Assinar eventos desktop → cloud.
- Adicionar reconnect e replay seguro.

**Gate:** mesma thread abre no desktop, web e mobile com estados consistentes.

### Fase 5 — commerce e billing

- Reintegrar Stripe somente pelo adapter Whilo.
- Migrar quote/cart/payment/booking/refund state machines.
- Implementar credits e usage ledger.
- Approval cards em todas as ações external/destructive.
- Reconciliation de timeout e provider drift.
- Testar charge duplication e replay.

**Gate:** sandbox de pagamento demonstra preparar, aprovar, claim, dispatch, reconcile e receipt; nunca cobra silenciosamente.

### Fase 6 — virtual computers e routines

- Mapear computer panel para `JobVM` Whilo.
- Mostrar allowlist, custo, TTL, snapshot e Stop.
- Routines geram intents com policy check antes de iniciar.
- Rotinas de pagamento/booking nunca executam sem regra de aprovação válida.
- Criar scheduler cloud e modo local.

**Gate:** job VM efêmero completa uma tarefa read-only e encerra com receipt verificável.

### Fase 7 — voice e companion

- Voice mobile/desktop usa a mesma thread.
- Captions e transcript viram eventos.
- Voice approval exige re-auth quando risco é external/destructive.
- Push para approval, failure e unknown.
- Desktop takeover emite ownership state.

**Gate:** uma chamada inicia um job read-only, mostra progresso e entrega resultado na thread.

### Fase 8 — release progressivo

- Dogfood interno.
- Preview privado com feature flags.
- Beta por convite.
- Migração de dados opt-in.
- Canary desktop/cloud.
- Rollback para shell antigo.
- Publicação após gates de segurança e custo.

## Matriz de risco

| Risco | Mitigação |
|---|---|
| Fork muda rapidamente e quebra integração | Fixar commit/tag, adapter próprio e contract tests. |
| Licença/NOTICE incompletos | SBOM, license scan e notices no CI. |
| Harness local bypassa policy cloud | Não permitir provider dispatch direto; adapter obrigatório. |
| Secrets locais vazam na sincronização | Redaction, device scopes e write-only secret storage. |
| Billing duplicado | Idempotency key, ledger e reconciliation. |
| VM custa mais que assinatura | Budgets, estimates, TTL e hard stop. |
| UX parece clone de Grok/WhatsApp | Tokens, assets, copy e layout próprios; usar apenas modelo mental. |
| Muitos agents confundem novos usuários | Templates por dor, router explicável e onboarding progressivo. |
| Offline mostra sucesso falso | Estados `pending`, `queued`, `unknown` e nunca `succeeded` sem receipt. |
| Mobile vira apenas espelho passivo | Push, voice, approve, stop e deep links de job. |
| OpenMausBot não suporta contrato necessário | Isolar capability, criar fallback seguro e não prometer no registry. |

## Critérios de pronto multicanal

### Desktop

- [ ] Agentes locais persistem e aparecem como threads.
- [ ] Computer takeover mostra ownership.
- [ ] Approval funciona offline somente como fila, não como execução.
- [ ] Outbox assinado sincroniza sem duplicar.

### Mobile

- [ ] Threads, approvals, activity e receipts são navegáveis.
- [ ] Voice mostra captions e gera eventos.
- [ ] Re-auth protege ações de alto risco.
- [ ] Push contém deep link sem vazar payload sensível.

### Cloud

- [ ] RLS e tenant isolation testados.
- [ ] Jobs agendados têm budgets e policy evaluation.
- [ ] Webhooks são assinados e replay-protected.
- [ ] VM e provider states têm reconciliation.

### Commerce

- [ ] Quote/cart/payment/booking/refund têm estados tipados.
- [ ] Nenhum cartão ou payment secret entra no prompt.
- [ ] Compra, pagamento e booking sempre têm aprovação humana quando configurado.
- [ ] Receipt contém provider reference redigida e resultado verificável.

## Plano de posts para Instagram — próxima etapa

Depois que o plano técnico for aceito, criar posts baseados em screenshots e demos reais, sem anunciar capacidades ainda não conectadas.

### Pilares

1. **“Seus agentes como contatos”** — sidebar de pets e threads.
2. **“Fale, revise, aprove”** — voice call e approval card.
3. **“Um computador para cada job”** — VM, allowlist, Stop e receipt.
4. **“Compras sem clique escondido”** — quote, cart, review e payment approval.
5. **“Viagens sem abrir 20 abas”** — comparação e recuperação.
6. **“Local quando você quer, cloud quando precisa”** — desktop/mobile/cloud.
7. **“Open-source por baixo, Whilo por cima”** — transparência sem confundir upstream com produto.
8. **“A IA que mostra o que fez”** — activity timeline e evidências.

### Primeiros formatos

- Carrossel de 7 slides: “O que acontece quando cada agente vira uma conversa?”
- Reel de 15 segundos: “Whilo prepara. Você aprova.”
- Reel de 30 segundos: “Do áudio ao job com receipt.”
- Story poll: “Você deixaria um agente comprar sem aprovação?”
- Post técnico: “Desktop, mobile e cloud na mesma thread.”
- Carrossel: “Por que o computador virtual tem Stop.”

**Regra:** posts só devem usar screenshots do modo efetivamente disponível ou dados sintéticos claramente marcados como demo.

## Cinco recomendações pós-output

### 1. P0 — conectar o fork em branch de integração, não substituir main diretamente

**Problema:** OpenMausBot ainda não está no checkout atual.

**Ação:** fixar commit/tag do fork, criar branch de integração e preservar o shell atual até passar os gates.

**Critério de aceite:** build atual continua reproduzível e o fork compila isoladamente com evidência de versão.

**Risco/benefício:** reduz velocidade inicial, mas torna rollback possível.

### 2. P0 — escrever o adapter de eventos antes de migrar UI

**Problema:** copiar a aparência sem contrato de eventos criaria uma demo desconectada.

**Ação:** implementar `WhiloAgentEvent` e contract tests para message, tool intent, approval, result e failure.

**Critério de aceite:** um agent OpenMausBot pode atravessar a thread Whilo sem perder runId, actor, tenant ou status.

**Risco/benefício:** trabalho de integração invisível, mas é a base do multicanal real.

### 3. P0 — colocar commerce atrás do ActionKernel

**Problema:** compra/pagamento/booking são os efeitos mais sensíveis da nova plataforma.

**Ação:** adaptar Stripe, travel e checkout para `ActionIntent → approval → claim → dispatch → reconcile`.

**Critério de aceite:** sandbox registra uma única cobrança/booking por request e produz receipt.

**Risco/benefício:** evita duplicidade financeira e sustenta a proposta premium.

### 4. P1 — definir o produto em três canais com responsabilidades diferentes

**Problema:** desktop, mobile e cloud podem virar três experiências desconectadas.

**Ação:** desktop executa/assume controle, mobile aprova/fala/para, cloud agenda/sincroniza/reconcilia.

**Critério de aceite:** um job iniciado em um canal aparece com o mesmo estado nos outros dois.

**Risco/benefício:** arquitetura clara reduz duplicação e melhora a narrativa de produto.

### 5. P1 — só produzir anúncios depois dos golden paths

**Problema:** posts podem prometer agentes, VMs ou pagamentos que ainda são apenas preview.

**Ação:** fechar três demos verificáveis: inbox, viagem e computer job; depois criar screenshots e Reels.

**Critério de aceite:** cada post aponta para uma interação que o usuário pode testar e tem label de demo quando necessário.

**Risco/benefício:** menor velocidade de conteúdo, porém mais confiança e menor risco reputacional.
