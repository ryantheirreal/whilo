# Auditoria S+ independente — motor de execução e tools

## Veredito

**Whilo tem um motor funcional e um bom baseline de produção para chat com tools e tarefas duráveis, mas ainda não atende ao nível S+ no eixo de execução. Nota: 6,3/10.** O caminho principal usa AG-UI, valida argumentos com Zod, executa tools no servidor e aplica limites de iteração. O worker oferece leases, checkpoints e retomada. Há também receipts úteis para comandos de computador e ações revisadas de Gmail.

A lacuna de arquitetura é que esses controles ainda estão distribuídos entre arrays de tools, callbacks específicos e serviços diferentes. O catálogo O1 não é a fonte de verdade do dispatch e a função genérica de policy não intercepta o caminho de execução de tools. A idempotência funciona em alguns fluxos, mas não em todos os side effects; dois caminhos externos podem despachar duplicatas em concorrência. O ledger de audit não equivale a um registro de invocações/receipts correlacionado por chamada.

**Classificação por capacidade:** AG-UI e loops — existente; execução durável — existente para tarefas delegadas; catálogo/descoberta — parcial e desconectado do dispatch; policy central e registry executável — parcial/ausente no caminho do chat; receipts — parciais; idempotência — boa em `ActionService` e comandos de computador, insuficiente em ações de browser/connector.

## Comparação por eixo

### Execução de tools e AG-UI

**Whilo.** `ConversationAgent` constrói tools de servidor por execução em `apps/server/src/engine/conversation.ts:101-361`. A entrada passa por `tanstackAgent`, que converte tools AG-UI para TanStack AI e as executa no servidor (`apps/server/src/engine/tanstack-agent.ts:100-151`). O servidor não repassa tools arbitrárias recebidas do cliente: o run mantém apenas `open_workspace` de `input.tools` (`conversation.ts:374-377`). O endpoint `/api/copilotkit/*` entrega o stream pelo CopilotKit Runtime e converte chunks SSE para bytes (`apps/server/src/app.ts:709-725`). `AGUISendStateSnapshot` e `AGUISendStateDelta` são implementados como tools auxiliares para produzir eventos de estado (`tanstack-agent.ts:68-98`). O uso de AG-UI é portanto real e integrado ao produto, não apenas uma dependência.

O loop de chat limita-se a seis steps e dá mensagem explícita ao atingir o limite (`conversation.ts:362-367`; `tanstack-agent.ts:139-149,154-181`). Para trabalho delegado, `executeModelTask` usa 16 iterações, valida args novamente, verifica lease antes de cada chamada, serializa tools para não desordenar checkpoints e persiste algumas operações (`apps/server/src/engine/model.ts:35-84,296-365`). `TaskWorker` usa compare-and-swap, lease com heartbeat, checkpoints e retomada (`apps/server/src/engine/worker.ts:64-149,165-204`). São dois loops distintos: resposta interativa limitada e execução durável delegada.

**OpenMuse upstream.** O OpenMuse atual confirma o mesmo padrão de produto: API/worker/browser separados, tarefas duráveis, receipts de comandos, e aprovações/receipts salvos. Documenta explicitamente que não há retry oculto depois de uma escrita externa de resultado incerto. O código oficial de conversa usa AG-UI e tool definitions explícitas, com extensão de escolhas generativas (`apps/server/src/engine/conversation.ts` upstream). Whilo mantém a linhagem desse motor, mas a camada O1 adicionada localmente ainda não substitui esse dispatch especializado. [1] [2]

**OpenBot upstream.** OpenBot recebe qualquer agent que fale AG-UI; o agente executa seu próprio loop. A contribuição diferenciadora é a fronteira de ferramentas: chamadas para computer/files/MCP passam pelo gateway de servidor, que resolve alvo, avalia política, audita e só então despacha ou recusa. A documentação descreve runtime CopilotKit/Intelligence para run/reconnect/stop, separado do endpoint AG-UI dos Bots. Não é correto tratar o runtime Intelligence como um endpoint SSE genérico. [3] [4]

