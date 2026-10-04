# Whilo — mapa de implementação de features S+

## Tese

Whilo não deve vender “um chatbot melhor”. Deve vender **trabalho confiável concluído**, com um agente que entende contexto, prepara ações, pede aprovação no momento certo e deixa evidência auditável.

O produto pode ser oferecido em três camadas:

1. **App pessoal:** assinatura mensal para reduzir carga administrativa.
2. **Integrações e agentes para equipes:** assentos, conectores, governança e consumo.
3. **Computadores virtuais seguros:** ambientes isolados por job, workspace ou plano, cobrados como capacidade/uso.

“Bilionário” aqui é uma hipótese de mercado: uma feature só merece essa tese quando resolve uma dor frequente, alcança um público amplo, gera uso recorrente, cria dados/contexto defensáveis e pode monetizar sem destruir confiança.

## 25 features S+

| # | Feature | Dor real | Público atingido | Por que pode ser grande | Como vender | Dependências e fase |
|---:|---|---|---|---|---|---|
| 1 | **Inbox Zero Governado** | Pessoas perdem horas triando email e não sabem o que merece resposta. | Profissionais, founders, famílias. | Frequência diária, ROI claro e contexto acumulativo. | Pro pessoal; Team com múltiplas caixas. | Gmail/Outlook, grants, drafts. F1. |
| 2 | **Voice Chief of Staff** | Usuário tem ideias e pendências enquanto dirige, caminha ou trabalha. | Executivos, criadores, cuidadores, profissionais móveis. | Voz cria hábito e amplia acessibilidade. | Add-on Voice ou plano Pro. | WebRTC/realtime, transcript, reauth. F1. |
| 3 | **Purchase Concierge** | Comparar, preencher e comprar é fragmentado e arriscado. | Consumidores, famílias, pequenas empresas. | Acompanha intenção até o checkout e pode gerar comissão/integrations. | Pro + fee de parceiro claramente divulgado. | Stripe, browser sandbox, approval. F1. |
| 4 | **Travel Recovery Agent** | Cancelamentos e atrasos exigem ações urgentes em vários canais. | Viajantes, empresas, famílias. | Dor de alto valor e disposição a pagar em momentos críticos. | Créditos por incidente + Pro. | Trip, email, calendar, policy engine. F1. |
| 5 | **Life Admin Autopilot** | Contas, recibos, garantias e formulários se perdem. | Adultos ocupados, cuidadores, idosos com suporte familiar. | Grande frequência e alto valor emocional. | Family plan; storage/compute premium. | OCR, reminders, sensitive-form gate. F1. |
| 6 | **Small Business Operator** | Pequenas empresas não têm equipe para responder, cotar e acompanhar. | Solopreneurs, SMBs e profissionais liberais. | Mercado amplo e preço por valor, não por chat. | Team/Business por workspace. | CRM, inbox, invoices, audit log. F1. |
| 7 | **Shared Family Space** | Responsabilidades domésticas ficam invisíveis e recaem sobre uma pessoa. | Famílias e coabitantes. | Viralidade por convite e uso recorrente. | Family subscription. | Roles, privacy boundaries, calendar. F1. |
| 8 | **Care Coordinator** | Cuidadores coordenam consultas, documentos e tarefas sob estresse. | Famílias, cuidadores, clínicas não críticas. | Dor forte e subatendida; exige limites e privacidade. | Family Pro; B2B2C com organizações. | Consent, expiring memory, human review. F2. |
| 9 | **Job Application Operator** | Candidaturas repetitivas consomem tempo e geram erros. | Candidatos, estudantes, transição de carreira. | Mercado massivo e resultado mensurável. | Career pack; não cobrar por submissão sensível. | Browser sandbox, draft-only, user submit. F2. |
| 10 | **Study & Scholarship Agent** | Estudantes não encontram bolsas, prazos e materiais. | Estudantes, escolas, famílias. | Educação é universal e o output é compartilhável. | Student plan; institution license. | Search, source citations, calendar. F2. |
| 11 | **Creator Content Engine** | Criadores precisam transformar uma ideia em roteiros, cortes e distribuição. | Creators, marcas pequenas, social teams. | Output naturalmente compartilhável e ciclo de feedback rápido. | Creator Pro + render credits. | Pages, asset store, approval. F1. |
| 12 | **Meeting-to-Execution** | Reuniões terminam sem donos, prazos ou follow-up. | Equipes remotas, consultorias e vendas. | Integra em sistemas existentes e mede conclusão. | Per-seat Team. | Calendar, transcript, tasks, Slack. F1. |
| 13 | **Decision Room** | Times perdem contexto e repetem discussões. | Lideranças, PMs, operações. | Memória estruturada vira sistema operacional do time. | Workspace tier. | Pages, versioning, citations, roles. F2. |
| 14 | **Approval OS** | Aprovações vivem em mensagens soltas e ninguém sabe o status. | Financeiro, compras, operações e líderes. | Confiança é uma camada horizontal para todo agente. | Platform fee + seats. | Control Plane, claims, signed webhooks. F1. |
| 15 | **Personal Data Vault** | Contexto fica espalhado e modelos não sabem o que podem usar. | Qualquer usuário; especialmente power users. | Trust moat e retenção por memória portátil. | Storage/privacy tier. | RLS, encryption, export/delete. F1. |
| 16 | **Virtual Computer per Job** | Algumas tarefas exigem navegador, arquivos e ambiente isolado. | Pro users, SMBs, developers, agencies. | Converte autonomia em recurso tangível e controlável. | Compute minutes/credits + reserved VM. | Browser-use, snapshots, network allowlist. F2. |
| 17 | **Agent Workbench** | Criar um agente exige engenharia e configuração confusa. | Operações, creators, consultants, SMBs. | Expande distribuição via templates e marketplace. | Builder Pro; revenue share futuro. | Templates, evals, sandbox, versioning. F2. |
| 18 | **Connector Marketplace** | Cada app precisa de integração própria e manutenção. | Developers, SaaS vendors, teams. | Ecossistema e distribuição bilateral. | Platform fee, usage, verified connectors. | OAuth scopes, health, review process. F3. |
| 19 | **Trust Score & Audit Export** | Usuários e empresas não conseguem provar o que o agente fez. | SMBs, regulated-adjacent teams, admins. | Reduz risco de adoção e cria feature de compliance. | Business/Enterprise. | Signed log, event schema, export. F2. |
| 20 | **Agent-to-Agent Handoff** | Um agente perde contexto ao passar trabalho para outro. | Power users e equipes. | Multiplica capacidade sem multiplicar interfaces. | Included in Pro; usage for complex jobs. | Context envelope, grants, trace IDs. F2. |
| 21 | **Proactive Opportunity Radar** | Usuários descobrem tarde economia, prazos e oportunidades. | Consumidores, sales, finance ops. | Valor nasce de alertas oportunos, não de prompts. | Proactive tier with opt-in. | Event triggers, thresholds, quiet hours. F2. |
| 22 | **Accessibility Companion** | Interfaces e processos excluem pessoas com limitações motoras/cognitivas. | Pessoas com deficiência, idosos, caregivers. | Mercado grande, impacto real e voz como interface universal. | Discounted access + institutions. | Voice, readable UI, consent, human fallback. F2. |
| 23 | **Personal Finance Admin (não consultoria)** | Assinaturas, recibos e datas vencem sem visibilidade. | Famílias e freelancers. | Dor mensal e economia verificável; sem recomendar investimentos. | Finance admin tier. | Read-only data, approval, no trading. F2. |
| 24 | **Workforce Agent Supervisor** | Gestores não sabem se automações estão travadas ou arriscadas. | Ops leaders, support, agencies. | Dashboard de saúde e intervenção vira control plane empresarial. | Per-workspace + run volume. | Activity feed, probes, escalation. F1. |
| 25 | **Whilo OS API** | Empresas querem embutir ações governadas em seus produtos. | SaaS, fintechs, travel, marketplaces. | Plataforma pode capturar valor além do app final. | API calls, enterprise contract, compute. | OAuth, webhooks, idempotency, docs. F3. |

