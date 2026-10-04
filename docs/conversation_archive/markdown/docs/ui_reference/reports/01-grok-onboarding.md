# Grok Bot: onboarding e tela de login — referências para o Whilo

O principal padrão observável é separar **entrar no produto** de **autorizar o produto a usar outros serviços**. No Grok Bot, a pessoa autentica a conta no app, recebe uma explicação sobre o modelo de agentes e o computador compartilhado, escolhe ou define um primeiro Bot e só então entrega uma tarefa e resolve os acessos externos que ela exigir. A documentação orienta começar com uma tarefa simples, revisar o resultado e transformar um processo estável em skill ou rotina. [1] [5] [6]

## O que o fluxo de login realmente mostra

A documentação de suporte é explícita: não há uma conta de login separada do Grok Bot; o app usa a conta Cursor. O fluxo descrito é tocar em **Sign in**, concluir a autenticação no navegador e voltar ao app. Se a assinatura de acesso for SuperGrok, é necessário vincular a conta Grok à conta Cursor; organizações com SSO seguem o fluxo normal da organização. [1] [2]

Na rota pública de onboarding do Cursor consultada, o texto visível oferecia login com Google, X, Apple, GitHub ou e-mail, mais uma referência a termos e política de privacidade. A página pública `accounts.x.ai` também lista esses provedores. Isso descreve o conteúdo textual dessas páginas de autenticação, não prova que cada provedor apareça em todas as telas ou estados do app. Em particular, não se deve interpretar `accounts.x.ai` como prova de que o Grok Bot tenha uma autenticação própria da xAI: o suporte e o guia de início dizem que o Bot autentica com Cursor. [2] [3] [4]

A tela de autenticação é, portanto, uma porta de entrada enxuta para uma identidade que também pode controlar acesso pago e, em contexto empresarial, SSO. A maior fricção potencial não é a quantidade de campos, mas a transição entre app, navegador e app, mais a vinculação de uma segunda conta quando a elegibilidade vem do SuperGrok. A documentação orienta manter o app aberto durante a autenticação e retornar manualmente caso ele não recupere o foco; isso mostra por que estado de retorno e tratamento de falha são partes importantes do desenho, não detalhes de implementação. [1] [2] [7]

## Onboarding: primeiro valor antes da automação

Após a autenticação, a primeira execução apresenta Bots, computador compartilhado e rotinas, pergunta quais ferramentas a pessoa usa e usa as respostas para sugerir o primeiro colega. A documentação diz que essa seleção de ferramentas **não conecta nem modifica** as contas; a configuração do computador acontece em segundo plano e o fluxo termina em **Meet a future teammate**. A separação evita pedir credenciais antes de a pessoa saber para que servirá a conexão. [1]

A pessoa pode escolher um Bot sugerido ou criar o próprio com três componentes: nome curto, trabalho principal e descrição de como trabalhar. A orientação oficial favorece agentes focados em vez de um assistente genérico; a tela de gestão permite separar regras duradouras da instrução de uma tarefa pontual. Isso reduz o esforço de configuração inicial sem exigir um construtor de workflow. [1] [9]

O próximo passo é uma tarefa real com um resultado definido. O guia sugere explicitar resultado, fontes, restrições, formato da entrega e ponto de revisão, e começa por um documento anexado que não exige login nem conector. Só depois propõe uma tarefa em uma ferramenta. Assim, o onboarding dá à pessoa uma primeira demonstração de valor antes de pedir uma permissão mais ampla. [1] [7]

O conceito de produto reaparece na interação cotidiana: conversar com o Bot como com um colega, continuar a mesma conversa em desktop ou celular, observar o trabalho e voltar quando há uma pergunta ou aprovação. Os Bots podem ser adicionados quando o trabalho realmente se divide em funções distintas; no lançamento, a xAI também descreve equipes de especialistas que trabalham em paralelo e transferem contexto entre conversas. São alegações e descrições do fabricante, não resultados de um teste independente de desempenho. [5] [13]

## Agentes, conectores e permissões

Grok Bot combina conectores instalados como plugins no Marketplace com uso do computador e navegador. O fluxo documentado de conector é abrir **Marketplace**, adicionar o plugin, autenticar no navegador quando solicitado e referenciar o conector na conversa. A recomendação da documentação é preferir o conector quando disponível, por oferecer um caminho estruturado; usar o navegador para serviços sem conector ou para uma etapa visual que a integração não cubra. [6]

