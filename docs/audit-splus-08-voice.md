# Auditoria S+ — voice call e multimodalidade

**Veredito: não atinge S+. Nota de prontidão: 31/100.** A nota é uma avaliação qualitativa de prontidão do eixo de voz, não um benchmark. O que existe é um protótipo de ditado seguido de leitura em voz alta, limitado à Web Speech API no navegador. A tela chama isso de “voice call”, mas não há chamada de áudio em tempo real, WebRTC, conversa de áudio bidirecional, barge-in funcional nem implementação nativa para iOS/Android.

Não alterei código de produção. O único artefato novo neste repositório é este relatório.

## Caminho real do áudio e da execução

O fluxo implementado é: microfone do navegador → `SpeechRecognition` do Web Speech API → resultado final de texto → `sendVoice()` → `ConversationQueue` → mensagem de usuário no agente CopilotKit/AG-UI existente → resposta textual e chamadas de ferramentas normais → síntese de voz do texto final por `speechSynthesis` do navegador. Os pontos centrais estão em `apps/mobile/src/voice-call.tsx:25–31, 68–96, 119–186`, `apps/mobile/src/chat.tsx:334–377, 422–428, 434–440, 758–763` e `apps/mobile/src/conversation-queue.ts:17–45`.

Portanto, **o microfone não envia uma faixa de áudio ao agente Whilo**: a camada VoiceCall só recebe texto transcrito e chama o mesmo caminho de chat. É positivo que a solicitação de voz acione o agente e as ferramentas de chat existentes, mas não se preservam sinais acústicos, não há saída de áudio gerada em streaming e não há uma sessão de voz persistente ou identificador de chamada associado ao transcript.

## Estado das capacidades

| Capacidade | Estado | Evidência no checkout |
|---|---|---|
| Fala para texto no navegador | **Parcial** | `SpeechRecognition`/`webkitSpeechRecognition`, `pt-BR`, resultados finais (`voice-call.tsx:25–31, 126–137`). É a API do browser, com disponibilidade limitada e possível processamento remoto por alguns navegadores. [1] |
| Texto para fala no navegador | **Parcial** | `SpeechSynthesisUtterance` apenas depois de existir resposta de texto completa (`voice-call.tsx:68–96`). Não funciona no runtime nativo porque depende de `window`. |
| Integração com a fila e chat | **Já existe, parcial para voz** | `sendVoice` passa texto para `enqueue`; a fila serializa turnos e pausa após erro (`chat.tsx:422–428`; `conversation-queue.ts:17–45`). Não há fila de voz específica, limite de backlog nem sinal de cancelamento ligado à chamada. |
| Streaming textual e ferramentas AG-UI | **Já existe no chat** | `runAgent` é executado pelo agente de chat e aguarda refresh/persistência (`chat.tsx:334–363`). Voz não consome áudio ou eventos de fala em streaming; a saída falada espera a conclusão da execução. |
| WebRTC / API Realtime / conversa áudio-a-áudio | **Ausente** | Não encontrei `RTCPeerConnection`, `getUserMedia`, canal de dados, transporte WebSocket de áudio nem cliente Realtime em `apps/mobile/src`, dependências ou configuração nativa. |
| Barge-in e interrupção semântica | **Ausente** | Durante a resposta, outra fala reconhecida é enfileirada; enquanto o TTS fala, a captura é parada. Desligar VoiceCall interrompe captura/TTS local, mas não chama `stopAgent()` (`voice-call.tsx:79–90, 111–117, 174–181`; `chat.tsx:395–401`). |
| Transcript de voz, legendas e revisão antes do envio | **Parcial / ausente** | O texto reconhecido vira mensagem normal de usuário, mas o widget não mostra uma transcrição para corrigir antes de submeter nem mantém recibo de chamada/captions. `onresult` chama o agente diretamente (`voice-call.tsx:131–138`). |
| Consentimento e divulgação de tratamento de áudio | **Parcial** | A chamada só inicia após toque explícito e o browser pode pedir permissão. Não há explicação própria sobre transcrição, provedor, processamento possivelmente remoto, retenção do texto, nem opção de rever/corrigir a fala antes de ela entrar no agente. |
| Captura/reprodução nativa | **Ausente** | `recognitionConstructor()` retorna `undefined` fora de `Platform.OS === "web"`; o controle ainda abre e se intitula chamada ativa, mas apresenta mensagem de incompatibilidade. Também não há `expo-audio`, `expo-speech` ou WebRTC nativo em `apps/mobile/package.json:16–38` ou permissões/plugins de áudio em `apps/mobile/app.json:11–19`. |
| Testes de voz e telemetria de latência | **Ausente** | Os testes móveis encontrados cobrem fila, endereço do browser e Markdown; não há teste de `VoiceCall`, ciclo do microfone, síntese, interrupção ou permissões. Não encontrei métricas de latência da voz. |