**OpenDots upstream.** `DotAgent` executa um loop TanStack AI convertido para AG-UI, com tools de servidor, limite de cinco iterações (dez para skill delivery), cancelamento a 90 segundos e verificações periódicas de mudança de permissões. As chamadas de computador vão a um `ComputerService` isolado por Dot. O README descreve integração de computador através do OpenBot; não é evidência de um gateway de tools independente equivalente ao OpenBot. [5] [6] [7]

### Tool registry e policy

**Whilo — parcial.** A lista executável de chat está codificada diretamente em `conversation.ts:109-360`; as tools do worker estão em outra lista em `model.ts:86-289` e `computer-tools.ts:15-120`. `apps/server/src/o1/tool-catalog.ts:13-37` não registra executores: é um catálogo estático de nove itens usado por `discover_tools`. Há divergências concretas: o catálogo expõe `travel_planning`, enquanto a tool executável é `travel_search`; o item `payments` não é uma tool com esse nome no chat; `prepare_purchase`, `discover_skills`, tools de memória e várias tools de computador não estão listadas. A busca filtra metadados e keywords; ela não limita o toolset dado ao modelo, não valida autorização e não instala tool executável (`conversation.ts:198-201`).

A API O1 contém `authorizeTool` e `/api/o1/policy/authorize` (`apps/server/src/o1/runtime.ts:62-65`; `apps/server/src/app.ts:407-416`), mas a busca de referências locais mostra que essa função só é usada pelo endpoint de autorização. `createActionBarrier` tampouco é chamado pelo caminho principal de dispatch. O fato de existir capability `approval-kernel`, `policy-gateway` ou `tool-discovery` no catálogo de `capabilities.ts:17-52` não demonstra que suas promessas sejam efetivas na execução.

A aplicação aplica controles por caminho: `browser_input` consulta permission mode; `computerTools` protege writes; `ConnectorBus.execute` chama `evaluatePolicy`; `ConnectorActionService` abre aprovação conforme o mode; Gmail usa `ActionService`. Isso é defesa real, mas não um único enforcement fail-closed no início de toda invocação. Há também credenciais de connector configuradas por processo (`connector-bus.ts:31-60`), não grants/OAuth por usuário; `actorId` participa da policy, mas não torna os tokens de Slack/GitHub/Telegram/Discord/Notion específicos de cada owner.

**OpenBot — governança mais forte, não um tool registry universal.** O server documenta integração de agent/framework arbitrário por AG-UI, plugins/MCP/componentes concedidos e um gateway comum para computer/files/MCP. Reutilizar sua separação entre agent loop e action gateway é apropriado. Não copiar a suposição de que uma decisão/audit de OpenBot implementa o lifecycle de aprovação e idempotência do Whilo: a integração local registra que a aprovação durável continua sendo responsabilidade do host. [3] [4] [8]

**OpenMuse/OpenDots.** Os dois também montam tool arrays ligados a uma sessão/Dot e não fornecem, nas fontes examinadas, um registry genérico de plugins substituível por simples dependência. OpenDots constrói os executores e valida inputs no servidor; `tanstack-tools.ts` exige executor para cada tool (`[10]`). São padrões úteis de montagem/escopo, mas não resolvem a necessidade do Whilo de manter catálogo, execução, política e descoberta coerentes.

### Loops, execução durável e concorrência

Whilo tem bom suporte durável para tarefas delegadas, não para qualquer chamada de tool. `AgentService.createTask` usa chave idempotente quando fornecida (`apps/server/src/engine/service.ts:180-229`); `TaskWorker` recupera lease vencido e refaz uma tarefa inteira. Para impedir side effects repetidos no replay, `model.ts:75-84` cacheia por nome/argumentos apenas algumas operações e mantém `toolQueue` serial (`model.ts:35-44`). O desenho é forte quando tool, operação cached e checkpoint se alinham; não cria automaticamente exactly-once para side effects entre a resposta do provider e a gravação do checkpoint.

Em OpenDots, `Runner` é um loop de background separado, claim/lease de uma tarefa por vez e interrupção quando configuração ou permissões mudam (`src/server/runner.ts`). Isso é simples e visível, mas o código de pesquisa pode retomar ao expirar lease; não se deve generalizar essa estratégia para tools externas não idempotentes. OpenBot transfere o controle do loop ao agent AG-UI e aplica governança em cada chamada que chega ao gateway. OpenMuse é a referência mais próxima ao worker durável do Whilo e avisa para não repetir automaticamente escritas externas incertas. [1] [5] [9]