A distinção importa para o consentimento: selecionar os serviços usados no onboarding é apenas personalização de sugestões; adicionar e autenticar o plugin é outra ação. Se o login acontecer numa página externa, o Bot deve ceder controle para a pessoa digitar senha, passkey, código de dois fatores ou CAPTCHA. Credenciais não devem ser enviadas como mensagem comum. As sessões de navegador persistem no computador cloud compartilhado pelos Bots daquela conta; a documentação alerta que Bot separado não equivale a fronteira de segurança independente. [1] [6] [8]

A aprovação é apresentada no contexto da conversa com a operação proposta e suas entradas. A pessoa pode **Allow once**, **Always allow** ou **Deny**; nas regras de revisão automática, **Ask first** prevalece sobre **Allow automatically**. A documentação recomenda limites explícitos para envio, publicação, compras, exclusão, mudanças de permissão e alterações em produção. Também alerta que Auto Review é baseada em modelo e complementa, mas não substitui, menor privilégio e aprovação clara. [8]

O padrão é pertinente a comércio mesmo que a tela inicial não seja uma experiência de compra: compra e transferência financeira são listadas como ações consequenciais, e a galeria de casos de uso ilustra um coordenador de viagens que compara opções e confirma antes de reservar. O papel do agente pode ser preparar a decisão; a autorização final permanece visível e atribuída à pessoa. [8] [12]

## Voz, continuidade e crescimento

A voz é uma modalidade adicional de entrada, não uma etapa obrigatória de cadastro. O Bot aceita ditado no compositor e conversa por voz; no celular, a documentação lista ditado, voice chat, memos de voz, anexos e cards de mensagem que podem ser enviados ou descartados. Desktop e mobile usam os mesmos Bots, conversas, rotinas e computador cloud. Isso permite iniciar uma tarefa no telefone e revisar seu resultado sem criar uma segunda configuração. [5] [10]

Para aquisição e ativação, o site oficial apresenta funções concretas — como Sales Outbound, Account Health, Expense Manager e Bug Reproduction — com CTA para adicionar um Bot da galeria. Essa entrada por trabalho reconhecível reduz a abstração de “agente de IA”. A página também segmenta acesso por planos Cursor, Grok e Teams; as condições e preços são mutáveis, portanto não devem ser copiados como regra permanente para Whilo. [11] [12]

Uma avaliação prática publicada por Lenny’s Newsletter relata setup rápido, interface limpa no estilo mensageria e valor dos conectores com múltiplas contas por serviço; a avaliação é de uma usuária, não um benchmark. Constellation Research interpreta curva de aprendizagem baixa, especialistas e execução paralela como diferenciais da proposta. Em conjunto com os documentos oficiais, isso favorece mostrar tarefas e exemplos antes de ensinar recursos avançados, sem concluir que o produto seja superior em desempenho. [14] [15]

## Recomendações concretas para o Whilo

1. **Deixe claro quem está entrando.** Use uma tela de autenticação curta com opções de login explícitas e link visível para privacidade e termos. Diferencie login/criação de conta Whilo de conexão com Google, CRM, calendário ou qualquer outra ferramenta. Se houver uma conta de parceiro ou assinatura para vincular, apresente esse passo depois do login principal, com motivo, estado e forma de corrigir a conta errada.

2. **Feche o ciclo do navegador.** Ao abrir autenticação externa, mantenha o app em estado “Conclua no navegador”; ao retornar, mostre confirmação de sessão, conta utilizada e próximo passo. Inclua retorno manual e recuperação de falha/expiração sem forçar a pessoa a reinstalar. Se um SSO corporativo estiver disponível, encaminhe para ele de maneira inequívoca.

3. **Mostre a promessa antes de pedir acesso.** Faça uma introdução curta de como funcionam os agentes, o que será compartilhado entre eles e onde os dados ficam. Pergunte quais ferramentas a pessoa usa apenas para personalizar os exemplos; identifique claramente esse passo como não autorizador. Dê opção de pular ou voltar para editar.