Há ainda divergência de contrato: `apps/server/src/o1/capabilities.ts:47` declara um “Realtime Voice Runtime” com sessão persistente, transcrição e interrupção, e `ROADMAP.md:27` ainda apresenta voz como extensão futura. O runtime efetivo não satisfaz a capacidade declarada. Trate o item do catálogo como intenção, não como funcionalidade disponível, até ligar a implementação e a validação de ponta a ponta.

## Achados de maior risco

### 1. A interface apresenta chamada funcional onde iOS e Android não têm entrada ou saída de voz — **P0, risco alto, valor alto**

`recognitionConstructor()` retorna `undefined` para qualquer runtime que não seja Web (`voice-call.tsx:25–31`). Ainda assim, o controle pode abrir (`174–186`) e a interface exibe “Voice call ativa” (`212–220`). O texto de erro sugere Chrome, Edge ou Safari, mas nem isso é uma garantia de suporte da API. A fala de saída igualmente retorna sem fazer nada quando não há `window.speechSynthesis` (`68–76`). Isso torna a affordance enganosa nos builds nativos que a própria app exporta.

**Implementação imediata:** calcular capacidade antes de habilitar o botão; em ambiente sem entrada e saída suportadas, desabilitar VoiceCall e oferecer ditado/entrada textual por uma alternativa real. Não rotular a capacidade parcial como “chamada ativa”. A captura web deve verificar secure context, API, permissão e falhas de reprodução e apresentar um estado explícito e acionável.

**Dependências:** nenhuma para corrigir a promessa visual; para suporte nativo, aprovar uma solução de captura, STT e reprodução compatível com Expo e com os builds de produção.

### 2. Não é voz em tempo real: a latência inclui transcrição, fila, execução completa e TTS final — **P1, risco alto, valor alto**

`interimResults` é `false` (`voice-call.tsx:128–130`), então o usuário aguarda um resultado final do reconhecimento. O texto só é enviado após `onresult` (`131–138`). O assistente não começa a falar durante a geração: o efeito de voz retorna enquanto `replying` é verdadeiro (`68–69`). Em `chat.tsx`, `busy` só cai depois do `runAgent`, `refresh`, `refreshAgent` e `saveHistory` (`334–363`); só então VoiceCall aguarda mais 250 ms e sintetiza a resposta inteira (`voice-call.tsx:68–96`). Não há métrica para quantificar esse atraso, mas há várias etapas seriais observáveis antes da primeira fala.

A documentação oficial do OpenAI Realtime descreve voz-para-voz sem uma etapa intermediária STT→texto→TTS e uma sessão com mídia e eventos em tempo real; a documentação recomenda WebRTC para clientes browser/mobile por consistência de desempenho. [2] [3] OpenAI também documenta VAD, eventos de transcrição e chamadas de ferramentas dentro dessa sessão. Isso é uma arquitetura alternativa, **não algo que o código Whilo já esteja usando**.

**Implementação:** escolher explicitamente entre (a) “ditado para chat”, que mantém fila e transcript editável, ou (b) “conversa por voz”, com transporte de áudio full-duplex, fala de saída incremental, VAD e métricas ponta a ponta. Não vender (a) como (b). Instrumentar timestamps para início/permissão do microfone, fala detectada, transcript final, enqueue/início da fila, primeiro chunk textual, início/primeiro áudio, tools e hang-up; acompanhar p50/p95 por plataforma e condições de rede.

### 3. Não há barge-in; hang-up não para o trabalho do agente — **P0, risco alto, valor alto**

O listener continua habilitado enquanto `replying` é verdadeiro, então fala adicional pode ser aceita e enfileirada em vez de interromper a geração/ferramenta atual (`voice-call.tsx:131–138`; `conversation-queue.ts:29–45`). Quando a síntese de voz começa, o código desliga `shouldContinue` e para o recognizer antes de chamar `speechSynthesis.speak()` (`voice-call.tsx:78–90`); não é possível interromper verbalmente o áudio mantendo a chamada. Há apenas `speechSynthesis.cancel()` ao desligar a UI, sem cancelar o turno AG-UI. O botão de stop do chat, por outro lado, pausa a fila e chama `copilotkit.stopAgent()` (`chat.tsx:395–401`).

