# Whilo — 100 itens de UI/UX, produto e crescimento

**Objetivo:** transformar o backlog de 50 itens em um mapa de 100 decisões concretas para uma experiência premium, calma, confiável e compartilhável.

> **Princípio:** cada item deve reduzir uma dor, aumentar a confiança ou tornar o valor do Whilo demonstrável em menos de 60 segundos. Não construir “features de vitrine” sem métrica, aprovação e rollback.

## 1. Identidade, marca e atmosfera

1. Logo Whilo em movimento respiratório sutil.
2. Mascote com estados semânticos: ouvindo, pensando, executando, aguardando aprovação e concluído.
3. Paleta escura premium com contraste AA/AAA.
4. Superfícies translúcidas apenas onde não prejudicam legibilidade.
5. Tipografia com escala editorial para sensação de produto de alto valor.
6. Som de confirmação opcional e discreto.
7. Microanimações com duração curta e sem “loading infinito”.
8. Tom de voz calmo, direto e sem prometer autonomia irrestrita.
9. Empty states que ensinam um primeiro caso de uso.
10. Design tokens compartilhados entre mobile, web e voice call.

## 2. Entrada e ativação

11. Login com email, passkey e OAuth.
12. Onboarding em três escolhas: objetivo, apps e nível de autonomia.
13. “Primeiro resultado” guiado em até cinco minutos.
14. Templates por dor: caixa de entrada, viagem, compras, estudos e família.
15. Importação seletiva de contexto, nunca coleta indiscriminada.
16. Preview do que o agente poderá acessar antes da conexão.
17. Permissões agrupadas por risco e não por tecnologia.
18. Modo demo com dados sintéticos para conteúdo e anúncios.
19. Convite de um familiar ou colaborador durante onboarding.
20. Checklist de confiança com ações reversíveis.

## 3. Conversa e agentes

21. Cada agente aparece como uma conversa, inspirado no padrão de mensageria.
22. Drawer de sessões com busca, favoritos e arquivamento.
23. Título automático editável.
24. Chips de intenção: planejar, pesquisar, executar, monitorar.
25. Mensagens com origem, timestamp e nível de confiança.
26. Activity View para mostrar cada etapa da execução.
27. Resposta curta por padrão, detalhes sob demanda.
28. Composer com texto, voz, foto, arquivo e link.
29. Modo “corrija antes de executar”.
30. Modo “me mostre o plano primeiro”.
31. Modo “faça quando eu aprovar”.
32. Handoff entre agentes com contexto explícito.
33. Resumo fixado no topo de conversas longas.
34. Comparação lado a lado de alternativas.
35. Citações e links para evidências externas.

## 4. Voz e presença

36. Voice call full-duplex com interrupção natural.
37. Transcrição ao vivo editável.
38. Indicador visual de quem está falando.
39. Resumo pós-chamada com decisões e pendências.
40. Ferramentas visíveis durante a ligação.
41. Confirmação por voz para ações de baixo risco.
42. Reautenticação para ações sensíveis.
43. Controle de velocidade e timbre.
44. Fallback instantâneo para texto.
45. Histórico de chamadas indexado.

## 5. Ações e confiança

46. Plano de execução antes do side effect.
47. Grant de ação com escopo, limite, validade e destinatário.
48. Claim atômico para impedir dupla execução.
49. Aprovação com resumo de impacto.
50. Botão cancelar e rollback quando possível.
51. Cofre de credenciais sem expor tokens no chat.
52. Logs assinados e verificáveis.
53. Webhook idempotente.
54. Probe de readiness antes de executar.
55. “Por que isso precisa de aprovação?” explicado em linguagem simples.
56. Modos seguros para pesquisa, simulação e dry-run.
57. Allowlist de domínios e conectores.
58. Limites de gastos e frequência.
59. Modo férias com regras temporárias.
60. Centro de incidentes e atividade suspeita.

## 6. Commerce, viagem e vida administrativa

61. Comparação de preços com data e condições.
62. Carrinho preparado, nunca compra silenciosa.
63. Checkout com confirmação humana.
64. Detecção de taxas e renovação automática.
65. Rastreamento de pedido e resolução de atraso.
66. Itinerário com alternativas e política de cancelamento.
67. Alertas de preço com teto e janela de busca.
68. Calendário de compromissos com conflito destacado.
69. Reembolsos preparados para revisão.
70. Organização de recibos e garantias.
71. Formulários pré-preenchidos sem submissão automática em domínios sensíveis.
72. Lista de tarefas delegáveis com SLA.

## 7. Espaços, Pages e memória

73. Spaces por área da vida ou trabalho.
74. Pages com documentos, tabelas, decisões e fontes.
75. Histórico de versões e restauração.
76. Memória com tela de inspeção, edição e exclusão.
77. Memória temporária por conversa.
78. Expiração automática para dados sensíveis.
79. Compartilhamento com permissões granulares.
80. Exportação portátil em Markdown/JSON/PDF.
81. Biblioteca de templates de agentes.
82. Marketplace futuro com revisão, reputação e sandbox.

## 8. Conectores e plataformas

83. Gmail/Outlook com escopo de leitura e envio separado.
84. Calendar com criação em rascunho.
85. Drive/Dropbox com seleção de pastas.
86. Slack/WhatsApp/Discord com aprovação de postagem.
87. Stripe e gateways em modo preparação.
88. Trip.com e fontes de viagem com comparação.
89. Browser/computer use em máquina isolada.
90. Supabase/Postgres com RLS por workspace.
91. Cloudflare/Vercel para probes e deploy controlado.
92. API de terceiros com health status e escopo revogável.

## 9. Crescimento, conteúdo e negócio

93. Resultado compartilhável com dados privados removidos.
94. Templates públicos duplicáveis.
95. “Antes e depois” baseado em tempo economizado, sem claims inventados.
96. Programa de indicação com benefício transparente.
97. Trial orientado a um job concluído, não a quantidade de telas.
98. Pricing por capacidade + consumo excedente visível.
99. Painel de ROI pessoal ou de equipe.
100. Telemetria de confiança: aprovações, cancelamentos, reversões, erros e tempo até valor.

## Critério de priorização

Pontue cada item de 1 a 5 em: dor, frequência, disposição a pagar, diferenciação, confiança e complexidade. Comece pelos itens com alta dor, alta frequência e baixa complexidade. Itens que ampliam autonomia só entram depois de logs, grants, approval gates e rollback.

## Referências visuais adicionadas

- `images/saas-workspace-dashboard.png` — estrutura de workspace e métricas.
- `images/agent-activity-feed.png` — feed operacional e estados de agente.
- `images/agent-workspace.png` — dashboard de agentes.
- `images/pricing-inspiration.jpg` — composição de pricing.
- `images/approval-workflow.jpg` — workflow de aprovação.
- `images/computer-use-overview.webp` — metáfora visual de computer use.

As imagens são referências de estudo. Não são assets de produção nem autorização para copiar layouts ou marcas.
