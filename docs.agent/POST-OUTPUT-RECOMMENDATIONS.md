# Whilo — recomendações pós-output

## Regra permanente

Toda entrega relevante do Whilo deve terminar com **cinco recomendações pós-output**, sempre concretas, priorizadas e separadas da descrição do que já foi feito. Elas não devem ficar apenas na conversa do Manus: devem ser registradas neste arquivo ou em um arquivo específico da entrega.

Cada recomendação deve conter:

- **Prioridade:** P0, P1 ou P2.
- **Problema:** o que ainda está fraco.
- **Ação:** o que implementar.
- **Critério de aceite:** como saber que ficou pronto.
- **Risco/benefício:** por que importa.

## Cinco recomendações atuais

### 1. P0 — transformar o Preview em fluxo conectado

**Problema:** o Preview mostra fila, Thinking, tools e revisão, mas ainda pode operar como demonstração local quando a API não está configurada.

**Ação:** conectar o mesmo conversation runtime ao modo web, com streaming de eventos, receipts e estados persistidos no Supabase.

**Critério de aceite:** enviar uma mensagem no domínio público cria uma thread persistida e uma tool read-only real retorna fontes e um receipt verificável.

**Risco/benefício:** maior trabalho de backend, mas elimina a diferença entre demo e produto.

### 2. P0 — concluir o approval kernel visual

**Problema:** cards de email, compra e viagem precisam deixar absolutamente claro o que está preparado, aprovado, executado ou bloqueado.

**Ação:** padronizar `prepare → review → approve → execute → receipt`, com payload hash, expiração, idempotency key e histórico.

**Critério de aceite:** dois cliques concorrentes não duplicam side effect e cada aprovação mostra exatamente o payload autorizado.

**Risco/benefício:** reduz risco operacional e aumenta confiança para ações de alto valor.

### 3. P1 — Activity View e Spaces

**Problema:** o usuário precisa de um lugar único para encontrar trabalho em andamento, tarefas agendadas, artefatos e falhas.

**Ação:** criar Activity View global e Spaces/Pages editáveis, com busca, status e conversa contextual.

**Critério de aceite:** qualquer execução pode ser encontrada por agente, Space, estado, data e tipo de tool.

**Risco/benefício:** aumenta retenção e transforma respostas pontuais em sistema de trabalho contínuo.

### 4. P1 — voice call de produção

**Problema:** voice precisa executar o mesmo workflow de texto sem perder captions, contexto ou permissões.

**Ação:** integrar WebRTC/Realtime, captions, interrupção, handoff para backend e retorno do receipt na thread.

**Critério de aceite:** durante uma chamada, o usuário pede uma tarefa read-only, interrompe uma resposta, delega trabalho longo e recebe o resultado na conversa.

**Risco/benefício:** exige avaliação de latência, sotaques e falhas de rede, mas cria uma interface diferencial.

### 5. P1 — criar o Whilo Design System

**Problema:** referências de Grok, Dots, Muse e Mobbin ajudam a direção, mas sem tokens e componentes o produto volta a ficar inconsistente.

**Ação:** consolidar tokens de cor, tipografia, radius, spacing, estados, mascote, cards, bottom sheets, toasts, focus states e reduced motion.

**Critério de aceite:** login, chat, agents, connectors, approval e Spaces usam os mesmos componentes e passam por checklist de acessibilidade.

**Risco/benefício:** investimento transversal que reduz retrabalho e deixa o produto premium de forma consistente.

## Formato para futuras entregas

Sempre finalizar o documento da entrega com uma seção `## Cinco recomendações pós-output` usando a mesma estrutura. Se uma recomendação for concluída, substituí-la por outra com prioridade explícita e registrar a data da troca.