Isso é uma lacuna operacional para comandos com efeitos: ao “encerrar chamada”, a pessoa pode acreditar que o trabalho foi cancelado quando só microfone e áudio local pararam. A fila também aceita follow-ups durante uma operação longa, sem limite e sem um estado específico no widget que diga quantos comandos vão ser executados.

**Implementação:** separar “silenciar mic”, “interromper fala”, “parar geração” e “cancelar tarefa”; mostrar cada efeito e o estado do run. No modo ditado, fechar VoiceCall não deve fingir cancelar a tarefa: oferecer o mesmo Stop do chat e propagar `AbortSignal` quando cancelamento de fato for suportado. Limitar e exibir backlog da fila; não converter fala durante TTS em comandos invisíveis. Para WebRTC, ligar VAD/barge-in a cancelamento de resposta e clear/truncate da mídia de saída, guardando o transcript da fala realmente ouvida.

### 4. Web Speech não dá suporte/previsibilidade de produto suficiente e o ciclo de restart é frágil — **P1, risco alto, valor alto**

O suporte a `SpeechRecognition` é classificado como “Limited availability” pelo MDN. Em alguns browsers, como Chrome, a fala é enviada a um serviço de reconhecimento; essa implementação não define `processLocally` nem deixa claro ao usuário onde ocorre o reconhecimento. [1] A dependência em nomes globais e a mensagem de compatibilidade em `voice-call.tsx:25–31, 119–124` não substituem uma feature check testada por dispositivo/browser.

A sessão usa `continuous = true`, desabilita intermediários e reinicia toda vez que o recognizer termina após uma espera fixa de 160 ms (`126–160`). Os erros permanentes, de rede, ausência de fala e interrupção recebem quase o mesmo tratamento; após erro que não seja `not-allowed`, `shouldContinue` continua verdadeiro e `onend` tenta reiniciar. O `start()` inicial engole a exceção (`164–171`) e marca `listening` antes de confirmar início real (`164–166`). Também só lê `results[event.resultIndex]` em vez de percorrer e deduplicar todos os resultados finais a partir desse índice (`131–138`). Finalmente, `SpeechRecognition.stop()` pode entregar um resultado final; a UI marca `shouldContinue = false` antes de chamar `stop()` tanto ao falar quanto ao desligar, e o handler descarta resultados quando esse flag está falso (`78–80, 111–115, 131–133`).

**Implementação:** encapsular a API num adaptador testável; tratar `isFinal`, todos os resultados novos e deduplicação; separar `stop` (drenar resultados finais) de `abort` (descartar explicitamente); mapear erros transitórios/permanentes; impor backoff e limite de retries; refletir `onstart`/`onend` no estado real. Para privacidade local, só oferecer modo offline quando o browser reconhecer suporte on-device e o pacote de idioma estiver disponível — não presumir que Web Speech é local. [1]

### 5. Consentimento e precisão não são tratados como parte do fluxo de ação — **P1, risco alto, valor alto**

O toque explícito e o prompt do sistema são positivos. Porém, o widget apresenta apenas instruções de uso (`voice-call.tsx:222–229`); não explica se há processamento remoto, se o texto transcrito será salvo no chat, nem mostra uma confirmação/correção antes de `onTranscript` enviar o resultado ao fluxo que pode executar tools (`131–138`, `chat.tsx:422–428`). O browser é que pode fazer o reconhecimento por serviço externo; o código não fornece uma escolha ou política Whilo de STT. [1]

**Implementação:** antes da primeira sessão, explicar que o microfone fica ativo, como a fala é processada, que transcript entra no chat e como removê-lo. Mostrar o transcript reconhecido com editar/enviar, ou oferecer modo autoenvio claramente opt-in. Continuar usando a política existente de autorização/aprovação para ações externas; a precisão do STT nunca deve substituir aprovação para enviar, comprar, publicar ou alterar dados.

### 6. Transcript é mensagem de chat, não registro auditável da chamada — **P1, risco médio-alto, valor alto**

A mensagem reconhecida usa a persistência normal do chat e o texto final do agente é a fonte do TTS; isso preserva contexto útil. Porém, o widget não apresenta captions, não associa mensagem a `callId`, não grava estados de transcrição/interrupção e não permite recuperar o ponto da chamada depois de hang-up. Não há áudio armazenado pelo código VoiceCall, mas isso não prova processamento local pelo browser. A variável `spoken.current` não é resetada ao fechar a chamada ou trocar a conversa (`voice-call.tsx:49, 91`), portanto uma resposta textual idêntica em uma sessão posterior pode não ser falada de novo.