## Ordem de implementação

### Fase 0 — confiança demonstrável

- ActionKernel único para browser, connectors, files e commerce.
- Grants e claims em todas as ações.
- Activity View, approval cards e signed audit events.
- Dry-run, cancelamento e limites.
- Testes de dupla execução e replay.

### Fase 1 — jobs que vendem o produto

- Inbox Zero Governado.
- Meeting-to-Execution.
- Purchase Concierge em preparação.
- Travel Recovery em preparação.
- Voice Chief of Staff com ferramentas de baixo risco.
- Workforce Agent Supervisor.

**Meta:** provar que Whilo conclui jobs pequenos, seguros e repetíveis.

### Fase 2 — memória, equipes e computador

- Personal Data Vault com RLS.
- Spaces/Pages e versionamento.
- Shared Family Space.
- Agent Workbench.
- Virtual Computer per Job com snapshot e allowlist.
- Trust Score e export de auditoria.

### Fase 3 — plataforma

- Connector Marketplace.
- Agent-to-Agent Handoff.
- Whilo OS API.
- Marketplace de templates.
- Billing de consumo e compute.

## Modelo comercial recomendado

### Plano Free

- Chat e pesquisa limitada.
- Dados sintéticos para experimentar.
- Um Space.
- Nenhum side effect externo sem aprovação.

