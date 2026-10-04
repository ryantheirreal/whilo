# Whilo — 50 itens para produto, UI/UX e features

Este é o backlog de referência pós-pesquisa. Cada item possui uma decisão concreta para transformar inspiração em produto próprio.

## Onboarding e ativação

1. **Welcome com promessa única:** explicar em uma frase que Whilo transforma intenção em trabalho observável.
2. **Escolha de objetivo:** oferecer templates para email, viagem, pesquisa, rotina e compra.
3. **Criação de identidade:** nome, avatar, cor, pronúncia e papel do agente.
4. **Teste guiado:** executar uma tarefa read-only antes de solicitar qualquer conexão.
5. **Progressive disclosure:** mostrar permissões apenas quando a tarefa exigir.
6. **Primeiro artefato:** garantir um resultado salvo na primeira sessão.
7. **Estado vazio útil:** substituir “comece a conversar” por exemplos acionáveis.
8. **Login com confiança:** explicar dados, segurança e como sair antes do CTA.
9. **Importação opcional:** trazer preferências e memória somente com consentimento explícito.
10. **Onboarding interrompível:** permitir pular etapas e retomar depois.

## Agentes e conversas

11. **Um agente por conversa:** contexto, histórico, grants e atividade isolados.
12. **Agent picker:** trocar de agente no cabeçalho sem perder a thread.
13. **Drawer de sessões:** criar, renomear, arquivar e buscar conversas.
14. **Especialistas visíveis:** Atlas para viagens, Milo para inbox, Scout para pesquisa e Whilo para coordenação.
15. **Thread title inteligente:** sugerir título, permitir edição e mostrar última atividade.
16. **Thinking legível:** explicar a próxima etapa sem exibir raciocínio privado.
17. **Fila de mensagens:** mostrar o que está aguardando enquanto o agente trabalha.
18. **Stop seguro:** cancelar o turno sem perder mensagens e estado.
19. **Retry idempotente:** repetir uma etapa sem duplicar email, pagamento ou artefato.
20. **Receipts de execução:** registrar ferramentas, fontes, outputs e duração.

## UI visual e interação

21. **Navbar central:** avatar, nome, status online/offline e acesso à atividade.
22. **Sistema de cores por estado:** azul para neutro, verde para concluído, âmbar para revisão e vermelho para bloqueio.
23. **Mascote com função:** avatar expressa estado, não apenas decoração.
24. **Cards de ferramenta:** ação, motivo, escopo, risco, custo, fonte e CTA.
25. **Bottom sheet de revisão:** detalhes suficientes para decidir sem abandonar a conversa.
26. **Activity View:** visão global de in-progress, scheduled, completed e failed.
27. **Responsividade real:** mobile-first, desktop com painel lateral e teclado completo.
28. **Acessibilidade:** contraste, foco, labels, reduced motion e screen reader.
29. **Microinterações úteis:** transições indicam estado; não mascaram latência.
30. **Deep links:** abrir diretamente a aprovação, receipt, Space ou conector.

## Voz e multimodalidade

31. **Voice call persistente:** chamada compartilha thread e permissões com texto.
32. **Captions separadas:** distinguir fala do usuário e do agente.
33. **Interrupção natural:** usuário pode interromper sem quebrar a tarefa de backend.
34. **Tool handoff:** voz delega trabalho longo e retorna com receipt.
35. **Latência visível:** mostrar “ouvindo”, “pensando”, “usando ferramenta” e “respondendo”.
36. **Anexos multimodais:** imagem, áudio, PDF e screenshot entram na mesma conversa.
37. **Modo silencioso:** notificações e respostas podem ser reduzidas a cards.
38. **Dispositivo periférico:** explorar display de status e push-to-talk como extensão futura.

## Conectores, segurança e confiança

39. **Connector center:** apps, escopos, último uso, health check, reauth e revoke.
40. **Grants por agente:** nenhum especialista herda automaticamente o acesso de outro.
41. **Quatro níveis de ação:** read, draft, prepare e execute.
42. **Aprovação com payload:** destinatário, valor, domínio, prazo, hash e idempotency key.
43. **Fail-closed retrieval:** conteúdo ambíguo ou não autorizado não aparece.
44. **Credenciais fora do modelo:** tokens e dados de pagamento ficam em vault.
45. **Audit trail:** registrar intenção, tool call, resultado, aprovação e mudança.
46. **Pause global:** pausar agente e todas as rotinas sem apagar contexto.

## Commerce, viagens e retenção

47. **Travel compare:** preço, horários, flexibilidade, fontes e trade-offs antes de booking.
48. **Purchase handoff:** merchant, total, taxas, política de retorno e aprovação antes do checkout.
49. **Spaces e Pages:** todo resultado importante vira documento editável e pesquisável.
50. **Loop de valor:** cada tarefa concluída sugere próximo passo, template ou rotina, sem spam.

## Critério de aceite

Cada item só deve ser considerado pronto quando possui: estado vazio, loading, sucesso, erro, cancelamento, revisão, acessibilidade, analytics e teste de permissão. A referência visual nunca substitui o comportamento real.