**Implementação:** decidir retenção e exclusão do transcript; salvar `callId`, início/fim, mensagens do usuário e assistente, estado de interrupção e âncora de thread, sem salvar áudio por padrão. Mostrar captions em tempo real e identificar respostas cortadas como incompletas. OpenBot demonstra um transcript ordenado por IDs de itens, marcador explícito para resposta interrompida, salvamento/recuperação de recibos sem armazenar áudio (`openbot/app/src/lib/voice/transcript.ts:12–108`; `outbox.ts:14–63`). [10]

## Comparação com padrões oficiais

**OpenAI Realtime / WebRTC.** OpenAI descreve sessão speech-to-speech com mídia do microfone via `getUserMedia`/`RTCPeerConnection`, áudio remoto e canal de eventos; VAD e function calls são parte da mesma sessão. [2] [3] Isso é materialmente diferente do Web Speech → texto AG-UI → síntese de browser do Whilo. Para credenciais, o guia oficial mantém a API key normal no backend, mediando a inicialização SDP, ou emite client secret efêmero pelo backend; não se coloca chave normal no cliente. [3] Whilo não tem rota de sessão, credencial efêmera ou client Realtime no escopo auditado.

**OpenDots.** `src/client/useVoice.ts` implementa `getUserMedia`, `RTCPeerConnection`, canal `oai-events`, saída de áudio remota, captions, transcript, mute, hang-up e fechamento dos tracks; quando recebe `response.function_call_arguments.done` para `ask_compute`, chama `/voice/calls/:id/compute`, retorna o resultado como `function_call_output` e pede nova resposta (`228–270`). A configuração documentada mantém `VOICE_API_KEY` no servidor e usa WebRTC; hospedagem precisa de HTTPS. [5] [7] É um exemplo próximo para a experiência browser. Contudo, seu README de demo diz explicitamente que a delegação falada de compute e a interrupção completa ainda precisavam de verificações dedicadas; a gravação não é benchmark de latência. Não use o demo como prova de barge-in em produção. [6]

**OpenBot no checkout.** O submodule `openbot` está no commit `cb5dc32a44517622c6db4e527e61d3abb389b43c`, que também é o `main` oficial verificado durante a auditoria; o `.gitmodules` local aponta para um fork. É referência browser, não solução nativa pronta. A `VoiceSession` tem state machine, `AbortController`, limite de conexão e de duração, eventos de VAD/transcrição, transcript de saída e ponte restrita `ask_agent` para o AG-UI existente (`openbot/app/src/lib/voice/session.ts:6–18, 36–65, 109–192, 232–369`). O provider server-side configura `semantic_vad` com `interrupt_response` e `create_response`, transcrição de entrada e um único tool `ask_agent` (`openbot/server/src/voice/provider.ts:65–108, 220–246`); as rotas exigem usuário autenticado, limitam tentativas e validam SDP (`openbot/server/src/voice/routes.ts:18–49, 53–87, 98–123`). O transcript reconhece cortes em vez de apresentar texto não ouvido como concluído (`openbot/app/src/lib/voice/transcript.ts:27–43, 98–108`). [10] [11] [12]

**OpenMuse.** Não é evidência de voice shipped. A lista de extensões da versão atual e o roadmap têm “voice input/replies” como trabalho futuro, sem runtime de voz implementado. [8] [9] Use OpenMuse como referência de honestidade de inventário/plano, não como comparador de voz.

## Plano recomendado

### P0 — tornar o comportamento atual honesto e interrompível

1. Não habilitar “Voice call” em iOS/Android enquanto não houver captura e playback nativos. No browser, detectar suporte real e exibir erro/alternativa antes de abrir uma chamada fictícia.
2. Distinguir parar gravação, cancelar síntese, parar run do agente e encerrar UI. Se o usuário encerra voz durante um run, oferecer explicitamente o mesmo controle de Stop do chat; não prometer cancelamento se o run continuar.
3. Mostrar transcript reconhecido antes do enqueue, com corrigir/enviar e modo autoenvio separado. A aprovação de tool continua centralizada no servidor.
4. Corrigir restart/result handling e definir limites de fila e estado visível dos follow-ups. Adicionar testes para permissão negada, `onend`, erros de rede, resultados finais no stop, resposta repetida, fechar enquanto o agent está rodando e fila cheia.
5. Atualizar catálogo/roadmap para dizer “ditado + TTS web experimental” até que `voice-runtime` e “chamada” tenham critérios verificáveis.