O `buildMission` e `buildExecutionStages` em `apps/server/src/o1/runtime.ts:25-60,82-97` são planejamento de dados/eventos; a inspeção de call sites não mostrou esse planner no loop de `ConversationAgent` ou `executeModelTask`. A UI/API de missão e o motor real ainda são subsistemas distintos. Não contar as declarações de S+ em `capabilities.ts` como recurso executado sem conexão de dispatch, store, budgets e verificador.

### Receipts e idempotência

**Pontos fortes existentes.**

- `ActionService` cria uma proposta vinculada a hash do conteúdo/target, reivindica a aprovação por `Store.claim` antes do side effect, e `db.recoverInterruptedActions()` marca como `outcome_unknown` ações interrompidas no restart (`apps/server/src/actions.ts:39-100,150-190`; `apps/server/src/db.ts:78-95`; chamada de recuperação em `apps/server/src/index.ts:11`). É o padrão local mais completo para uma ação externa revisada.
- `ComputerService.execute` deriva ID estável do idempotency key, rejeita reutilização com comando/cwd diferentes, insere o receipt com `insertIfAbsent` e limita uma operação ativa por owner (`apps/server/src/computer.ts:591-643`). Estado `running` sem lease é convertido em `interrupted` com instrução para inspecionar antes de reexecutar (`computer.ts:387-408`). Os tools de shell exigem `operationId` e o acrescentam ao scope de chat/task (`computer-tools.ts:67-76`).
- `O1BrowserActionService` persiste receipt, devolve o resultado de um replay de sucesso e bloqueia receipt `executing`/`outcome_unknown` (`apps/server/src/o1/browser-actions.ts:27-49`).
- O ledger redige campos secretos antes de gravar (`apps/server/src/o1/audit-ledger.ts:20-30`).

**Falhas concretas.**

1. **Browser: corrida de replay pode duplicar clique/escrita (alto).** `O1BrowserActionService.execute` faz `get`, depois `put` do receipt `executing`, sem `insertIfAbsent`/claim atômico (`browser-actions.ts:29-39`). Duas chamadas simultâneas com mesmo `operationId` podem ambas observar ausência e ambas executar `browser.input`. O teste cobre somente dois calls sequenciais (`browser-actions.test.ts:17-23`). Além disso, `failed` cai pelo caminho de retry (`browser-actions.ts:32-36`); a classificação de incerteza considera apenas nomes `AbortError`/`TimeoutError` (`browser-actions.ts:19-21`). Erro de transporte após o browser ter aplicado input pode portanto ser classificado como falha retryable. Se gravar o resultado falhar após o side effect, o catch também tenta gravar `failed`, podendo deixar o replay elegível.

2. **Connectors: aprovação concorrente não é single-dispatch (alto).** `ConnectorActionService.decide` lê `awaiting_review`, em seguida salva `executing` com `put` e chama o bus (`connector-actions.ts:95-123`). Duas aprovações concorrentes podem ambas passar a leitura e executar a mesma escrita. `propose` usa `randomUUID()` em vez de uma chave por invocation; a repetição da mesma chamada pelo modelo abre propostas distintas (`connector-actions.ts:34-52`). Existe status `outcome_unknown`, mas a classificação é limitada a Abort/Timeout/ConnectTimeout (`connector-actions.ts:22-25,124-129`); a chamada não inclui idempotency key do provider (`connector-bus.ts:113-137,165-166`). No restart não há recuperação localizada equivalente a `recoverInterruptedActions` para a tabela `o1-connector-actions`.

3. **Computer: receipts cobrem shell, não todas as mutações.** `write_computer_file`, `mkdir_computer`, `import_computer_pdf` e `export_computer_pdf` não recebem um `operationId` nem persistem receipt por ação (`computer-tools.ts:78-119`). A repetição de export pode criar/importar artefato duplicado. Shell está significativamente melhor, mas não é uma garantia universal do conjunto de tools.

