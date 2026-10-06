# Whilo — plano mestre para execução pelo Claude

**Escopo desta entrega:** somente planejamento. Nenhum código de produção deve ser alterado a partir deste documento.

**Objetivo:** elevar a experiência do Whilo para uma interface premium de agente pessoal com:

- conversas organizadas por agente;
- ícones/avatares de pets como entrada de cada thread;
- sidebar no modelo mental de mensageria;
- itens de navegação, tarefas e estados acima/abaixo dos agentes;
- barra de agente/contexto no topo da conversa;
- Activity View, approvals e receipts integrados à mesma thread;
- base visual própria do Whilo, inspirada em padrões de chat e agent UX, sem clonar Grok, WhatsApp, Dots, Muse ou qualquer produto proprietário.

> **Regra de produto:** a referência é o modelo mental “cada agente é uma conversa viva”. A marca, a orca Whilo, os assets, os textos, o espaçamento, as cores e os componentes devem continuar sendo próprios do Whilo.

---

## 1. Leitura dos commits atuais

### Baseline confirmado

Branch: `main` sincronizada com `origin/main`.

Últimos commits relevantes:

| Commit | Entrega observada | Estado atual |
|---|---|---|
| `24005d6` | 100 itens, mapa S+ e playbook de crescimento | Documentação forte; ainda não ligada à navegação real. |
| `26d6e99` | Image board e catálogo inicial de 50 itens | Referências disponíveis, sem contrato visual executável. |
| `7c10e5b` | Arquivo de conversa e pesquisa UI | Histórico preservado. |
| `88bbed6` | Unificação de padrões premium de conversa | Base de cards e conversa melhorada. |
| `9a3a7be` | Login e mascote central | Identidade visível, mas asset/role ainda precisam de contrato. |
| `f08036b` | Mobile preview com agentes como conversas | Base funcional de 927 linhas em `mobile-preview.tsx`. |
| `36b956a` | Preview interativo da Vercel | Shell demonstrável, ainda com dados locais/simulados. |
| `9a887f5` | Fundamentos do S+ Control Plane | Governança existe como fundação, ainda não intercepta todo executor legado. |

### O que já existe em `mobile-preview.tsx`

- `Agent` com `id`, `name`, `role`, `tone`, `last`, `unread`, `avatar`.
- Quatro agentes demonstrativos: Whilo, Atlas, Milo e Scout.
- `Session` separada de `Agent`.
- Criação de nova conversa.
- Drawer de sessões.
- Picker de agentes.
- Cabeçalho com mascote, nome, status online, chamada e menu.
- Cards para email, viagem e compra.
- Review sheet com gate humano.
- Call sheet.
- Fila de mensagens, estado thinking e stop.

### Gaps reais que o Claude deve resolver

1. O drawer abre como modal, mas não funciona como **sidebar persistente** em desktop/tablet.
2. O agente e a sessão são entidades diferentes, porém a navegação não deixa essa hierarquia clara.
3. O ícone/avatar não tem ainda uma família real de pets/agentes: `Mascot` reutiliza o asset principal e os variants atualmente não diferenciam a paleta.
4. A lista de agentes não mostra atividade viva, prioridade, tarefa pendente, último resultado ou estado de execução de forma consistente.
5. O usuário não tem uma área persistente para `Inbox`, `Tasks`, `Activity`, `Spaces`, `Approvals` e `Settings` acima/abaixo dos agentes.
6. Sessions são estado local; não existe modelo persistido de `thread`, `agent`, `unread`, `lastEvent`, `approval` e `receipt`.
7. O header centralizado é bom para mobile, mas não vira uma barra de contexto equivalente em desktop.
8. O preview usa respostas locais baseadas em substring; não representa um runtime conectado.
9. `ReviewSheet` registra aprovação visual, mas a UI não exibe uma máquina de estados universal `proposed → approved → claimed → executing → succeeded|failed|outcome_unknown`.
10. Há mistura de inglês e português, além de defaults técnicos antigos (`O1`) em outras superfícies.
11. O design system ainda tem hex inline, tokens não semânticos, estados incompletos e avatar/wordmark/icon não separados.
12. A direção visual precisa ser “calma + premium + legível”, não um console cheio de widgets.