### Plano Pro — hipótese inicial

- Voice, memória controlável, jobs recorrentes e mais conectores.
- Cota mensal de compute incluída.
- Consumo excedente explícito, com teto configurável.
- Não prometer “ilimitado” se o custo variar por modelo, navegador ou VM.

### Plano Family

- Spaces compartilhados, papéis, privacidade por membro e tarefas domésticas.
- Convites como loop de distribuição, sem expor conversas privadas.

### Plano Team/Business

- Workspaces, RLS, approval chains, audit export, connector admin, SLA e supervisor.
- Cobrança por assento + execução/compute quando houver custo variável.

### Computadores virtuais

Vender como **capacidade segura**, não como “um PC mágico”:

- `Job VM`: ambiente efêmero, cobrado por minuto/job.
- `Persistent VM`: ambiente reservado com snapshot, cobrado mensalmente.
- `Team pool`: capacidade compartilhada com limites e fila.
- `Enterprise isolated`: rede/egress/retention sob contrato.

Sempre mostrar: tempo usado, custo estimado, domínios acessados, arquivos tocados, status e botão de interromper.

## Métricas que provam valor

- Time to First Job (TTFJ).
- Primeiro job aprovado e concluído.
- Taxa de rollback/cancelamento.
- Tempo poupado declarado e verificado quando possível.
- Jobs repetidos por semana.
- Convites com ativação real.
- Custo de compute por job concluído.
- Retenção baseada em resultado, não em mensagens.
- Incidentes por 1.000 ações.
- Percentual de ações que exigiram intervenção humana.

## Nota sobre claims e anúncios

O material de marketing deve vender o **momento de transformação** — “Whilo preparou tudo, mostrou o impacto e esperou minha aprovação” — e não alegar economia, autonomia ou segurança sem medição. Não usar depoimentos inventados, contadores falsos ou “faz tudo sozinho”.

## Fontes e leituras de contexto

- Meta, “Introducing Muse”: https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/
- OpenAI Dots: https://openai.com/index/dot-ps1/
- OpenDots: https://github.com/CopilotKit/OpenDots
- MIT Sloan, “Agentic AI, explained”: https://mitsloan.mit.edu/ideas-made-to-matter/agentic-ai-explained
- Andrew Chen, “What’s your viral loop?”: https://andrewchen.com/whats-your-viral-loop-understanding-the-engine-of-adoption/
- Zylo, AI cost and budgets 2026: https://zylo.com/blog/ai-cost
- Userpilot, AI onboarding: https://userpilot.com/blog/ai-user-onboarding/

Os valores, TAMs e preços são hipóteses de produto e devem ser validados com entrevistas, jobs reais, margem de compute e testes de willingness-to-pay.
