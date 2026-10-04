# Whilo — Premium Conversation 04

## Problema corrigido

O Vercel Preview apresentava uma tela visual separada do chat conectado. Isso dava aparência de produto, mas não deixava claro o que era execução, o que era revisão e o que era apenas demonstração.

## Padrões absorvidos do OpenBot

A implementação adaptou, para React Native/Expo, os contratos observados em `ConversationView`, `ChatTranscript`, `ToolRenderBoundary` e `VoiceCallWidget`:

- fila explícita quando o agente está ocupado;
- estado `Thinking` visível no transcript;
- botão **Stop this turn** em vez de deixar o usuário sem feedback;
- tool cards isolados e abrindo uma revisão própria;
- aprovação com escopo explícito e sem fingir dispatch externo;
- voice call como superfície persistente, com agente, waveform e retorno ao chat;
- sessão por agente e drawer de conversas;
- status honesto entre preparado, aguardando revisão e executado.

## Funcionalidade demonstrável

No Preview mobile, o usuário pode:

1. criar novas conversas;
2. alternar entre Whilo, Atlas, Milo e Scout;
3. enviar mensagens e ver a resposta em estado de processamento;
4. enviar uma segunda mensagem enquanto a primeira roda e observá-la na fila;
5. interromper o turno;
6. acionar cards de email, viagem e compra;
7. abrir uma revisão detalhada;
8. aprovar apenas a revisão apresentada, sem simular que um email foi enviado ou uma compra foi concluída;
9. abrir a experiência de voz e voltar para a conversa.

## Limite real

O Preview continua sendo local quando `EXPO_PUBLIC_API_URL` não existe. O modo conectado usa `ChatScreen`, CopilotKit, servidor, tools, workspace e approvals reais. O site não anuncia booking, pagamento de consumidor ou envio de email como concluídos quando esses executores não estão configurados.

## Validação

- Expo web build aprovado com 2.711 módulos.
- Falhas restantes do typecheck global estão em arquivos legados não alterados nesta entrega (`agent-ui`, `benchmark-center`, `details`, `handoff-center`, `screens`, `threads`, `workspace`).
- Nenhum erro foi reportado em `mobile-preview.tsx` ou nos arquivos de identidade do servidor.