---

## 2. Visão-alvo da interface

### 2.1 Layout principal responsivo

#### Desktop, a partir de 1024 px

```text
┌──────────────────────────────────────────────────────────────────┐
│ Whilo brand        Search / command        Voice  Help  Profile  │
├───────────────┬──────────────────────────┬───────────────────────┤
│ PRIMARY NAV   │ THREAD HEADER            │ CONTEXT / ACTIVITY    │
│ Home          │ pet avatar + agent name  │ status / sources       │
│ Activity      │ role + state + controls  │ current run            │
│ Approvals  3  ├──────────────────────────┤ approvals              │
│ Spaces        │ conversation timeline    │ receipts               │
│───────────────│ bubbles, tool cards,     │ artifacts              │
│ AGENT THREADS │ evidence, approval      │                       │
│ ◉ Whilo       │ cards and receipts       │                       │
│ ◉ Atlas   2   │                          │                       │
│ ◉ Milo    1   │                          │                       │
│ ◉ Scout       ├──────────────────────────┤                       │
│ + New agent   │ composer + voice + send  │                       │
│───────────────│                          │                       │
│ account       │                          │                       │
└───────────────┴──────────────────────────┴───────────────────────┘
```

**Regra:** o painel direito é contextual e pode ser recolhido. Nunca pode comprimir a conversa a ponto de impedir a leitura ou a ação principal.

#### Tablet, 600–1023 px

- Sidebar reduzida para rail de ícones com tooltip/label acessível.
- Lista de threads abre em sheet lateral.
- Context panel vira sheet ou aba `Activity`.
- Thread header continua fixo.

#### Mobile, até 599 px

- Um único painel de conversa.
- Top bar com botão de sidebar, avatar + nome do agente e chamada.
- Sidebar abre como drawer full-height.
- `Activity`, `Approvals` e `Artifacts` abrem como bottom sheet.
- Composer permanece ancorado e não deve perder o draft.

### 2.2 Estrutura da sidebar

A sidebar deve ter cinco blocos, nesta ordem:

1. **Brand / account**
   - App icon separado do avatar.
   - Workspace atual.
   - Alternância pessoal/equipe somente se o usuário tiver mais de um contexto.

2. **Navegação global**
   - `Home` — resumo curto e próximos jobs.
   - `Activity` — todas as execuções, filtros e falhas.
   - `Approvals` — ações esperando aprovação, com badge numérico.
   - `Spaces` — Pages, documentos, fontes e artefatos.

3. **Agent threads**
   - Cada pet/agent é uma linha de conversa.
   - Avatar circular próprio, nome, role curta e último evento.
   - Badge de unread ou aprovação pendente.
   - Estado textual ou ícone: `online`, `working`, `waiting`, `paused`, `offline`, `done`.
   - Preview de uma linha truncado com tooltip/accessible label.
   - Ordenação: aprovação pendente primeiro, depois trabalhando, depois atividade recente.

4. **Ações secundárias**
   - `New conversation`.
   - `Create agent`.
   - `Connect apps`.
   - `Search threads`.

5. **Conta e segurança**
   - Memory.
   - Permissions.
   - Usage/compute.
   - Settings.
   - Lock/logout.

### 2.3 Pet threads

“Pet” é uma metáfora de presença e personalidade, não uma desculpa para inventar identidades incoerentes.

Cada pet/agent deve ter:

- avatar Whilo-compatible, sem reutilizar o wordmark como imagem minúscula;
- nome, função e descrição de uma frase;
- cor/tint semântica derivada de tokens, não cores arbitrárias;
- estados universais;
- capabilities declaradas;
- connectors disponíveis;
- permissões e autonomia visíveis;
- último resultado e próximo passo;
- botão de mute/archive;
- ação `open thread` como ação primária;
- ação `new thread` como ação secundária.

#### Família inicial recomendada

