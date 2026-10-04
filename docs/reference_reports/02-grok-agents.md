# Grok Bot: agentes e bots persistentes — referências para Whilo

## O produto muda a unidade de trabalho

Grok Bot foi apresentado como uma equipe de agentes sempre disponíveis: o usuário delega uma tarefa em linguagem natural, os bots trabalham em ferramentas e aplicações, continuam em segundo plano e voltam quando precisam de uma decisão humana. A diferença de produto não é apenas “chat com ferramentas”; é dar um responsável durável a um resultado recorrente. A publicação de lançamento descreve fluxos de vendas, operações e engenharia que terminam no sistema de trabalho — como atualizar um CRM, preparar mensagens ou reproduzir um erro — em vez de parar num rascunho de chat. Esses exemplos são afirmações de produto, não medidas independentes de qualidade ou eficiência. [1]

Na retrospectiva de design, a equipe resume o modelo em cinco objetos: **Bots** persistentes, **chats** para conversar com cada Bot, **prompts** usados uma vez ou guardados como Skills e Routines, **ferramentas** para agir em software e **artefatos** produzidos pelo trabalho. A escolha de organizar a navegação em torno dos Bots, e não do histórico de conversas, dá continuidade a papéis que devem ser retomados ao longo do tempo. O restante da infraestrutura fica menos visível até ser necessário. [2]

A interface serve a três perguntas práticas: quem é o Bot, o que está fazendo e se precisa de atenção. A lista lateral usa nome e avatar como identidade persistente; estados como pensando, trabalhando, esperando ou concluído comunicam progresso. O detalhe da ação fica disponível sob demanda, para que a tela não force a pessoa a acompanhar cada clique. O computador do Bot também pode ser aberto para inspeção, mas o produto procura mantê-lo como área de trabalho do agente, não como painel que exige supervisão contínua. [2] [6]

O chat continua sendo o espaço de instrução e revisão. A conversa pode mostrar atividade de ferramentas, arquivos, perguntas, pedidos de aprovação e mensagens de voz. É possível corrigir trabalho em andamento, direcionar uma tarefa a um Bot com `@`, responder em uma thread ou interromper o agente; a interrupção não desfaz ações que já ocorreram. Grupos de dois a seis Bots tornam os repasses visíveis, e o material de produto recomenda indicar um responsável por etapa para reduzir atualizações duplicadas e ruído. [9]

## Onboarding: do papel ao primeiro resultado

O onboarding privilegia uma conversa em vez de exigir que a pessoa desenhe uma automação antes de experimentar. No primeiro uso, Grok Bot explica Bots, computador compartilhado e rotinas, pergunta quais ferramentas a pessoa usa e usa as respostas para sugerir colegas-agentes. Essa seleção não autentica nem modifica as ferramentas. A pessoa escolhe um papel sugerido ou cria um Bot com nome, responsabilidade principal e descrição operacional. [4]

A documentação recomenda que o primeiro pedido especifique cinco coisas: resultado esperado, fontes, limites, formato de entrega e ponto de revisão. Sugere começar com uma tarefa curta e verificável — por exemplo, resumir um documento ou preparar uma análise sem alterar o sistema de origem — e só depois usar ferramentas conectadas. Ao chegar a uma autenticação, o agente pede que a pessoa assuma o controle para entrar; senhas e códigos de verificação não devem ser enviados no chat. [4] [6]

A conversão em automação é gradual. Primeiro se conclui e corrige uma tarefa pontual; depois o método pode ser salvo como **Skill**, com entradas, passos, regras, checagens e limites de aprovação. Uma rotina diz **quando** rodar aquela tarefa — em horário definido ou, onde houver suporte, em resposta a evento. Demonstração pelo computador pode gerar uma Skill em rascunho, que deve ser revista e testada antes de agendar. Para uma rotina, a documentação pede fuso horário, fonte atual, política para dados ausentes, tratamento de falhas e teste com entrada segura. [7] [13]

Essa sequência de baixo risco também aparece na análise independente de João Queirós: preparar um resultado revisável, provar a repetibilidade, então programar e monitorar. O autor distingue suas próprias recomendações das funcionalidades descritas oficialmente, portanto seu texto serve como perspectiva operacional, não como especificação do produto. [18]

## Persistência, memória e limite de confiança

