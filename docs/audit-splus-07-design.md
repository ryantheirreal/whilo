# Auditoria S+ 07 — Design system e identidade Whilo

**Data:** 3 de outubro de 2026  
**Escopo:** somente sistema visual, identidade Whilo, telas/cartões, mascote/logo, PWA e documentação de experiência.  
**Veredito:** base de UI reutilizável e direção de marca documentada, mas **ainda não é um design system S+**: existe uma identidade aprovada sem um contrato visual coeso que a aplique consistentemente.  
**Nota de maturidade visual:** **5,5/10 — boa fundação; identidade e governança de tokens/state system incompletas.**

> Esta é uma auditoria de fontes e artefatos. Não foram modificados código de produção, assets, configuração ou comportamento do app. O único arquivo criado foi este relatório solicitado.

## 1. Resumo executivo

O Whilo já tem peças úteis: uma paleta e estilos compartilhados em `apps/mobile/src/ui.tsx`, componentes `Button`, `IconButton`, `Card`, `Chip`, `Field`, `Empty`, `ErrorNotice`, `Sheet`, `CheckRow`, `SectionHeading` e `LinkRow`; home responsiva com hero e cards de resumo; previews de browser/email/viagem/compra; alvos principais de 42–44 px; tratamento básico de loading, pressed, disabled, busy, erro e vazio; além de nome, tema, ícone e service worker de PWA.

A dívida mais importante é de **semântica e coerência, não de falta de componentes**:

1. O símbolo aprovado da orca já está nos assets e na instalação PWA, mas o componente chamado `Mascot` usa **o ícone quadrado completo com wordmark “Whilo!”** como se fosse uma ilustração de avatar. O mesmo arquivo se chama `whilo-icon.png` e `whilo-logo.png` e os dois têm o mesmo hash; o asset da capivara OpenMuse continua no repositório e ainda é descrito como mascote ativo em documentação. O código diferencia o produto Whilo do upstream OpenMuse de modo incompleto.
2. `colors`/`s` são uma boa camada inicial, mas os tokens não são semânticos nem temáticos e os componentes voltam repetidamente a hex, cores, tamanhos e estados inline. A contagem exploratória encontrou dezenas de valores de cor únicos entre telas/cards auditados; não há limite lint/test que impeça drift.
3. Estados parecidos — tarefa aguardando entrada/aprovação, sucesso, falha de ferramenta, item “pesquisa”, sessão offline e ligação — recebem tratamentos locais diferentes. Os fundos coloridos ajudam a varrer, mas falta um padrão explícito de badge/ícone/label/contraste/progresso que sobreviva a daltonismo, tema e renderização de tool.
4. A instalação PWA está encaminhada, mas um único PNG grande cobre wordmark, avatar, favicon e ícone adaptativo; ele está declarado `any maskable` sem evidência de validação em safe zone. O manifesto e `app.json` repetem identidade/tint sem uma fonte de verdade.
5. A documentação de experiência ainda declara explicitamente “OpenMuse interaction design” e “capybara”, enquanto `OPENDOTS-WHILO.md` já declara a baleia/orca como símbolo Whilo. As instruções de identidade precisam ser a fonte de verdade para designers e novas telas.

A recomendação é **preservar a calma, os cards ricos e o fluxo chat-first de OpenMuse, assumir a marca azul/orca já aprovada, incorporar de OpenDots apenas a clareza visual de páginas/Spaces e aprovação de rascunhos, e aproveitar de OpenBot a legibilidade de estado/evidência — não o shell administrativo, os personagens nem qualquer paleta alheia**.

## 2. Comparação visual com referências oficiais

As referências abaixo foram verificadas em fontes CopilotKit oficiais acessíveis em 03/10/2026. OpenMuse, OpenDots e OpenBot são templates/projetos de referência, não especificações normativas nem produtos Whilo. A direção visual de Whilo deve ser derivada do seu próprio arquivo de identidade, não inferida de um clone upstream.