| Agent | Papel | Pet/avatar | Tom | Primeira tarefa demonstrável |
|---|---|---|---|---|
| Whilo | Orquestrador pessoal | Orca Whilo oficial | Calmo, protetor | “Organize meu dia e diga o próximo passo.” |
| Atlas | Viagem | Avatar derivado da marca, não animal de terceiros | Explorador, objetivo | “Compare Lisboa com preço, bagagem e cancelamento.” |
| Milo | Inbox | Avatar derivado da marca | Conciso, cuidadoso | “Separe o que exige resposta e prepare drafts.” |
| Scout | Pesquisa | Avatar derivado da marca | Curioso, baseado em evidências | “Pesquise e entregue fontes em uma Page.” |
| Ledger | Vida financeira administrativa | Avatar derivado da marca | Preciso, não consultivo | “Liste recibos e assinaturas para revisar.” |
| Studio | Conteúdo | Avatar derivado da marca | Criativo, iterativo | “Transforme esta ideia em roteiro e variações.” |

**Não fazer:** usar capivara do OpenMuse, personagens de Dots, pets do Grok ou mascotes de terceiros como assets do Whilo. Criar variantes próprias ou usar o símbolo Whilo com tags, mantendo a coerência.

### 2.4 Itens acima e abaixo dos ícones

O pedido “itens acima ou abaixo dos ícones” deve virar uma hierarquia explícita:

**Acima dos agentes:**

- `Approvals` com badge;
- `Working now` com indicador vivo;
- `Activity` com filtros;
- `Search` para localizar thread, artefato ou receipt.

**Abaixo dos agentes:**

- `New conversation`;
- `Create an agent`;
- `Spaces`/`Pages` recentes;
- `Connected apps`;
- `Usage & virtual computer`;
- `Settings`.

A ordem não pode ser apenas decorativa: cada item deve ter rota, estado de loading, empty, error, offline e analytics event.

---

## 3. Modelo de informação a implementar

O Claude deve separar as seguintes entidades. Não usar `Agent` como substituto de `Thread`.

```ts
type Agent = {
  id: string;
  slug: string;
  displayName: string;
  role: string;
  avatarKey: string;
  accentToken: string;
  capabilities: Capability[];
  status: AgentStatus;
  lastEventAt: string;
};

type Thread = {
  id: string;
  tenantId: string;
  agentId: string;
  title: string;
  preview: string;
  unreadCount: number;
  priority: "normal" | "high" | "approval";
  lastEventAt: string;
  state: ThreadState;
  archivedAt?: string;
};

type ActivityEvent = {
  id: string;
  threadId: string;
  runId?: string;
  type: "message" | "tool" | "approval" | "receipt" | "error" | "status";
  state: RunState;
  createdAt: string;
  redactedSummary: string;
  evidenceIds?: string[];
};
```

Estados mínimos:

```text
Thread: active | archived | muted
Agent: idle | working | waiting_approval | paused | offline | error
Run: proposed | approved | claimed | executing | succeeded | failed | outcome_unknown
Approval: pending | approved | rejected | expired | superseded
Receipt: pending | verified | failed | unknown
```

### Ordenação da thread list

1. `waiting_approval`.
2. `working`.
3. `failed` ou `outcome_unknown` não reconhecido.
4. unread mais recente.
5. `lastEventAt` descendente.

Nunca esconder uma aprovação embaixo de uma conversa antiga.

---

## 4. Componentes a planejar antes das telas

Criar ou especificar no design system, nesta ordem:

1. `BrandLockup`.
2. `WhiloAppIcon`.
3. `WhiloAvatar`.
4. `AgentAvatar`.
5. `AgentStatusBadge`.
6. `SidebarSection`.
7. `GlobalNavItem`.
8. `AgentThreadRow`.
9. `AgentThreadList`.
10. `ThreadHeader`.
11. `ThreadPresence`.
12. `ActivityRail`.
13. `ActivityEventRow`.
14. `UnreadBadge`.
15. `ApprovalBadge`.
16. `ToolResultCard`.
17. `EvidenceRow`.
18. `ReviewCard`.
19. `ReceiptCard`.
20. `RunTimeline`.
21. `SpaceRow`.
22. `CommandSearch`.
23. `ChatComposer`.
24. `VoiceEntryButton`.
25. `Sheet`/`Dialog` com focus trap e retorno de foco.

Cada componente precisa de:

- default;
- hover/focus/pressed/selected/disabled;
- loading;
- erro;
- offline;
- reduced motion;
- texto longo;
- keyboard navigation no Web;
- VoiceOver/TalkBack label;
- target touch de 44 px quando interativo;
- teste de contraste sem depender apenas de cor.

---

## 5. Fluxos de usuário prioritários

### Fluxo A — abrir uma pet thread

1. Usuário abre Whilo.
2. Sidebar carrega sem bloquear a conversa.
3. Agentes aparecem com skeleton e depois estados reais.
4. Usuário toca/clica em Atlas.
5. Thread header mostra avatar, nome, role, estado e capabilities.
6. Timeline carrega mensagens e activity events.
7. Composer mantém draft e foco.
8. Se houver job em andamento, o usuário vê o run, não apenas “thinking”.

**Aceite:** abrir uma thread não cria outra thread silenciosamente; unread é decrementado apenas após renderização/ack apropriado.

### Fluxo B — aprovação dentro da thread

1. Agent prepara uma ação.
2. Tool card mostra alvo, escopo, payload resumido, custo/impacto e validade.
3. `ReviewCard` mostra fontes e mudanças desde o plano.
4. Usuário aprova, rejeita ou pede edição.
5. UI muda de `pending` para `approved`, depois `claimed`, `executing` e receipt.
6. Falha ou timeout vira `failed`/`outcome_unknown`, sem retry silencioso.

**Aceite:** o botão não pode representar “aprovado” antes do evento server-side; duplo clique não gera dois efeitos.

### Fluxo C — voz para pet thread

1. Usuário toca Voice.
2. Header mostra consentimento, status de gravação e saída.
3. Captions aparecem na mesma thread.
4. Agente pode fazer ação read-only sem sair da chamada.
5. Ação externa sempre abre approval card.
6. Ao encerrar, resumo e receipt entram na thread.

### Fluxo D — criar novo agente

1. Usuário escolhe template, não “personalidade mágica”.
2. Define nome, função, fontes e connectors.
3. Define autonomia: pesquisa, preparar, executar após aprovação.
4. Visualiza capabilities e riscos.
5. Cria thread inicial.
6. Agente aparece na sidebar com onboarding state.

**Aceite:** criar agente não concede permissões por padrão.

### Fluxo E — computer virtual

1. Usuário pede tarefa que exige navegador.
2. Whilo propõe `Job VM` com custo estimado, tempo máximo e allowlist.
3. Usuário aprova a criação da sessão.
4. Activity rail mostra domínio atual, arquivos tocados e screenshot/state.
5. Stop interrompe o job.
6. Resultado gera receipt e encerra a VM, salvo plano persistente explícito.

---

## 6. Direção visual

### Adotar

- sidebar limpa com separadores e grupos;
- avatar + último evento como unidade de navegação;
- badges pequenos, porém textuais/acessíveis;
- header da thread com presença e função;
- timeline de trabalho legível;
- cards de review no contexto;
- dark mode opcional somente após tokens semânticos e contraste testado;
- whitespace e ritmo editorial;
- uma CTA principal por superfície;
- animação curta apenas para mudança de estado.

### Evitar

- copiar pixel por pixel Grok, WhatsApp, Muse ou Dots;
- usar pets de terceiros;
- neon/gradientes como substituto de hierarquia;
- colocar cinco CTAs iguais na sidebar;
- transformar cada agente em um “personagem” que promete capacidades inexistentes;
- status indicado apenas pela cor;
- badges numéricos sem significado;
- chat sem evidência da ação;
- “thinking” genérico quando existe um run com etapas;
- painel direito que sempre ocupa espaço mesmo quando não há contexto.

### Contrato de marca

Antes de qualquer implementação visual:

- separar `WhiloWordmark`, `WhiloAppIcon`, `WhiloAvatar` e `Favicon`;
- confirmar a asset final da orca/baleia Whilo;
- marcar `capybara.png` como legado ou remover somente após inventário de consumers;
- não chamar asset de logo de “mascot”;
- definir alt/decorative por contexto;
- manter azul Whilo em tokens semânticos;
- não usar branco sobre azul forte em texto pequeno sem contraste validado.

---

## 7. Plano de execução para o Claude

### Sprint 0 — especificação e inventário

**Não alterar layout ainda.**

