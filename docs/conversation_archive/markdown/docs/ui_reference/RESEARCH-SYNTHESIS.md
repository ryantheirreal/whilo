# Whilo — UI/UX Reference Synthesis

**Atualizado em:** 2026-10-04  
**Objetivo:** transformar o Whilo em um produto de agentes confiável, desejável e escalável usando padrões observados em OpenAI Dots, Meta Muse, OpenDots, OpenBot, OpenMuse, Mobbin e referências de agentic UX.

## Decisões principais

### O produto precisa parecer um sistema de conversas

A unidade principal deve ser **um agente = uma conversa = um contexto = um conjunto de grants**. OpenBot mostra cada agente como um canal de colega; OpenDots combina especialista, conversa, computador e Pages; Muse mantém a interação próxima de mensagens comuns. [1] [2] [3]

### O centro da experiência é o trabalho observável

A interface deve mostrar intenção, plano, ferramentas, fontes, progresso, resultado e próximo passo. Um spinner isolado não é suficiente. No Whilo, cada execução deve ter uma timeline com estados `planned`, `running`, `waiting_approval`, `completed`, `failed` e `stopped`. [1] [3] [4]

### Autonomia deve ser configurável por ação

A inspiração correta não é um botão global “faça tudo”. Dots usa regras customizadas, preaprovação, ask-before e handoff. Meta descreve VM separada, Sentinel/policy barrier, credenciais protegidas, trilha de auditoria e aprovação antes de email ou compra. O Whilo deve manter o kernel fail-closed e oferecer regras por conector, operação, valor, domínio e horário. [1] [5] [6]

### Voice é uma superfície do mesmo agente

A chamada deve compartilhar thread, contexto, tools e approvals com texto. A documentação da OpenAI separa transporte de voz do workflow de negócio e recomenda medir latência, interrupções, tool outcomes e confiabilidade. O Whilo deve ter captions, turn-taking, mute, speaker, stop, handoff para execução longa e receipt final na mesma conversa. [7] [8]

### Onboarding deve entregar valor em menos de cinco minutos

A entrada deve oferecer nome/avatar do agente, três templates concretos e conexão opcional de um app. Mobbin é útil como catálogo de fluxos, não como fonte para copiar telas: onboarding, welcome, chat, chips, carousels, permissões e feedback aparecem como padrões reutilizáveis. [9] [10] [11] [12]

## O que usar de cada referência

**OpenAI Dots:** identidade editável, avatar/pet, especialistas, Activity View, tarefas em progresso/agendadas/concluídas, computador próprio, canais múltiplos, custom rules, pausa, memória visível e trabalho proativo read-only. Não prometer capacidades não implementadas. [1] [2]

**Meta Muse:** mensageria simples, segurança compreensível, VM dedicada, Sentinel/policy barrier, credenciais fora do modelo, aprovação de ações sensíveis, forget/reset de memória, checkout protegido e audit trail. Para gadgets, usar status físico, push-to-talk e displays periféricos, sem copiar avatar ou marca. [5] [6] [13]

**OpenDots:** Spaces e Pages como destino do trabalho, editor com autosave e revision checks, specialist Dots, grants por agente, calls com compute delegado, Slack, recurring tasks, Automatic Learning, AG-UI e receipts. Tratar o projeto como alpha/self-hosted e validar cada integração antes de chamá-la de produção. [3] [14]

**OpenBot:** um canal por agente, skills descobríveis no composer, fontes citadas, fail-closed retrieval, computador por agente, takeover, allowlist por tool, logs de outcome, deploy self-hosted e separação entre MCP, A2A e AG-UI. [4]

**OpenMuse:** browser visível, rich results, agente pessoal com computador e execução multimodal. O Whilo deve conservar a clareza de mostrar o trabalho, mas com controles de aprovação mais explícitos. [15]

**Mobbin:** usar como biblioteca de padrões para welcome/get started, account creation, chat detail, chat bot, chips, carousel, speech language selection, feedback, permission screens, switching view, text fields e settings. Registrar hipótese e decisão; não copiar layout pixel a pixel. [9] [10] [11] [12]

## Blueprint de experiência

### Navegação

- **Inbox:** decisões, aprovações e falhas que exigem atenção.
- **Agents:** cada agente com avatar, papel, última atividade, grants e conversa.
- **Spaces:** páginas, artefatos e resultados pesquisáveis.
- **Activity:** tarefas em progresso, agendadas e concluídas.
- **Connectors:** apps, escopos, último uso, health check e revogação.
- **Settings:** memória, regras, segurança, dados, billing e dispositivos.

### Tela de conversa

1. Cabeçalho central com avatar, nome, status e menu.
2. Mensagens com fontes, anexos e contexto de thread.
3. Estado de processamento curto e legível, sem expor cadeia interna de raciocínio.
4. Tool card com ação, escopo, risco, custo, fonte e revisão.
5. Activity receipt com início, tool start/end, output e estado.
6. Composer com texto, voz, anexos, slash skills e menção de agente.
7. Fila visível quando uma segunda solicitação entra durante uma execução.
8. Stop, pause e retry idempotente.

### Criação de agente

O fluxo deve ter quatro etapas: **Identity → Role → Access → Test**.