4. **Audit não é tool-invocation ledger.** `O1AuditLedger` gera ID aleatório e grava eventos redigidos (`audit-ledger.ts:7-37`), sem chave/estado de invocação que correlacione `runId`, `toolCallId`, hash de args, decisão, side effect e receipt final. Só alguns caminhos recebem o ledger: browser, memória e connector actions são criados com audit no início do run (`conversation.ts:103-108`); leitura de email, navegação, `delegate_task`, computer file writes e demais tools não têm receipt/audit unificado. AG-UI associa eventos por `toolCallId`, mas o protocolo define evento/result stream, não receipt persistente nem semântica de idempotência. [11]

5. **Resultados de erro podem parecer resultados válidos.** Várias tools capturam exceção e retornam `{ error: ... }` como valor de sucesso da tool (por exemplo mail e `connector_read` em `conversation.ts:117-161,308-315`). Um resultado tipado `status: failed|outcome_unknown` e política comum ajudaria o agent e a UI a não confundir falha com execução concluída.

6. **Ações externas ainda têm risco de principal amplo.** Tokens do connector são configurados em variáveis globais (`connector-bus.ts:39-60`). Em multiusuário, aprovação por owner não limita por si só o alcance do token de serviço. Antes de aumentar writes externos, associar cada invocation a grant/credential do owner e restringir operação/alvo.

OpenBot descreve decisão e linhas de audit antes e depois do encaminhamento pelo gateway; essas linhas são valiosas, mas não as trate como receipt idempotente sem contrato de chave, resultado e replay. Nas fontes oficiais consultadas não encontrei uma garantia generalizada de exactly-once para tool calls. OpenDots, por sua vez, persiste audit de computer com ID aleatório e outcomes `pending/succeeded/failed`, mas não associa a operação a chave idempotente (`src/server/computer-store.ts`; `src/server/computer-service.ts`). [4] [6] [7] [12]

## O que copiar/adaptar

1. **De OpenBot: separar o agent loop do gateway de ações.** Roteie todo side effect, computer, browser write e connector write por um gateway server-side pequeno. Resolva actor, tool, alvo, grants e contexto da chamada no servidor; verifique snapshot/owner, avalie policy fail-closed, grave decisão e só então faça dispatch. Preserve o agent AG-UI sem acoplá-lo ao provedor de modelo. Adapte a ideia, não a dependência da implantação OpenBot. [3] [4]
2. **De OpenMuse: manter loops e falhas honestos.** Preserve o stream AG-UI interativo, limite de steps, cancelamento explícito e worker durável. Manter retries de modelo distintos de retries de side effect. Um `outcome_unknown` tem de bloquear retry automático, exigir reconciliação e informar o usuário. [1] [2]
3. **De OpenDots: permission watcher e escopo por agente.** A verificação recorrente de suspensão/alteração de grants durante chamadas longas é uma boa extensão ao `ctx.guard()` de tarefa; tratar tools do Dot/computer com limites de serviço e retornar outputs como dados não confiáveis. Não copiar seu receipt de computador como idempotência (não tem a garantia). [5] [6] [7]
4. **Do próprio Whilo: promover padrões já corretos.** Generalizar `Store.claim`/CAS de `ActionService` e a máquina de estados do command receipt para browser, connectors e mutações de arquivos. Manter o hash da proposta ligado aos argumentos exatos, à conta e à revisão do alvo. Completar recovery de status `executing` no restart.
5. **Transformar o catálogo em registry, sem confundir descoberta com autorização.** Uma definição registrada por tool deve ser a fonte de nome, descrição, schema, risk, capability/grants, categoria de efeito, superfícies autorizadas, timeout, política de aprovação, modo de idempotência e executor. Gerar dela `defineTool`, indexação de discovery e documentação. Discovery seleciona candidatos; a execução repete autorização e validação no servidor.

## Plano de implementação recomendado

### P0 — impedir side effects duplicados e tratar incerteza