- Mapear todos os imports de `Mascot`, `whilo-icon.png`, `whilo-logo.png`, `capybara.png` e referências a OpenMuse/O1.
- Confirmar a fonte de verdade de brand assets.
- Criar mapa de rotas e estados da sidebar.
- Definir schema `Agent`, `Thread`, `ActivityEvent`, `Approval`, `Receipt`.
- Definir tokens semânticos e locale pt-BR.
- Criar screenshots de baseline em 360, 768 e 1440 px.

**Saída:** documento de inventário + decisão de assets, sem regressão funcional.

### Sprint 1 — primitives e identidade

- Implementar tokens semânticos.
- Separar avatar/icon/wordmark.
- Implementar `AgentAvatar`, `StatusBadge`, `UnreadBadge`, `ApprovalBadge`.
- Padronizar Button/IconButton/Sheet/Dialog.
- Remover hex inline dos componentes migrados.
- Corrigir labels, foco, contraste e target sizes.

**Saída:** biblioteca pequena, testável e usada por uma tela piloto.

### Sprint 2 — sidebar desktop e drawer mobile

- Criar `AppNavigation` persistente em desktop.
- Transformar o `SessionDrawer` em `NavigationDrawer` com os cinco blocos.
- Migrar agentes para `AgentThreadRow`.
- Ordenar aprovação/working/unread/recent.
- Adicionar search e `New conversation`.
- Implementar rail tablet e sheet mobile.
- Preservar draft, scroll e seleção ao abrir/fechar navegação.

**Saída:** desktop tem sidebar real; mobile mantém drawer sem perder a conversa.

### Sprint 3 — thread header, timeline e activity

- Separar `ThreadHeader` de `AgentPicker`.
- Mostrar role, status, capabilities e menu seguro.
- Criar timeline de messages + tool + approval + receipt.
- Mostrar `RunTimeline` para jobs longos.
- Adicionar painel contextual recolhível.
- Substituir thinking fake por estados explícitos onde houver runtime.

**Saída:** o usuário entende o que o agente está fazendo e em que ponto está.

### Sprint 4 — approvals e computer use

- Unificar ToolCard/ReviewSheet/TaskCard em `ReviewCard` e `ReceiptCard`.
- Renderizar payload hash/validade/escopo no nível apropriado.
- Mostrar custo e limites de Job VM.
- Integrar Stop, cancel e outcome_unknown.
- Testar concorrência e refresh no meio da aprovação.

**Saída:** nenhum side effect externo é representado como concluído antes do receipt real.

### Sprint 5 — voice e Spaces

- Voice entry no header/composer.
- Captions na thread.
- Resumo da chamada como evento.
- Spaces/Pages como itens globais e artefatos contextuais.
- Handoff entre agentes com evento visível.

**Saída:** voz não cria um segundo produto; ela alimenta a mesma thread.

### Sprint 6 — connected mode e qualidade

- Persistir Agent/Thread/Event/Approval/Receipt.
- Supabase/Postgres + RLS por tenant.
- Streaming de eventos.
- Reconnect/offline e retry seguro.
- Instrumentar TTFJ, open thread, approval conversion e receipt success.
- Testes visuais e de acessibilidade no CI.

**Saída:** a UI não é apenas preview local; cada estado visível tem fonte de verdade.

---

## 8. Contratos de aceitação

### Visual

- [ ] 360 px: composer e drawer não cortam conteúdo.
- [ ] 768 px: rail/drawer funciona sem duplicar navegação.
- [ ] 1024 px: sidebar e conversa cabem sem scroll horizontal.
- [ ] 1440 px: activity panel é útil e recolhível.
- [ ] Nenhum avatar usa wordmark ilegível.
- [ ] Nenhuma marca upstream aparece em superfície ativa.
- [ ] Estados selected, waiting, approval, failed, offline e success têm texto/ícone além da cor.

### Interação

- [ ] Clique no avatar abre a thread correta.
- [ ] Clique no preview abre a thread sem criar thread.
- [ ] `New conversation` cria uma única thread com id único.
- [ ] Busca filtra agentes e threads sem perder contexto.
- [ ] Unread só é alterado por regra explícita.
- [ ] Approval card sobrevive a reload e mostra o mesmo payload.
- [ ] Stop não finge sucesso.
- [ ] Back/escape fecha sheet e devolve foco.

