# Whilo — Mobile Conversations 02

## Objetivo

Substituir o dashboard estático do Preview mobile por uma experiência de conversa inspirada nos padrões já presentes no Whilo/OpenBot/OpenMuse: uma conversa por agente, sessões paralelas, seleção rápida e execução visual de ferramentas.

## Entrega

- `apps/mobile/src/mobile-preview.tsx` cria a superfície mobile conversacional.
- Cada agente tem identidade, papel, status, unread count e última atividade.
- Drawer de **Conversations** abre novas sessões e troca entre agentes.
- Sessões são mantidas em estado local e permanecem separadas por `sessionId`.
- Mensagens usam bubbles user/agent e quick actions contextuais.
- Email, viagem e compra renderizam tool cards com revisão antes de execução.
- Voice call abre uma tela dedicada com o agente ativo.
- `PreviewApp` usa o novo shell em viewports menores que 850px; desktop continua disponível.

## Padrões aproveitados

- Semântica de `main thread` e `side chat` existente em `src/threads.tsx`.
- Seleção de conversas e agentes em vez de navegação apenas por dashboard.
- Bubbles e tool renderers já presentes em `src/chat.tsx`.
- Mascote oficial Whilo compartilhado entre header, agentes e voice call.
- Regra de segurança mantida: ações externas são apenas preparadas/revisadas no Preview.

## Validação

- `pnpm --dir apps/mobile build:web` aprovado.
- Bundle gerado com 2.711 módulos.
- Typecheck global ainda retorna apenas falhas legadas fora dos arquivos novos; nenhum erro foi reportado em `mobile-preview.tsx` ou nas linhas alteradas de `preview.tsx`.