### P1 — dar suporte multiplataforma sem prometer realtime

Avaliar `expo-audio` para permissão/captura/stream PCM nos alvos Android, iOS e Web, e selecionar separadamente um STT compatível com os requisitos de privacidade e um TTS nativo para playback. O Expo documenta permissão de gravação e API de áudio nesses alvos; isso não fornece, por si só, STT, modelo conversacional, VAD semântico ou WebRTC. [4] Definir textos iOS/Android de permissão e configurar os plugins nativos necessários. Testar builds de produção, áudio em modo silencioso, interrupção por telefone/fone Bluetooth, app em background, revogação de permissão e falha de rede.

### P1 — evoluir para conversa Realtime apenas com arquitetura e gates explícitos

1. Escolher um único provider/transport por implantação. Para browser, WebRTC é a opção documentada pelo OpenAI; para Expo nativo, exigir uma biblioteca/SDK com peer/media nativo e validar a matriz de devices antes de declarar suporte. [3]
2. Criar endpoint autenticado no servidor para abrir sessão, aplicar rate/usage limits e manter segredo normal fora do cliente; passar configuração de sessão com VAD, `pt-BR`, transcript de entrada e saída, timeout e limites. OpenAI documenta sessão unificada via SDP ou client secrets efêmeros emitidos pelo servidor. [2] [3]
3. Encaminhar somente um tool de delegação estreito — por exemplo `ask_whilo` — para o agente AG-UI existente. Validar `call_id`, tamanho e schema; deduplicar, propagar abort, impor política de concorrência e retornar resultado/erro estruturado. Não duplicar conectores email/browser/compra na sessão de voz: a política atual e as aprovações do servidor devem continuar sendo a única autoridade.
4. Implementar barge-in real: detectar fala, interromper/cancelar resposta e áudio pendentes, sincronizar truncate/clear com o transcript e retomar escuta. Um “mic mute” não é barge-in.
5. Antes do rollout, medir p50/p95 de conexão, fala→caption parcial/final, fala→primeiro áudio, interrupção→silêncio, tool→resposta de voz; testar transcript truncado, event ordering, dupla chamada, hang-up durante handshake/tool, falha de permissão e retoma de thread.

## Conclusão

A fila e a integração ao agente textual são um bom ponto de partida: não criam uma segunda rota de ferramentas, e os follow-ups respeitam execução serial. Isso sustenta um modo de **ditado para chat no browser**, não um voice call S+. Os gaps bloqueadores são o falso suporte nativo, a ausência de voz bidirecional em streaming, a falta de interrupção/cancelamento transparente, o reconhecimento não controlado por política própria e a falta de transcript corrigível/consentimento específico. Corrija P0 antes de ampliar exposição; depois decida entre manter o modo de ditado com nome e fallback honestos ou investir explicitamente na arquitetura Realtime multiplataforma.

## Referências

[1]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition "MDN — SpeechRecognition: disponibilidade e processamento"
[2]: https://developers.openai.com/api/docs/guides/realtime-conversations "OpenAI — Realtime conversations"
[3]: https://developers.openai.com/api/docs/guides/voice-webrtc "OpenAI — WebRTC para voice agents"
[4]: https://docs.expo.dev/versions/latest/sdk/audio/ "Expo — Audio, permissões e captura de áudio"
[5]: https://github.com/CopilotKit/OpenDots/blob/main/src/client/useVoice.ts "OpenDots — cliente WebRTC de voz"
[6]: https://github.com/CopilotKit/OpenDots/blob/main/docs/demos/README.md "OpenDots — evidência e limites do demo de voz"
[7]: https://github.com/CopilotKit/OpenDots/blob/main/docs/SETUP.md "OpenDots — setup e configuração do provider de voz"
[8]: https://github.com/CopilotKit/OpenMuse/blob/main/docs/FEATURES.md "OpenMuse — inventário de capacidades implementadas"
[9]: https://github.com/CopilotKit/OpenMuse/blob/main/ROADMAP.md "OpenMuse — roadmap"
[10]: https://github.com/CopilotKit/OpenBot/blob/main/app/src/lib/voice/session.ts "OpenBot — sessão e estado Realtime"
[11]: https://github.com/CopilotKit/OpenBot/blob/main/server/src/voice/provider.ts "OpenBot — provider, VAD e ferramenta de delegação"
[12]: https://github.com/CopilotKit/OpenBot/blob/main/server/src/voice/routes.ts "OpenBot — autorização e rotas de voz"