### Segurança e execução

- [ ] Toda ação externa passa pelo ActionKernel.
- [ ] Grant é one-shot quando aplicável.
- [ ] Claim atômico impede duplicação.
- [ ] Timeout pós-dispatch vira `outcome_unknown`.
- [ ] Thread mostra actor, runId e receipt sem vazar segredo.
- [ ] VM mostra allowlist, custo estimado e stop.
- [ ] Nenhuma capability é anunciada sem executor conectado.

### Acessibilidade

- [ ] Keyboard navigation no Web.
- [ ] VoiceOver/TalkBack anunciam nome, role, estado e unread de forma não repetitiva.
- [ ] Contraste WCAG validado para texto comum, foco e status.
- [ ] Texto operacional não depende de 9–10 px.
- [ ] Reduced motion respeitado.
- [ ] Zoom/escala de texto não quebra a sidebar nem os cards.
- [ ] Alvos touch principais permanecem em torno de 44 px.

### Produto

- [ ] Time to First Job mensurado.
- [ ] Primeiro job concluído mede proposta, aprovação e receipt.
- [ ] Usuário consegue explicar por que o agente parou.
- [ ] Usuário consegue cancelar, rejeitar e revisar.
- [ ] Conteúdo de marketing pode usar o modo demo com dados sintéticos.

---

## 9. Métricas de topo

A UI não deve ser otimizada por “parecer mais cheia”. Medir:

1. **TTFJ:** tempo até o primeiro job útil.
2. **Thread activation:** thread aberta que recebe uma intenção válida.
3. **Approval comprehension:** percentual de usuários que entendem alvo, impacto e escopo.
4. **Receipt completion:** ações propostas que chegam a receipt verificável.
5. **Safe stop rate:** facilidade de interromper sem estado ambíguo.
6. **Repeat jobs per agent:** uso recorrente por pet/thread.
7. **Sidebar discovery:** descoberta de Activity, Spaces, Approvals e connectors.
8. **Virtual computer conversion:** job que realmente precisa de VM versus custo gasto.
9. **Invite activation:** membro convidado que conclui primeiro job.
10. **Trust retention:** retorno semanal associado a resultado concluído, não a mensagens.

---

## 10. Conteúdo e anúncios derivados da nova UI

O Claude deve criar um modo demo com dados sintéticos para os seguintes vídeos:

1. “Escolhi um pet e ele não escondeu o que ia fazer.”
2. “A sidebar encontrou minha aprovação antes que eu esquecesse.”
3. “Cada agente é uma conversa; cada ação deixa um receipt.”
4. “Falei com o Whilo e o resultado caiu na mesma thread.”
5. “O computador virtual mostrou exatamente onde estava navegando.”
6. “Um job pendente não se escondeu atrás de um spinner.”
7. “Troquei de agente sem perder meu contexto.”
8. “Minha família viu a tarefa compartilhada, não minhas conversas privadas.”
9. “O agente falhou de forma legível e não tentou de novo escondido.”
10. “O botão Stop é parte do design, não uma emergência escondida.”

Todo vídeo deve mostrar pelo menos um controle real de confiança e usar dados sintéticos.

---

## 11. Riscos e decisões que não podem ser adiadas

| Risco | Decisão exigida |
|---|---|
| A interface parecer cópia do Grok/WhatsApp | Usar o modelo mental de threads, mas criar tokens, assets, nomenclatura e layout próprios. |
| Muitos pets fragmentarem a marca | Usar família de avatares Whilo-compatible; um símbolo principal e papéis claros. |
| Sidebar virar console corporativo | Priorizar Home, Activity, Approvals, Spaces e threads; esconder complexidade contextual. |
| Badge gerar ansiedade | Mostrar significado textual e permitir quiet hours/mute. |
| Preview prometer execução real | Diferenciar demo, connected e blocked states no texto e no estado visual. |
| Compute caro e invisível | Mostrar custo estimado, tempo, limites e stop antes de criar VM. |
| Voice virar fluxo paralelo | Voice sempre escreve eventos na mesma Thread. |
| Aprovação virar teatro | UI só marca approved após confirmação server-side e claim válido. |
| Refatoração visual quebrar runtime | Migrar por superfícies, mantendo contratos de dados e feature flags. |
| Marketing prometer autonomia falsa | Conteúdo mostra plano, aprovação, execução e receipt. |