| Referência | Linguagem visual/arquitetura observável | O que adotar no Whilo | O que não importar |
|---|---|---|---|
| **OpenMuse** — personal agent, mobile e web; chat como superfície contínua; mensagem, trabalho e ações revisáveis dentro do mesmo fluxo. O código upstream atual tem canvas claro, paleta cinza/azul e capivara local; o README apresenta resultados reais de browser, email, PDF, plano e finanças inline. | É a comparação mais próxima da experiência atual: superfície arejada, prioridade para conversa, input-pill persistente, cartões contidos e navegação/revisão sem sair do contexto. A documentação de experiência do próprio Whilo já descreve essa gramática. | Manter o foco na missão/conversa, previews de resultados no contexto, estados de “trabalhando” compreensíveis, preservação do rascunho e a densidade visual baixa. Reaplicar essa estrutura usando cores e arte Whilo. | Não tratar os elementos visuais de OpenMuse como identidade Whilo. A capivara e o avatar variável por fundo (sky/sand/lilac) são assets do OpenMuse, não a baleia/orca aprovada. Nem copiar as antigas instruções de arte. |
| **OpenDots** — interface de coworkers especialistas e Spaces/pages; sidebar hierárquica (Dots, Spaces e conversas); telas de chat, biblioteca e editor focadas em um trabalho por vez. As capturas oficiais no repo mostram tons marfim/branco, verde-azulado nas mensagens e acentos lavanda; a interface diferencia navegação operacional e leitura/edição de artefatos. | Para Whilo: preservar uma superfície clara para missão/artefato, separar a hierarquia de trabalho (missão, agente, fonte, artefato), e fazer “rascunho → revisar → salvar” parecer uma unidade visual explícita. A estrutura de documentos pode aumentar a clareza sem tirar o chat de seu papel. | Não adotar os quatro mascotes coloridos de Dots, o teal/lavanda como cor de marca, nem a sidebar/complexidade de multi-coworker como se fossem requisitos atuais de Whilo. O upstream descreve capacidades e telas próprias; não comprova que essas capacidades já existam no Whilo. |
| **OpenBot** — aplicação de coworkers empresariais e controle de canal/ação. A home destaca canais e agentes; a mensagem coexiste com evidências, uso do computador e trilha de atividade; segurança/autorizações têm presença explícita. A captura do produto oficial mostra canais por domínio (Knowledge, Metrics, Research, Operations) e navegação de Skills/Agents/DM. | Para Whilo: aproveitar a disciplina visual de estado, evidência, origem e ação governada. Um resultado de agente deve separar afirmação, fonte/artefato, estado e próximo passo; revisão deve distinguir “preparado”, “aprovado” e “concluído”. | Não copiar a densidade do console empresarial/admin, a marca OpenBot, seus componentes ou adotar um visual técnico que contradiga “central calma de trabalho”. OpenBot é referência de controle/governança, não de personalidade visual Whilo. |