Um Bot mantém um nome, uma função, uma conversa e contexto de trabalho. A memória documentada abrange preferências estáveis, fatos relevantes e resumos de tarefas anteriores; o usuário pode corrigir a descrição do papel e pedir que preferências duráveis sejam incorporadas. A própria documentação alerta que memória não substitui a fonte de verdade: para decisões relevantes ou fatos que mudam, o Bot deve consultar a fonte atual e citar ou reabrir os dados. [3] [5]

Um detalhe importante para Whilo é a fronteira do ambiente persistente. A comunicação de lançamento fala do computador do Bot; a documentação técnica atual esclarece que **todos os Bots de uma conta compartilham um computador em nuvem**. Arquivos, sessões de navegador e credenciais de linha de comando podem ser comuns. Cada Bot tem sua tela e seu contexto conversacional, mas isso não constitui isolamento de segurança. Conectores instalados também ficam disponíveis para os Bots da conta. [1] [3] [6]

Essa conveniência melhora a passagem de trabalho — um agente pode ler um arquivo preparado por outro sem novo envio — mas implica que os perfis dos Bots não devem ser usados como fronteiras de acesso. A documentação corporativa separa usuários entre si, mas mantém compartilhamento dentro da conta do usuário. Também recomenda remover credenciais e arquivos temporários e revogar o conector no serviço de origem quando o acesso deixa de ser necessário. [8] [12]

Para equipes, Grok Bot distingue um Bot pessoal de um **Team Bot**. O proprietário configura plugins, arquivos, Skills e segredos para um trabalho compartilhado; cada colega tem sua própria conversa privada. A memória pode guardar fatos para a equipe ou notas privadas de cada usuário. Um conector pessoal usa a identidade de quem está falando, enquanto segredos adicionados ao Team Bot ficam disponíveis ao agente em todas as conversas desse Bot. Rotinas criadas com um Team Bot pertencem a cada usuário, não rodam automaticamente para toda a equipe. [11]

## Conectores e ferramentas

As integrações estruturadas são instaladas como plugins no Marketplace. A pessoa pode referenciar um conector com `@` na tarefa e uma Skill com `/`. A recomendação oficial é preferir o conector quando disponível por ser uma via mais estruturada e previsível; o navegador pode atender serviços sem integração ou fluxos visuais que o conector não cobre. O fallback de navegador não elimina limites externos: sites podem bloquear automação, exigir nova autenticação ou demandar uma etapa humana. [6] [9] [15]

Routines acionadas por eventos são uma capacidade distinta de simplesmente ter um conector. A documentação alerta que eventos suportados dependem de integrações específicas, pede gatilhos estreitos e desaconselha escutar indiscriminadamente toda nova mensagem, o que pode gerar ruído e trabalho irrelevante. É uma distinção útil para Whilo: “pode ler dados desta aplicação” não deve sugerir automaticamente “pode acordar por qualquer evento dela”. [7]

O material oficial de times também descreve políticas administrativas de conectores, regras de aprovação e controles de rede para algumas modalidades corporativas. A disponibilidade de cada controle varia por plano, o que reforça a necessidade de apresentar no produto, de forma legível, tanto a autorização efetiva quanto a restrição imposta pela organização. [12]

## Aprovações, segurança e comércio

Grok Bot torna o limite de autonomia visível no fluxo de trabalho: a pessoa pode permitir uma ação uma vez, negar ou salvar uma regra de revisão; regras “perguntar primeiro” prevalecem sobre permissões automáticas quando ambas coincidem. A tela de aprovação deve mostrar operação, alvo e valores propostos, e a pessoa deve pedir uma explicação em linguagem simples quando não consegue reconhecer o efeito. A documentação cita envio de mensagens, publicação, compra, exclusão, mudança de permissões e alteração em produção como exemplos de ações que merecem aprovação explícita. [8] [15]

Credenciais, autenticação em dois fatores, CAPTCHA e verificações de pagamento ou identidade são etapas para entrega temporária do controle ao usuário. A política local de execução no computador pessoal é separada do ambiente em nuvem. No modo corporativo, regras administrativas podem tornar mais estritas as opções disponíveis ao indivíduo. [6] [8] [12]