---

## 12. Instruções diretas para o Claude

1. Não começar alterando `mobile-preview.tsx` inteiro.
2. Primeiro produzir inventário de assets, imports, estados e rotas.
3. Criar os primitives e tipos antes da sidebar.
4. Migrar uma tela piloto e tirar screenshots antes/depois.
5. Manter o composer atual como referência de preservação de draft e stop.
6. Não remover `capybara.png` sem procurar consumers e registrar decisão.
7. Não inventar capabilities que o backend ainda não executa.
8. Não chamar um receipt local de sucesso externo.
9. Não substituir Whilo por mascotes upstream.
10. Não adicionar dark mode antes de semantic tokens/contrast tests.
11. Não usar strings em inglês onde o produto está em pt-BR; centralizar locale.
12. A cada sprint entregar: arquivos alterados, riscos, screenshots, testes e evidência do estado conectado/preview.
13. Atualizar documentação em `docs.agent` ou `docs` após cada lote.
14. Encerrar cada lote com cinco recomendações pós-output no formato padronizado.

---

## Cinco recomendações pós-output

### 1. P0 — congelar contrato de identidade antes dos pets

**Problema:** avatar, logo, icon e mascote ainda podem ser confundidos, e a auditoria visual encontrou resíduos de OpenMuse/capybara.

**Ação:** inventariar assets/imports, separar `WhiloWordmark`, `WhiloAppIcon`, `WhiloAvatar` e marcar legado.

**Critério de aceite:** nenhum asset upstream é exibido em superfície ativa; avatar pequeno permanece legível; docs e código usam nomes coerentes.

**Risco/benefício:** decisão de marca bloqueia a criação de vários pets, mas evita regressão visual estrutural.

### 2. P0 — criar o modelo Thread/Event antes da sidebar persistente

**Problema:** hoje Session e Agent estão parcialmente separados em estado local, sem fonte de verdade para unread, activity e receipts.

**Ação:** definir tipos e contrato de persistência/streaming antes de transformar drawer em sidebar.

**Critério de aceite:** abrir, arquivar, ordenar, marcar unread e recarregar uma thread sem duplicação ou perda de estado.

**Risco/benefício:** trabalho de domínio antes do polish, mas evita reescrever a navegação depois.

### 3. P1 — implementar a sidebar em três breakpoints

**Problema:** o drawer atual é útil no mobile, mas não atende a metáfora de pet threads em desktop/tablet.

**Ação:** criar AppNavigation persistente, rail tablet e drawer mobile usando AgentThreadRow.

**Critério de aceite:** as cinco seções de navegação funcionam nos breakpoints e a conversa não perde draft/foco.

**Risco/benefício:** é a mudança visual de maior impacto; deve ser feita sobre primitives para não criar mais styles inline.

### 4. P1 — transformar aprovação e atividade em eventos de thread

**Problema:** tool cards e review sheets ainda parecem superfícies locais e não uma máquina de trabalho rastreável.

**Ação:** unificar ActivityEvent, RunTimeline, ReviewCard e ReceiptCard com estados server-side.

**Critério de aceite:** o usuário acompanha proposed → approved → claimed → executing → result, incluindo failed/outcome_unknown.

**Risco/benefício:** aumenta confiança e habilita conteúdo demonstrável; depende do ActionKernel real.

### 5. P1 — validar o “bilhão” com três jobs, não com mais ícones

**Problema:** uma UI premium pode aumentar percepção sem provar valor ou disposição a pagar.

**Ação:** validar Inbox, Travel Recovery e Virtual Computer per Job com dados sintéticos, usuários reais e métricas TTFJ, receipt e repeat job.

**Critério de aceite:** cada job tem caminho claro de proposta, aprovação, execução/limite e resultado, com feedback qualitativo e custo conhecido.

**Risco/benefício:** reduz escopo e revela qual thread merece investimento antes de criar marketplace, dezenas de pets ou pricing complexo.