4. **Leve a uma primeira entrega segura.** Sugira um agente com uma função objetiva ou uma tarefa demonstrativa com arquivo de exemplo. Um construtor simples — nome, objetivo, fontes, limites e formato do resultado — deve ajudar a escrever a primeira instrução. Por padrão, a primeira entrega deve ser leitura, síntese ou rascunho, não envio ou alteração externa.

5. **Peça integração no momento de necessidade.** Ao iniciar tarefa que exige uma ferramenta, explique o dado e as ações necessárias; prefira OAuth/API com escopos legíveis e escolha de conta. Mostre diferença entre leitura e gravação, estado da conexão e como revogar acesso. Se só houver automação visual, anuncie o takeover humano e nunca peça senha ou código em chat.

6. **Use aprovação contextual, não consentimento genérico.** Para ações externas, mostre destino, conteúdo/valores, impacto e quem receberá a mudança; ofereça aprovar uma vez, negar e revisar. Deixe “perguntar sempre” como padrão para envio, publicação, compra, exclusão ou mudanças irreversíveis. Permissões persistentes devem ser específicas ao serviço e à ação, não um “permitir tudo”.

7. **Explique compartilhamento e limpeza.** Antes de criar múltiplos agentes ou conectar contas, informe se sessões, arquivos e credenciais são compartilhados. Forneça um painel para desconectar, revogar, pausar rotinas e remover arquivos/sessões de trabalho. Não sugira que agentes diferentes isolam dados se a infraestrutura os compartilha.

8. **Trate voz como atalho e não como atalho de segurança.** Ofereça ditado e conversa ao vivo depois que a pessoa conhece o fluxo textual. Em voz, mantenha as mesmas confirmações e cartões de aprovação usados no chat; leitura em voz alta não deve aprovar envio nem compra.

9. **Transforme sucesso em hábito sem automatizar cedo demais.** Após uma tarefa concluída, ofereça salvar formato/preferência como instrução reutilizável. Só proponha agenda ou gatilho depois de uma execução revisada; mostre próxima execução, entradas, histórico, pausar e apagar. Para descoberta, use modelos de agentes baseados em trabalhos do Whilo e exemplos de resultado, deixando claro que o modelo é editável e não uma cópia de conteúdo de terceiros.

10. **Meça o funil sem confundir acesso com ativação.** Acompanhe separadamente conclusão de login, retorno do navegador, conclusão do primeiro Bot, primeira tarefa útil, integração autorizada, primeira aprovação e revogação/erro. Compare onde as pessoas abandonam e qual tarefa gera valor; não presuma que conectar mais ferramentas seja sinal de melhor onboarding.

## References

[1]: https://docs.x.ai/grok-bot/get-started "Grok Bot — Get started"
[2]: https://cursor.com/help/grok-bot/sign-in "Sign in to Grok Bot — Cursor Help"
[3]: https://cursor.com/bot/onboarding?product=grok-bot "Cursor — Grok Bot onboarding sign-in route"
[4]: https://accounts.x.ai/ "SpaceXAI Account Management — sign-in page"
[5]: https://docs.x.ai/grok-bot/overview "Grok Bot — Overview"
[6]: https://docs.x.ai/grok-bot/computer-and-apps "Grok Bot — Use the computer and apps"
[7]: https://docs.x.ai/grok-bot/troubleshooting "Grok Bot — Troubleshooting"
[8]: https://docs.x.ai/grok-bot/approvals-security-and-privacy "Grok Bot — Approvals, security, and privacy"
[9]: https://docs.x.ai/grok-bot/bots "Grok Bot — Create and manage Bots"
[10]: https://docs.x.ai/grok-bot/mobile "Grok Bot — Mobile"
[11]: https://x.ai/bot "Grok Bot — Product page"
[12]: https://x.ai/bot/use-cases "Grok Bot — Use cases"
[13]: https://x.ai/news/introducing-grok-bot "Introducing Grok Bot — SpaceXAI"
[14]: https://www.lennysnewsletter.com/p/how-i-ai-grok-bot-grok-46whats-great "How I AI: Grok Bot + Grok 4.6—what’s great (and what’s still hype)"
[15]: https://www.constellationr.com/insights/news/spacexai-launches-grok-bot-work-assistant "SpaceXAI launches Grok Bot work assistant — Constellation Research"