No recorte de commerce, o material consultado sustenta uma conclusão limitada: **compras são tratadas como ações consequentes que devem poder parar para aprovação**. O Marketplace inclui exemplos de agentes que comparam gastos ou preparam propostas sem gastar, assinar ou enviar sem autorização. As fontes oficiais examinadas não bastam para afirmar que Grok Bot ofereça uma experiência geral de checkout autônomo ou que a execute sem confirmação; esse tipo de afirmação não deve ser inferido a partir de navegação web ou dos exemplos de produto. [8] [14] [15]

## Voz e uso entre dispositivos

Na aplicação Grok Bot, voz é um modo de interagir com o mesmo Bot persistente, não um agente separado: há ditado para compor uma mensagem editável, conversa de voz ao vivo e memorandos de voz que podem ser reproduzidos com transcrição. No celular, a pessoa também pode revisar resultados e aprovar ações. As notificações push e alguns recursos móveis estavam em implantação ou tinham diferenças frente ao desktop na documentação consultada. [9] [10] [15]

A API de voz da xAI é outra camada de produto: a documentação de desenvolvedor descreve conversação de fala para fala em tempo real com uso de ferramentas, além de APIs de transcrição e síntese. Isso mostra uma capacidade de plataforma, não prova que a experiência de voz de Grok Bot exponha todos os mesmos controles ou modelos. Para Whilo, vale separar nitidamente as decisões de UX conversacional das capacidades de infraestrutura de voz. [16]

## Descoberta, adoção e distribuição

O Marketplace transforma papéis e procedimentos em modelos encontráveis por função. As fichas descrevem resultado, entradas, ferramentas e limites; vários exemplos prometem produzir rascunhos, listas revisáveis ou evidência sem enviar mensagens ou publicar automaticamente. Um modelo compartilhado pode ser copiado como configuração, sem transferir o computador, credenciais ou histórico do criador. Links podem ser públicos ou restritos à equipe, e a documentação alerta que a configuração exposta deve ser saneada antes da publicação. [5] [14] [15]

O Team Bot atende outra necessidade de adoção: publicar um responsável que a equipe inteira pode usar, com configuração mantida por um proprietário e conversas privadas por pessoa. A disponibilidade em Slack amplia o ponto de entrada para equipes. Esses são mecanismos de distribuição presentes no produto; as fontes abertas consultadas não trazem métricas que permitam quantificar seu efeito em aquisição, ativação ou retenção. [11] [12]

## Recomendações concretas para Whilo

1. **Organize por bots persistentes, não só pelo histórico de chat.** Dê a cada Bot identidade e responsabilidade estreitas, com uma lista que mostre atividade e necessidade de atenção. Preserve conversas e artefatos como contexto acessório ao trabalho, sem expor conceitos de infraestrutura no primeiro contato. [2] [5]

2. **Faça a primeira ativação terminar num resultado.** Sugira papéis por necessidade, mas ofereça a criação livre. No primeiro pedido, conduza o usuário a declarar resultado, fontes, limites, entrega e revisão. Use inicialmente um trabalho curto, reversível e somente de leitura; mostre o artefato e suas fontes antes de pedir para ampliar permissões. [4] [13]

3. **Transforme repetição observada em automação testável.** Mantenha distintos “como fazer” e “quando fazer”: Skills para procedimento, rotinas para execução programada ou por evento. Mostre próximo horário, fuso, histórico, erros, dados ausentes e como pausar. Exija teste com caso seguro e sinalize que uma execução de teste ainda pode alterar dados. [7]

4. **Mostre de que a memória é feita e permita corrigi-la.** Separe instruções persistentes do Bot, notas privadas e fatos compartilhados. Exiba proveniência e data para fatos relevantes; permita inspecionar, corrigir, apagar ou pedir que o Bot revalide informação atual. Nunca apresente um resumo guardado como substituto silencioso da fonte de verdade. [5] [11]

5. **Torne explícito o escopo de cada conexão.** Prefira conectores com operações e escopos claros, apresente conta usada, permissões, última autenticação e revogação. Se houver um ambiente comum a vários Bots, avise antes da conexão que sessões e arquivos podem ser acessíveis por outros agentes; não venda papéis de Bot como isolamento de segurança. Se Whilo precisar de isolamento real, ofereça um espaço ou credencial separado. [6] [8]