- Alterar browser receipt para claim atômico por `(owner, operationId)` via `insertIfAbsent`/CAS, comparar hash + sessionId e transicionar estados somente com CAS. Não sobrescrever `executing` concorrente.
- Adicionar idempotency key explícita à proposta connector derivada de invocation (`owner + run/thread + user message ID + toolCallId` ou operation ID), persistir antes do provider e usar claim condicional de `awaiting_review → executing`. Duas aprovações concorrentes devem retornar o mesmo estado, uma só invoca o provider.
- Acrescentar recuperação de connectors com estado `executing` após restart para `outcome_unknown`, sem replay. Capturar erros de rede/timeout potencialmente ocorridos após envio como outcome desconhecido, e disponibilizar reconciliação manual ou consulta de provider.
- Testar duas chamadas paralelas com a mesma chave, restart após dispatch antes da persistência do resultado, hash diferente com a mesma chave e erro após efeito já aplicado. Teste atual de browser é somente sequencial.

**Valor:** reduz duplicações em cliques, mensagens e ações externas. **Risco mitigado:** alto. **Dependências:** CAS/insert-if-absent já disponível em `Store`; garantir semantics testadas em PGlite e PostgreSQL. Para exactly-once, depender de idempotency API/reconciliation do provider; onde não houver, declarar pelo menos once/at-most-once e usar unknown, não alegar exatamente uma vez.

### P1 — registry executável e wrapper comum

- Criar `ToolRegistry` server-side usado pelo chat e tarefas. Eliminar os arrays divergentes, depois migrar por grupos; falhar em startup/teste quando um ID do catálogo não tem executor ou um executor não declara risco/policy.
- Implementar wrapper único por chamada: parse schema, identificar owner/run/thread/task/toolCallId, validar capability + grant, avaliar política e budget, exigir approval, claim receipt, executar com AbortSignal/timeouts, persistir resultado/status, emitir retorno AG-UI. Mantenha tool discovery separada do check de autorização.
- Expor escopo e credential do owner para connectors, substituindo tokens globais por OAuth/grants por pessoa ou explicitando que a integração é um bot de deployment e restringindo destinos.

**Valor:** remove deriva nome/schema/risk e permite enforcement consistente. **Risco:** alto/alto valor de segurança. **Dependências:** extensão dos tipos `ToolDefinition` e do contexto de execução para incluir ID de chamada/run (ou gerar invocation ID server-side); definição do escopo de conectores e credenciais.

### P1/P2 — receipt e audit correlacionado

- Definir `ToolInvocation` persistente com chave única owner/scope/idempotencyKey, `argsHash`, tool version, actor, runId/threadId/taskId/toolCallId, target, risk, permission decision, timestamps e estados `proposed|denied|awaiting_approval|executing|succeeded|failed|outcome_unknown|cancelled`.
- Escrever eventos de audit que referenciem `invocationId`; separar payload original/segredo de campos audit redigidos. Disponibilizar receipt à UI/Activity e ao modelo pelo retorno estruturado, sem assumir que o stream AG-UI é armazenamento durável.
- Acrescentar operation IDs/receipts em mutações de filesystem/PDF, com comportamento explícito para replay; validar hash da chamada antes de devolver receipt existente.

**Valor:** rastreabilidade, reconciliação e explicação do que ocorreu. **Risco mitigado:** alto. **Dependências:** tabela/índice transacional para unicidade e política de retenção; UI pode adotar fase posterior.

### P2 — loop, eventos e testes de contrato

- Preservar AG-UI como protocolo de interação e manter `RUN_STARTED`, chunks, `TOOL_CALL_*`, `TOOL_CALL_RESULT` e encerramento válidos. Retornar `invocationId`, `status` e receipt em `content` estruturado; não criar semântica implícita nova para eventos padrão.
- Medir max steps, chamadas paralelas, tempo/cancelamento e custo por run. Garantir que limite atingido, falha de tool e resultado `outcome_unknown` gerem estado terminal/pausa correto.
- Adicionar testes de replay/reconnect de AG-UI, tool call interrompida, lease expirado, revogação de grant em execução, duas aprovações concorrentes e dedupe entre turns/retries. Validar que o `toolCallId`/operationId não possa ser usado para executar args diferentes.

**Valor:** reduz divergência em UI e regressões de recuperação. **Dependências:** P0 e wrapper/receipt de P1.