- Identity: nome, avatar, cor, pronúncia e descrição curta.
- Role: objetivo, estilo, exemplos do que faz e do que não faz.
- Access: navegador, arquivos, memória, conectores, shell e limites.
- Test: três tarefas simuladas, uma aprovação, uma recusa e um caso de erro.

O botão final deve dizer **Create agent**, não “Enable everything”.

### Conectores

Cada conector precisa de OAuth/CLI, scopes legíveis, ambiente, data access, write access, ações sensíveis, health check, último evento, revoke, reauth e logs. O onboarding começa read-only; write access só aparece quando o usuário cria uma regra explícita.

### Permissões

Modelo recomendado: `read`, `draft`, `prepare`, `execute`, `admin`. A UI mostra grants por agente e por ferramenta. A aprovação deve ser vinculada a payload hash, destinatário, valor, domínio, expiração e idempotency key. Mudanças em credenciais, pagamento, publicação ampla e exclusão exigem confirmação forte.

### Compra e viagem

A jornada deve ser: **discover → compare → explain trade-offs → prepare checkout → review → handoff/execute → receipt**. O agente nunca oculta preço, taxas, merchant, política de retorno, fonte ou alteração de escopo. Para cartão, usar tokenização e não expor dados ao modelo. Para viagem, separar pesquisa de reserva.

### Métricas

- Time to first useful result.
- Percentual de onboarding que chega ao primeiro artefato.
- Percentual de tarefas concluídas sem retrabalho.
- Taxa de aprovação por tipo de ação.
- Taxa de stop, retry, erro e takeover.
- Latência p50/p95 de voz e tools.
- Retenção por agente ativo e por Space com artefato salvo.
- Conectores ativos após 7 e 30 dias.
- Incidentes de permission leak: meta zero.

## Backlog priorizado

### P0 — confiança e utilidade

1. Activity View global. 2. Agent profile com grants. 3. Tool receipt padrão. 4. Approval payload hash e expiração. 5. Inbox de decisões. 6. Fila, Thinking, Stop e Retry. 7. Sources citadas e fail-closed retrieval. 8. Connector health/revoke. 9. Voice com captions e handoff. 10. Onboarding Identity/Role/Access/Test.

### P1 — retenção e diferenciação

11. Spaces e Pages com autosave/revision checks. 12. Templates por profissão e problema. 13. Memória editável e Forget. 14. Recurring tasks com pause/resume. 15. Agent marketplace interno com permissões explícitas. 16. Multi-agent handoff com contexto mínimo. 17. Browser takeover com receipt. 18. Travel compare e purchase handoff completos. 19. Gadget bridge para displays/status/push-to-talk. 20. Slack/WhatsApp-like channel adapters.

### P2 — escala

21. Multi-tenant e RBAC. 22. Billing baseado em capacidade e execução. 23. Observability com traces por tarefa. 24. Evals contínuos de voz, tool outcome e permission safety. 25. A/B tests de onboarding e templates. 26. SDK de skills. 27. Marketplace de conectores com revisão de segurança. 28. Export/delete de dados auditável.

## Critério de qualidade “10/10”

Uma feature só está pronta quando o usuário consegue descobrir, executar, observar, interromper, revisar, repetir e apagar o resultado. Uma tela bonita sem esses estados é apenas marketing. O produto precisa ser rápido como um chat, claro como um painel operacional e seguro como um sistema de aprovação.

## References

[1]: https://openai.com/index/introducing-dots/ "Introducing dots — OpenAI"
[2]: https://help.openai.com/en/articles/20001530-getting-started-with-your-dot "Getting started with your dot — OpenAI Help"
[3]: https://www.copilotkit.ai/opendots "OpenDots — CopilotKit"
[4]: https://www.copilotkit.ai/openbot "OpenBot — CopilotKit"
[5]: https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/ "Introducing Muse — Meta Newsroom"
[6]: https://gadgets.muse.ai/ "Muse Gadgets — Meta"
[7]: https://developers.openai.com/api/docs/guides/voice-agents "Voice agents — OpenAI Developers"
[8]: https://developers.openai.com/api/docs/guides/agents "Agents — OpenAI Developers"
[9]: https://mobbin.com/ "Mobbin — UI & UX design inspiration"
[10]: https://mobbin.com/explore/mobile/app-categories/ai "Mobile AI App UI Design Inspiration — Mobbin"
[11]: https://mobbin.com/explore/mobile/flows/onboarding "Onboarding flows — Mobbin"
[12]: https://mobbin.com/explore/mobile/screens/permission "Permission screens — Mobbin"
[13]: https://github.com/facebookincubator/muse-gadget-sdk "Muse Gadget SDK — GitHub"
[14]: https://www.copilotkit.ai/blog/introducing-opendots "Introducing OpenDots — CopilotKit Blog"
[15]: https://github.com/CopilotKit/openmuse "OpenMuse — GitHub"
[16]: https://github.com/CopilotKit/openbot "OpenBot — GitHub"
[17]: https://github.com/CopilotKit/OpenDots "OpenDots — GitHub"
[18]: https://agentic-design.ai/patterns/ui-ux-patterns "Agentic UI/UX Design Patterns"
[19]: https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/ "Designing for Agentic AI — Smashing Magazine"
[20]: https://www.salesforce.com/commerce/ai/shopping-assistants/ "AI Shopping Assistants — Salesforce"