6. **Aprove por efeito, não por agente.** Modele níveis de risco por ação: leitura e preparo; alteração reversível; ação externa; ação financeira ou destrutiva. Para enviar, publicar, apagar, comprar ou alterar produção, mostre alvo, conteúdo, valor e consequências e exija confirmação explícita. Inclua negar, aprovar uma vez, regra futura restrita, pausa e revogação fácil. Esta é uma recomendação para Whilo, não uma equivalência literal com a política de produto da Grok Bot. [8]

7. **Use comércio como fluxo de preparação e confirmação.** Para um agente de compra, Whilo pode pesquisar e comparar opções, preparar o pedido e retornar preço total, vendedor, prazo, endereço e política de devolução para revisão. O usuário confirma o pagamento por uma etapa segura. Não inferir intenção de compra a partir de uma solicitação de pesquisa e não deixar um modelo público habilitar compra sem autorização. [8] [14]

8. **Mostre colaboração com um responsável por cada etapa.** Permita convocar um especialista e entregar um artefato com fonte e estado, mas mantenha um dono final do resultado. Evite replicar coordenação em massa sem necessidade: a própria documentação da Grok Bot alerta para mensagens redundantes quando há muitos repasses. [9]

9. **Use voz para iniciar, verificar e revisar, sem ocultar decisões.** Ditado editável pode acelerar o pedido; voz ao vivo e resumos em áudio podem ser úteis em movimento. Mantenha no transcript a transcrição, o estado do trabalho e os mesmos cartões de revisão disponíveis por texto. Trate controles de aprovação e de áudio como interfaces do mesmo fluxo persistente, não como modos isolados. [9] [10]

10. **Distribua modelos com segurança e meça o funil.** Ofereça modelos por tarefa e função com prévia do que será copiado, das ferramentas exigidas e das ações proibidas. Instalar um modelo não deve autenticar serviços automaticamente. Separe modelos públicos de Bots mantidos para equipe e facilite o saneamento de segredos. Para avaliar adoção, instrumente tempo até o primeiro resultado útil, proporção de tarefas repetidas, falhas de rotina, pedidos de aprovação, cancelamentos e revogações — métricas propostas para Whilo; nenhuma taxa de crescimento foi encontrada nas fontes consultadas. [5] [11] [12] [14]

## Referências

[1]: https://x.ai/news/introducing-grok-bot "Introducing Grok Bot — xAI"
[2]: https://x.ai/news/designing-grok-bot "Designing Grok Bot for a world of persistent agents — xAI"
[3]: https://docs.x.ai/grok-bot/overview "Grok Bot Overview — xAI Documentation"
[4]: https://docs.x.ai/grok-bot/get-started "Get started — Grok Bot Documentation"
[5]: https://docs.x.ai/grok-bot/bots "Create and manage Bots — Grok Bot Documentation"
[6]: https://docs.x.ai/grok-bot/computer-and-apps "Use the computer and apps — Grok Bot Documentation"
[7]: https://docs.x.ai/grok-bot/skills-routines-and-automations "Skills and routines — Grok Bot Documentation"
[8]: https://docs.x.ai/grok-bot/approvals-security-and-privacy "Approvals, security, and privacy — Grok Bot Documentation"
[9]: https://docs.x.ai/grok-bot/chat-and-collaboration "Message and collaborate — Grok Bot Documentation"
[10]: https://docs.x.ai/grok-bot/mobile "Grok Bot for Mobile — Grok Bot Documentation"
[11]: https://docs.x.ai/grok-bot/team-bots "Team Bots — Grok Bot Documentation"
[12]: https://docs.x.ai/grok-bot/teams-and-enterprises "Grok Bot for teams and enterprises — Grok Bot Documentation"
[13]: https://docs.x.ai/grok-bot/use-cases "Use cases — Grok Bot Documentation"
[14]: https://x.ai/bot/marketplace "Grok Bot Marketplace — xAI"
[15]: https://docs.x.ai/grok-bot/faq "Frequently asked questions — Grok Bot Documentation"
[16]: https://docs.x.ai/developers/model-capabilities/audio/voice "Voice Overview — xAI Developer Documentation"
[17]: https://composio.dev/content/guide-to-frok-bot "A Guide to Grok Bot: How xAI's Always-On AI Teammates Work — Composio"
[18]: https://www.ai.joaoqueiros.com/blog/grok-bot-always-on-ai-agent-teams-routines-skills-security "Grok Bot Guide: Always-On AI Agents, Routines, and Limits — João Queirós"