## Evitar

- Não trocar Whilo pelo loop de OpenBot nem ligar diretamente ao endpoint interno de computador. O adaptador local `packages/backends/src/openbot.ts:99-135` declara ser seam futuro; runtime descriptor Intelligence não é URL SSE. `docs/OPENBOT-INTEGRATION.md:55-76` confirma que o adapter está desativado e não conectado a deployment; a aprovação durável e rotina/tarefa seguem do lado do host.
- Não passar todo o registry ao LLM para depois confiar que o prompt fará autorização. A tool metadata não é permissão; o próprio `discover_tools` local já diz isso (`conversation.ts:198-201`).
- Não retry automático de `executing`, `interrupted` ou `outcome_unknown` para writes externas. Não interpretar ausência de exceção como conclusão sem receipt/estado persistido.
- Não marcar `capabilities.ts` como prova de execução S+ até planner, verification, policy e budget estarem no mesmo caminho real do agente.
- Não usar `toolCallId` AG-UI por si só como idempotency key: o protocolo o define para correlação de eventos, não para efeitos duráveis entre runs/retries. [11]

## Dependências e critérios de aceite

- **Banco:** `Store` já oferece CAS e insert-if-absent; garantir transição condicional e unicidade para invocation/receipt, cobertura de PGlite e PostgreSQL e recovery ao startup.
- **Framework/contexto:** avaliar o contexto de `@tanstack/ai` server tools para propagar `runId`/`toolCallId`; não fabricar essa garantia se o adapter atual só entrega args. Caso indisponível, atribuir invocation ID próprio no wrapper e mapear para os eventos emitidos.
- **Providers:** idempotency keys e consulta/reconciliação variam por integração. Para providers sem dedupe consultável, outcome desconhecido tem de bloquear repetição automática.
- **Identidade:** owner/grants e credenciais per-user ou deployment-bot explícito, mais policy por alvo e classe de risco.
- **Critério release P0:** em execução concorrente do mesmo operation ID, o provider/computer recebe exatamente uma chamada; payload/hash diferente recebe 409; se processo cair depois do envio e antes da resposta salva, o estado reaparece como `outcome_unknown` e nenhum retry automático acontece.
- **Critério release P1:** cada tool executável e descoberta vem do mesmo registry; todas as mutações passam por wrapper; todas as recusas, propostas, aprovações e resultados têm `invocationId` persistente correlacionado com evento AG-UI.

## Referências upstream


[1]: https://github.com/CopilotKit/openmuse "OpenMuse — repositório oficial e documentação do produto"
[2]: https://github.com/CopilotKit/openmuse/blob/main/apps/server/src/engine/conversation.ts "OpenMuse — implementação oficial do engine de conversa"
[3]: https://github.com/CopilotKit/OpenBot "OpenBot — repositório e README oficial"
[4]: https://github.com/CopilotKit/OpenBot/blob/main/docs/architecture.md "OpenBot — arquitetura oficial e fluxo do gateway de tools"
[5]: https://github.com/CopilotKit/OpenDots "OpenDots — repositório e README oficial"
[6]: https://github.com/CopilotKit/OpenDots/blob/main/src/server/dot-agent.ts "OpenDots — execução oficial de DotAgent e loop AG-UI/TanStack"
[7]: https://github.com/CopilotKit/OpenDots/blob/main/src/server/computer-service.ts "OpenDots — execução, permission checks e audit de computer tools"
[8]: https://github.com/CopilotKit/OpenBot/blob/main/server/src/computer/routes.ts "OpenBot — rotas oficiais do gateway de computer e governança"
[9]: https://github.com/CopilotKit/OpenDots/blob/main/src/server/runner.ts "OpenDots — worker oficial de tarefas e leases"
[10]: https://github.com/CopilotKit/OpenDots/blob/main/src/server/tanstack-tools.ts "OpenDots — registro e execução oficial de server tools"
[11]: https://docs.ag-ui.com/concepts/events "AG-UI — documentação oficial do ciclo de eventos de tools"
[12]: https://github.com/CopilotKit/OpenDots/blob/main/src/server/computer-store.ts "OpenDots — persistência oficial de permissions e computer audit"