**Fontes para a comparação:** [README OpenMuse](https://github.com/CopilotKit/OpenMuse), [página OpenMuse](https://www.copilotkit.ai/openmuse), checkout oficial OpenMuse: `apps/mobile/src/ui.tsx:402–435` e `docs/EXPERIENCE.md:20–22`; [README OpenDots](https://github.com/CopilotKit/OpenDots), [página OpenDots](https://www.copilotkit.ai/opendots), capturas oficiais [chat-layout](https://github.com/CopilotKit/OpenDots/blob/main/docs/images/chat-layout.png), [spaces-library](https://github.com/CopilotKit/OpenDots/blob/main/docs/images/spaces-library.png), [spaces-workspace](https://github.com/CopilotKit/OpenDots/blob/main/docs/images/spaces-workspace.png), e código `src/client/style.css:1–14`, `src/client/App.tsx:320–403`; [README OpenBot](https://github.com/CopilotKit/OpenBot), [página OpenBot](https://www.copilotkit.ai/openbot), e submódulo local `openbot/README.md:180–243`, `openbot/app/src/styles.css:21–92`. As fontes oficiais situam o que é upstream; os caminhos sem prefixo de clone nesta tabela são caminhos dentro do respectivo repositório oficial.

## 3. Achados específicos do Whilo

### A. Identidade e mascote — **parcial; prioridade máxima**

**Já existe**

- `docs/OPENDOTS-WHILO.md:16,20–26` define Whilo como orca/baleia-orca preta, balão branco com “Whilo!” e fundo azul, pede azul forte/branco como sistema, restringe o mascote a presença, vazio e confirmação, e alerta contra substituir Whilo por mascotes de upstream.
- A imagem de ícone aprovada existe como `apps/mobile/assets/whilo-icon.png` e `apps/mobile/public/assets/whilo-icon.png`; `apps/mobile/app.json:3–13` e `public/manifest.json:2–11` usam Whilo e a mesma identidade azul.
- `App.tsx:274–332` usa Whilo como nome padrão da identidade visível e a função central de avatar.

**Parcial/incoerente**

- `ui.tsx:402–432` diz “Whilo's official mascot and logo” e implementa `Mascot` com uma camada azul decorativa e `Image source={require("../assets/whilo-icon.png")}`. Esse asset contém a composição inteira de ícone/logo — wordmark legível apenas em escala maior mais orca; não é uma ilustração transparente de avatar. Em 42 px, o componente reduz simultaneamente personagem e lettering; não cria variação real de avatar. `variant` aceita `sky | sand | lilac`, mas a paleta retorna `#2E91F2` em todas as três opções (`ui.tsx:403–411`).
- `apps/mobile/assets/whilo-logo.png`, `apps/mobile/assets/whilo-icon.png` e `apps/mobile/public/assets/whilo-icon.png` são byte a byte iguais no checkout (SHA-256 `6bcf81464e61fcf7dec5aac54d2149b625ade64aeded73cd1af118f5ae3b186c`; cada PNG mede 1254×1254). O nome `whilo-logo` não fornece hoje um lockup ou exportação distinta.
- `apps/mobile/assets/capybara.png` permanece no repositório; `apps/mobile/assets/README.md:1–6` e `docs/EXPERIENCE.md:1,20–22` ainda a chamam de arte/mascote de Whilo/OpenMuse. O upstream OpenMuse realmente implementa capivara em `apps/mobile/src/ui.tsx:402–435` do checkout upstream; a documentação local mistura as duas marcas. Não remova a capivara automaticamente: primeiro confirme se é somente arte legada ou ainda existe alguma referência deliberada.
- O mesmo ícone full-lockup é declarado também como favicon e ícone PWA (`app.json:6,13`; `manifest.json:10–12`). Isso não é um conjunto de variantes com intenção tipográfica/função separada.

**Ausente**

- Um contrato público simples de asset/uso: logotipo/wordmark, app icon, avatar/mascote, favicon e variantes para fundo escuro/claro; min-size e usos proibidos; quem pode ser substituído/animado; alt/decorative e estado do assistente.
- Ilustração de avatar Whilo própria, separada da imagem do app icon, e uma forma acessível de nomear agente/identidade sem anunciar arte decorativa repetidamente para leitor de tela.

**Correção implementável:** manter a arte aprovada e separar exports/contratos: `WhiloWordmark`, `WhiloAppIcon` e `WhiloAvatar` (ou avatar minimalista usando somente o símbolo, após aprovação de design). Fazer o componente de avatar selecionar asset transparente/compatível, deixar `variant` funcional ou removê-lo, e usar ícone decorativo com `accessible={false}` quando o nome já estiver ao lado; caso represente status, expor label/status por um único elemento acessível. Regra de marca para especialistas: mesmo sistema/símbolo Whilo; permitir cor/tag/nome, não inventar uma espécie de mascote por função.

### B. Tokens e consistência de telas/cards — **parcial**

**Já existe:** `ui.tsx:18–114` cria paleta base e `StyleSheet s`; `ui.tsx:115–400` concentra controles e estruturas; `screens.tsx:71–384` define hero/calendário/inbox/atividade; `agent-ui.tsx:95–167` cria `TaskCard`; `chat.tsx:844–983` centraliza o composer; cards especializados existem em `browser-tool-card.tsx`, `mail-tool-card.tsx`, `travel-tool-card.tsx` e `purchase-tool-card.tsx`. Há breakpoints: hero se altera a 1180 px em `screens.tsx:73`, e `Sheet` usa `<600 px` em `ui.tsx:259–275`.

**Parcial:** os 12 nomes em `colors` não são função/estado (e.g. `blue`, `blueDark`, `sky`, `green`, `lavender`, `orange`) nem cobrem `focus`, `hover`, `selected`, estados do sistema ou tema. `Card` recebe somente `ViewStyle`; a forma visual volta a ser definida em callsites. Exemplos: dashboard pinta caixas/stats diretamente (`screens.tsx:81–183, 185–236, 321–345`), tarefas usam `#F0F1F2`/barra `#6AAEE0` (`agent-ui.tsx:117–166`), browser usa `#EEEEF0`/`#FAFAFB`/`#F9F9FA` (`browser-tool-card.tsx:95–164`), e compra/viagem selecionam seus próprios fundos, chips e cores (`purchase-tool-card.tsx:21–55`; `travel-tool-card.tsx:24–66`). Um inventário grep do eixo screen/chat/cards encontrou dezenas de hex distintos (incluindo `#FFF` e neutros), sem token central para cada intenção.

**Ausente:** catálogo de tokens semânticos versionável, governança para o que pode ficar inline, especificação light/dark/alto-contraste, e histórias/tela de validação de cada estado responsivo.

**Direção de tokens S+ (candidatos iniciais, devem ser medidos/testados antes de virar contrato):**

```ts
brand:      { primary: "#2E91F2", strong: "#1473C8", soft: "#C8E7FF", wash: "#EDF7FD" }
surface:   { canvas: "#F7FBFF", default: "#FFFFFF", subtle: "#F1F5F8", elevated: "#FFFFFF" }
content:   { primary: "#11191C", secondary: "#697176", disabled: "#727C83", onBrand: "#11191C" }
border:    { subtle: "#E5EAF0", default: "#CFD9E2", focus: "#1473C8" }
status:    { info, success, warning, danger: { foreground, background, border, icon } }
space:     { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40 }
radius:    { control: 12, card: 18, panel: 24, pill: 999 }
control:   { touchMin: 44, compactMin: 40, focusWidth: 3 }
```

`#2E91F2` é cor da marca; não usar texto branco pequeno sobre ela sem medir: calculado nesta auditoria, branco/`#2E91F2` = **3,26:1**, abaixo de 4,5:1 para texto comum. O preenchimento atual `colors.blue` (`#C8E7FF`) com `colors.text` (`#11191C`) é **13,84:1** e `colors.blueDark` (`#1473C8`) contra branco é **4,87:1**; dá para manter uma CTA clara de texto escuro e usar o azul oficial como acento, não é necessário tornar toda CTA azul saturada. Nomear estados sem confundir cor da marca com cor de status.

### C. Componentes e estados de experiência — **parcial**

**Já existe:** botão primário/secundário/perigo; ícone acessível; busy spinner e `disabled/busy`; `Empty`, `ErrorNotice` (`accessibilityRole="alert"`), `Sheet`, `CheckRow` como checkbox e `SectionHeading` (`ui.tsx:115–400`). `TaskCard` distingue espera por entrada/aprovação e expõe texto (`agent-ui.tsx:105–165`). `ChatScreen` mantém estados de fila/erro e estados focused/typing (`chat.tsx:697–756, 777–810, 844–983`). É boa fundação, não recomeçar UI do zero.

**Parcial:** ação pressed, disabled e busy existem em alguns controles; `IconButton` tem label; `Button` expõe role e `accessibilityState`. O focused visual customizado aparece só no composer (borda `#C7E4F9`, `chat.tsx:844–855`) e no `TextInput` local; não há contrato de focus/hover/selected comum nem modo reduzido de movimento. Elementos `Pressable` em telas/card são de consistência irregular; alguns como `AgendaRow`/prompts não declaram role/label (`screens.tsx:254–269, 327–343, 420–447`), ao contrário dos contadores (`screens.tsx:211–235`).

**Ausente como linguagem comum:** `StatusBadge` textual acessível (waiting_input, waiting_approval, running, paused, succeeded, failed, offline, rejected, uncertain); alert/banner de conectividade; skeleton/empty/success/retry com contrato; `ReviewCard` neutro que mostra alvo exato, risco, fonte, efeito e CTAs; estilos comuns para seleção/toggle/expansão; focus ring web/nativo validado, reduced motion e escala de texto; variantes de componente testadas em telas 360/390/768/1280 e com conteúdo longo.

**Componentes a extrair/refatorar primeiro**

1. `tokens.ts` + `semantic-colors.ts`: marca, superfície, texto, foco, status, sombra/elevação, tipografia, spacing, radius, breakpoints e motion; usar tanto React Native quanto web.
2. `BrandLockup`/`AppIcon`/`WhiloAvatar` distintos; semântica decorativa/nome e alt controladas em um lugar.
3. `Text`/`Heading`/`Caption` com classes/variantes, escala e line-height; `Field` com label/helper/error/disabled/focus padronizado.
4. `Button`/`IconButton` por `variant`, `intent`, `size`, `loading`, `disabled`, `selected`; não aceitar combinação impossível `primary + danger` sem contrato.
5. `StatusBadge`/`InlineAlert`/`ProgressRow` com texto + ícone + estado + valor acessível — cor nunca deve ser o único código.
6. `SurfaceCard` com `variant`/`state`; `TaskCard`, `ToolResultCard`, `EvidenceRow`, `ReviewCard`, `ApprovalSummary` sobre essa base, em vez de styles locais.
7. `ChatComposer` com tokens, target size, focus-visible, disabled, queued/stopped/send e label de marca Whilo; `Sheet`/`Dialog` responsivos com escape, foco/retorno e scroll testados.
8. `AppNavigation`/`SectionHeader`, `EmptyState` e `TimelineEvent` para eliminar pequenas divergências entre home, atividade, pesquisa e configuração.

### D. Acessibilidade perceptual e visual — **parcial; verificação pendente**

- Alvos bons em controles principais: `Button.minHeight` 42 px (`ui.tsx:67–79`), `IconButton` 44×44 (`ui.tsx:161–188`), input de chat/ações 44×44 (`chat.tsx:898–983`). Preservar essa intenção; elevar pequenos botões/links realmente independentes a pelo menos 24×24 CSS px com separação conforme WCAG 2.2 SC 2.5.8.
- Há texto pequeno de UI em 9–11 px: `s.small` 11, `s.label` 10, `chipText` 10 (`ui.tsx:35–46, 80–87`), stats e microcopy em `screens.tsx:220–233`. Para informação operacional importante, subir corpo secundário a 12–14 e reservar overline minúsculo para informação redundante. Garantir aumento a 200% e não bloquear escala do sistema.
- Problema comprovável: placeholder do composer usa `#949B9F` sobre branco (`chat.tsx:927`), calculado em **2,82:1**; texto comum precisa 4,5:1 conforme WCAG 2.2 SC 1.4.3. Substituir por um token de texto secundário, sem apagar instrução dentro do placeholder (usar label persistente/hint onde necessária). Outros pares medidos nesta auditoria: `#697176/#FCFCFC` = 4,85:1 (passa); `#697176/#EDF7FD` = 4,57:1 (passa por pouco). Testar todos os pares semânticos, disabled e estados de tool — a auditoria de contraste aqui é amostra, não certificação WCAG.
- `Mascot` tem label de accessibility no `View` pai e a imagem é `accessible={false}` (`ui.tsx:412–430`); validar iOS, Android e React Native Web com VoiceOver/NVDA para evitar logo repetitivo/inútil. Quando o nome de agente já é texto adjacente, arte decorativa deve ser escondida das tecnologias assistivas; quando status representar informação, anunciá-lo de forma textual/programática.
- Garantir que selecionado, erro, warning, approval pendente, waiting e success tenham uma palavra/ícone/forma além de matiz, e que links/botões permaneçam visíveis no keyboard-only e no foco Web. O `s.small` baixo-contraste/small text e o 10 px em conteúdo relevante são um risco de legibilidade, embora não se conclua falha de contraste de todos os cartões.

Referência oficial: [WCAG 2.2, 1.4.3 Contraste mínimo](https://www.w3.org/TR/WCAG22/#contrast-minimum) exige 4,5:1 para texto comum / 3:1 para texto grande; [WCAG 2.2, 2.5.8 Tamanho do alvo mínimo](https://www.w3.org/TR/WCAG22/#target-size-minimum) estabelece 24×24 CSS px com exceções. Não confundir o alvo mínimo WCAG com a meta melhor de 44 px para uso touch.

### E. PWA e identidade de instalação — **parcial**

**Já existe:** manifesto com `name`, `short_name`, descrição em português, `start_url`, `display: standalone`, cores `#F7FBFF`/`#2E91F2`, orientação e ícone `purpose: any maskable` (`apps/mobile/public/manifest.json:1–13`); nome/ícone/theme no Expo (`apps/mobile/app.json:3–13`); registro de manifesto e service worker na plataforma Web (`apps/mobile/App.tsx:90–98`); cache de `/` e manifesto, claim de clients e fallback offline (`apps/mobile/public/sw.js:1–24`).

**Parcial/risco:** o único item de `icons` declara apenas `1254x1254`; o app icon (orca + wordmark numa placa azul) é reutilizado como favicon e avatar, e o propósito `maskable` não tem export seguro/testado. MDN explica que o safe zone maskable é círculo com diâmetro igual a 80% da dimensão mínima e distingue o ícone instalável de favicon. A marca deve ser testada dentro das máscaras, não apenas em preview quadrado. Além disso, CSS/cache e os valores do tema podem divergir da paleta se forem editados em locais duplicados.

**Direção:** gerar variantes verificadas (favicon compacto e PWA 192/512; arquivo distinto para `any` vs `maskable`, conforme teste real), manter padding/arte principal no safe zone, usar nome instalável curto **Whilo**, revisar se a frase descritiva tem limite útil de plataforma e sincronizar cor de status/barra e splash. Manter um `source of truth` de tokens e gerar/exportar config sem intervenção manual. Atualizar cache com estratégia/versão e limpeza de caches antigos; testar primeiro install/update/offline/uninstall em Chrome Android, Chrome Desktop e Safari iOS. [MDN — definir ícones de PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons).

O service worker atual guarda respostas `GET` same-origin e retorna a home quando qualquer request não resolvido falha (`sw.js:12–23`); isso merece validação separada de identidade para que offline/error não pinte a shell como se fosse um artefato válido. Esta recomendação é sobre apresentação/estado PWA, não uma auditoria completa de cache/network.

### F. Telas e docs de experiência — **parcial / inconsistentes**

- A home (`screens.tsx:81–183`) tem hero bastante caracterizado em azul, título grande e mascote a 94 px apenas em desktop — um uso coerente para identidade/presença; a tela então volta a cards de resumo, calendário, inbox, prompts e atividade (`185–384`). Preservar esse ritmo e a função do mascote, mas trocar *a composição exibida* e normalizar os cartões/cores.
- O composer atual é forte: continua na tela, mantém texto, mostra estado focused e troca envio/stop no mesmo controle (`chat.tsx:844–983`); isso se alinha à referência OpenMuse e deve permanecer.
- `TaskCard` fornece trabalho persistente e pending (`agent-ui.tsx:95–167`); `BrowserToolCard`, `TravelToolCard` e `PurchaseToolCard` são visualmente distinguíveis. Falta um conjunto de estados/padrões que os faça parecer produtos da mesma família, e não skins locais para cada tool.
- `docs/EXPERIENCE.md:1` diz “OpenMuse interaction design”; `:20–22` ensina a capivara e fundos sky/sand/lilac como a linguagem visual do app. Já `docs/OPENDOTS-WHILO.md:16–34` diz explicitamente que capivara deve ceder à orca e descreve PWA/azul Whilo. Este conflito de documentação é um problema operacional: novo código pode reintroduzir asset já rejeitado.
- `chat.tsx:912` rotula o campo para acessibilidade “Message O1”; no `agent-ui.tsx` há copy visível/acessível e defaults “O1” (e.g. `:910,1115,1523,1762`) enquanto `App.tsx:274` usa Whilo. Se o nome de produto/agent deve ser Whilo, unificar nomes, não substituir texto técnico dos conceitos internos sem avaliar.
- O manifesto/Web config é português, mas o HTML do build observado inclui `lang="en"`; as superfícies alternam instruções em inglês e cards em português (`travel-tool-card.tsx:17–66`; `purchase-tool-card.tsx:17–53`). `ui.tsx:433–443` retorna data em `en-US`/locale do runtime sem contrato de idioma. Isso fragiliza a voz da marca, leitor de tela e interpretação de estados; requer catálogo/localização única para título, textos, datas, accessibilityLabel, manifesto e `lang` da página.

**Documentação a consolidar:** substituir `docs/EXPERIENCE.md` por `docs/WHILO-DESIGN-SYSTEM.md` ou renomear/consertar mantendo links: visão de marca, arte aprovada e proveniência, uso de logo/avatar, tokens, tom/locale, grade de responsividade, estados, aprovação/risco, acessibilidade, exemplos de do/don'ts e screenshot por plataforma. Atualizar `apps/mobile/assets/README.md` para dizer explicitamente o status do antigo arquivo `capybara.png`; evitar apagar sem confirmar consumers.

## 4. Estado resumido: já existe / parcial / ausente

| Área | Estado | Prova/observação |
|---|---|---|
| Identidade nominal Whilo e azul da marca | **Já existe** | `app.json:3–13`, `manifest.json:2–8`, direção aprovada em `OPENDOTS-WHILO.md:16–34`. |
| Biblioteca de componentes básicos | **Já existe** | `ui.tsx:115–400`. |
| Tokens | **Parcial** | `ui.tsx:18–114`, reutilização quebrada por hex/valores inline nas telas/cards. |
| Logo, ícone, mascote e avatar como assets distintos | **Parcial** | PNG usado em todos os papéis e hash igual; `Mascot` reutiliza icon, capivara permanece. |
| Padrão básico de estados (pressed, disabled, busy, empty/error, check) | **Parcial** | Existe disperso em `ui.tsx`, `chat.tsx` e cards; foco/seleção/sucesso/status comum ausentes. |
| Responsividade | **Parcial** | `screens.tsx:73`, `ui.tsx:259–275`, shell em `App.tsx`; breakpoints não unificados/validados em documentação de design. |
| Acessibilidade | **Parcial** | Roles/labels/checkbox/alert e alvos 42–44 px existem; placeholder de 2,82:1; role/foco/text sizing inconsistentes. |
| PWA identidade | **Parcial** | Manifesto e SW existem, mas há um único tamanho e `any maskable` não verificado. |
| Documentação Whilo de experiência | **Ausente como fonte de verdade** | `EXPERIENCE.md` ainda prescreve OpenMuse/capybara; docs Whilo separada contradiz o antigo manual. |
| Contraste automatizado + testes visuais de estados/plataformas | **Ausente no escopo inspecionado** | Não encontrei catálogo/storybook/visual-regression para o design system auditado. |
| Temas dark/alto-contraste | **Ausente** | `app.json:9` fixa `userInterfaceStyle: "light"`; paleta declarada como constantes únicas. |

## 5. Risco, valor e dependências

| Prioridade | Risco/ação | Valor de produto | Risco atual | Dependências / critério de saída |
|---|---|---|---|---|
| **P0 — agora** | Fixar a fonte de verdade da identidade; separar papel de wordmark/app icon/avatar; retirar capivara das recomendações/docs ativas e confirmar que não há consumer em runtime. | Muito alto: toda tela e instalação reconhecível como Whilo; reduz regressão de marca imediata. | **Alto:** contradiz marca aprovada e pode reaparecer por copy/import legado. | Decisão de brand owner/arte; inventário de importers/assets. Saída: três usos nomeados, docs coerentes, screenshot iOS/Android/Web + confirmação de nenhum mascot OpenMuse em superfície ativa. |
| **P1 — primeiro bloco técnico** | Criar tokens semânticos compartilhados, mapear cores/tipografia/radius/spacing/focus e substituir estilos locais gradualmente. | Muito alto: consistência cross-screen e custo menor de mudança. | **Alto:** atuais patches podem divergir; a ação primária #2E91F2 não suporta texto branco normal. | Definir paleta final e contrastes + estrutura TS; migrar `ui.tsx`, depois home/chat/cards. Saída: zero hex de aplicação fora de tokens, salvo exceção documentada; contrast test de tokens. |
| **P1** | Extrair status/Review/ToolResult/Task state, inclusive waiting, paused, failed, offline, review, approved/uncertain. | Alto: tarefas, Computer, inbox e compra exibem próximo passo sem depender de cor/salto de layout. | **Médio-alto:** estado sem consistência enfraquece confiança e compreensão do humano-no-loop. | Modelo de status do produto e copy localizado; definir semântica/foco; construir sobre Card/Button existentes. |
| **P1** | A11y pass por componente/tela (contrast, foco, alvos, VoiceOver/TalkBack/NVDA, scale/zoom, reduced-motion, nomes). | Alto: inclusão e qualidade Web/native; fecha falha pontual reproduzida. | **Alto** para pessoas com baixa visão/teclado, sobretudo placeholder e conteúdo de 9–11px. | Tokens finais + test devices/browser. Saída: SC 1.4.3/2.5.8 verificados, alvos principais 44, nenhuma interação somente cor, foco visível, conteúdo 200%. |
| **P1** | Completar o pacote PWA (ícones distintos, máscara e cache/versionamento) e sincronizar metadados. | Alto: primeira impressão fora do browser e facilidade de instalação. | **Médio:** uso de um logo completo como avatar/icon/fav torna leitura inconsistente; máscara pode cortar/padding reduzir reconhecimento. | Fonte visual aprovada, icon generator, smoke-test de instalação em Android/iOS/Desktop. |
| **P1/P2** | Criar manual Whilo específico e matriz de screenshots de referência. | Alto para escala da equipe e onboarding; impede retorno a OpenMuse. | **Médio-alto:** experiência.md dirige implementações para capivara e estética antiga. | Decisão de naming/locale/asset + docs. Contrato estável deve preceder refinamento das telas. |
| **P2** | Testes visuais/snapshots por variante e inspeção cross-locale/reflow, integrando CI. | Médio-alto: regressões de tokens, textos longos e layout são detectadas cedo. | **Médio:** regressões ainda dependem de revisão manual. | Escolher ferramenta com suporte RN Web/native disponível; cobrir estados críticos após implementação da biblioteca. |

## 6. Sequência de implementação recomendada (sem alterar contratos de produto)

1. **Auditoria de brand assets/imports.** Comparar a composição original aprovada e registrar `Wordmark`, `AppIcon`, `Avatar`, `Favicon`; identificar se e onde a capivara ainda é consumida. Escolher se Whilo terá avatar de orca separado; o arquivo de app icon não deve virar automaticamente arte de personagem.
2. **Congelar tokens semânticos e contrastes.** Criar arquivo TypeScript tipado sem duplicar marca em `ui.tsx`, com light inicial, semantic intent states, type/space/radius/elevation/focus/motion. Validar matrizes reais no simulador e automatizar WCAG para textos/status/focus.
3. **Refatorar os primitives.** Expandir Button/Field/Card/Sheet/StatusBadge, manter os sizes atuais de toque como piso e resolver foco, labels, error/helper/status e touch ergonomics.
4. **Migrar três superfícies-piloto.** (a) composer/conversa; (b) home Today; (c) Review/Task + ToolResult. Comparar screenshots antes/depois, com loading/empty/error/disabled/running/approval/done/long label e telefone/tablet/desktop.
5. **Depois migrar cartões secundários, calendário, arquivos e apps/configuração** usando a mesma base. Não redensificar visualmente a home com um shell CopilotKit/enterprise.
6. **Atualizar PWA e docs.** Gerar icons/manifest derivados; testar serviço offline/revisão/install; corrigir todas as menções a “OpenMuse/capybara” na experiência que pretende representar Whilo; alinhar `lang`, copy e localização de data.
7. **Ligar governança no PR.** lint/guard para cores/typography inline fora de tokens; testes de role/label/target e pares semânticos; screenshots de golden simples para as telas críticas e janela mobile.

## 7. Referências oficiais adicionais

- [OpenMuse no GitHub](https://github.com/CopilotKit/OpenMuse) e [visão oficial](https://www.copilotkit.ai/openmuse): personal agent mobile/web, conversa, computador, resultados e estado de Alpha.
- [OpenDots no GitHub](https://github.com/CopilotKit/OpenDots), [overview oficial](https://www.copilotkit.ai/opendots) e seus assets de screenshot citados acima; a página descreve Spaces, Dots e review-before-save, não deve ser entendida como prova de que Whilo implementa isso.
- [OpenBot no GitHub](https://github.com/CopilotKit/OpenBot) e [página oficial](https://www.copilotkit.ai/openbot): canais, conhecimento, computador por agente, e foco em identidade/política empresarial.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/): contraste e target size.
- [MDN — define PWA app icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons): diferenças app-icon/favicon, ícones por finalidade/tamanho, máscara e safe zone.

---

**Conclusão:** há suficientes peças para fazer o Whilo parecer coeso sem redesenhar o produto nem trazer código visual de outro projeto. Antes de refinamentos, tornar a baleia/wordmark um sistema de assets inequívoco, aposentar as instruções contraditórias de capivara, formalizar tokens semânticos e trazer acessibilidade para o contrato do componente. Isso reduz risco de identidade, melhora escaneabilidade e cria a base operacional do S+.
