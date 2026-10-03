# Auditoria S+ — upstream, licença e evolução do código

**Data de corte:** 3 de outubro de 2026. **Escopo:** proveniência e evolução do Whilo, submodule OpenBot e referências OpenMuse/OpenDots. Não alterei código de produção.

## Veredito

**5,5/10 — amarelo/vermelho; S+ não passa no eixo de proveniência e evolução.** O risco imediato de licença é **baixo a moderado**: o Whilo declara MIT, o submodule mantém seu próprio `LICENSE`, e os três projetos de referência declaram MIT. Não identifiquei incompatibilidade de licenças. O risco principal é de **governança de código e documentação**: há três commits diferentes apresentados como baseline do OpenBot; `.gitmodules` aponta para um fork pessoal cujo `main` não contém a revisão fixada; a raiz do Whilo divergiu substancialmente do OpenMuse; e documentação ainda chama o OpenBot de base do produto, embora o próprio README e o contrato de integração digam que o adapter está desligado e não há round trip conectado.

A situação não caracteriza por si só violação de licença. É um problema de evidência, manutenção e atribuição futura. Corrigir os pins e a descrição da arquitetura é P0 antes de distribuir qualquer código derivado do submodule.

## O que existe hoje

### OpenBot: o submodule está travado, mas a proveniência está dividida

O gitlink do repositório raiz fixa `openbot` em `cb5dc32a44517622c6db4e527e61d3abb389b43c`, marcado localmente como `v0.1.0`. A API oficial confirma que esse commit é o `main` atual do CopilotKit/OpenBot e corresponde ao release mais recente `v0.1.0`, publicado em 3 de outubro. Portanto, **o objeto atualmente fixado é o upstream oficial, não uma revisão exclusiva do Whilo**. [1] [2]

Há, no entanto, três versões de referência concorrentes no próprio repositório:

- `.gitmodules:1-4` usa `https://github.com/ryantheirreal/OpenBot.git`.
- `docs/OPENBOT-BASE.md:5-7` declara o pin `afe623366945d6378dde5ea9c46322ac856c3047`.
- `packages/backends/src/openbot.ts:3-4` declara `a96d88c6fb75385842529d7db7d463f4a8c4a86e`; `docs/OPENBOT-INTEGRATION.md:3` apresenta esse SHA como a revisão inspecionada em 15 de setembro.
- O pin real do gitlink é `cb5dc32...`, e o commit de adição (`3c45b34`, mensagem “add OpenBot fork as submodule”, 2 de outubro) não atualizou os dois outros pins.

Os três commits são ancestrais um do outro na história local do submodule, mas isso não os torna intercambiáveis: documentos não dizem qual SHA é o contrato testado, qual é a referência histórica e qual código deve ser implantado. Isso reduz a auditabilidade de regressões e atualizações. A API oficial mostra atividade recente: `main` e o release estão em `cb5dc32`, com commits subsequentes ao pin anterior. [2] [3]

O endereço configurado é um **fork** de `CopilotKit/OpenBot`, não o repositório canônico. Seu `main` público está em `4a207508...`, enquanto o upstream e o gitlink estão em `cb5dc32...`. O clone limpo de teste conseguiu buscar o SHA fixado a partir do fork, então não há falha de fetch demonstrada hoje; mas o fork não é a fonte de autoridade para essa revisão, e sua branch está desatualizada. O risco é de governança e disponibilidade futura, não evidência de que o checkout atual esteja corrompido. [1] [2] [4] [19]

A escolha do submodule traz uma vantagem real: o gitlink registra uma revisão imutável, sem seguir `main` automaticamente. Preserve esse comportamento. O que deve mudar é a URL para o upstream oficial `https://github.com/CopilotKit/OpenBot.git` e a documentação do pin. Não mude para atualização flutuante por branch.

### Código de integração: adapter existe, integração de produto não

**Parcialmente existente:** `OpenBotAdapter` está implementado em `packages/backends/src/openbot.ts:104-254`. Ele recebe transporte autenticado injetado, vem desabilitado por padrão, valida respostas e separa erros de ação incerta. `tests/openbot.test.ts:34-71, 73-100, 123-245` valida o contrato com fixtures, incluindo identidade, criação de canal, status do computador, cancelamento e recusa de política.

**Ausente:** não encontrei chamada de produção que instancie o adapter; fora do teste, `rg` só localiza a própria definição. Não há deployment, ponte de sessão ou teste live. Isso também é declarado em `README.md:175-177` e `docs/OPENBOT-INTEGRATION.md:57-76`. Os testes são úteis, mas são testes de fixtures, não prova de compatibilidade em execução com o servidor upstream.

A documentação está inconsistente sobre esse estado. `docs/OPENBOT-BASE.md:3, 9-17` diz que OpenBot é a base de execução/control plane e lista contratos como handoff, gateway de computador e rotinas. Já `README.md:146-177` descreve o computador do Whilo como implementação própria e o adapter OpenBot como futuro/desabilitado. `docs/OPENBOT-INTEGRATION.md:1-3, 74-76` corretamente diz que a inspeção de código não é integração rodando. **Classificação:** seam e testes de contrato existentes; ligação live, runtime de produção e transição de dados ausentes; descrição do “base” está superestimada e precisa ser reescrita.

Isso importa porque o upstream se define como template alpha para self-hosting, não como pacote de runtime publicado. O README oficial diz que os workspaces são privados e que não há versão hospedada ou pacote do OpenBot para depender. Logo, adotar o repositório como submodule não equivale a consumir uma biblioteca estável: atualizar o submodule pode trazer uma aplicação, banco, autenticação, contratos e processo de release próprios. O mesmo README lista CopilotKit Intelligence como requisito/configuração separada; não presuma que o serviço externo faça parte do código MIT do OpenBot. [5] [6]

### OpenMuse é o ancestral principal; OpenDots é referência de produto

A raiz local tem `origin` em `ryantheirreal/whilo` e `upstream` em `CopilotKit/openmuse`. A API do GitHub registra Whilo como fork de OpenMuse. O branch `upstream/main` local está em `ea23f63` (2 de outubro); o branch oficial consultado está em `b06caad7005ac5b6d2b451752a3794a6ae1759c1` e inclui atividade mais recente em 2 de outubro. A comparação local `HEAD...upstream/main` resulta em **312 commits exclusivos do Whilo e 8 exclusivos do ref remoto em cache**. Esse número é contra o ref local antigo, não uma contagem atualizada contra `b06caad`; atualize o fetch antes de fazer contagem final ou planejar merge. O common ancestor encontrado é `34b15bc80340e582fb8c25573646cfb0bbc5184d`. [7] [16]

A deriva não é necessariamente ruim: é a evolução de um fork de produto. Ela torna arriscado fazer merge ou rebase em massa sem um plano. `README.md:3, 67-70` ainda chama o produto de O1 e ensina clonar `CopilotKit/O1`, enquanto o remoto e parte da documentação já chamam o produto de Whilo. `docs/OPENDOTS-WHILO.md` é explicitamente uma referência de direção; não há import, dependência ou submodule OpenDots em `package.json`, `pnpm-lock.yaml`, `apps`, `packages` ou `tests`. Trate OpenMuse como linha de origem/evolução de código e OpenDots como comparação de padrões, não como segunda base para cherry-pick indiscriminado. O OpenMuse oficial continua no branch `main`, MIT, e seu README também classifica o produto como alpha para self-hosting/building; a API de releases não retorna release GitHub publicado. [7] [8] [17] [18]

O OpenDots oficial continua ativo no `main` em `c2569bb6a13a22e565cf3eb791c62267d06babb1` (2 de outubro), é MIT e não tem release GitHub publicado na API consultada. Seu README se descreve como template alpha e aponta OpenMuse/OpenBot como referências; `docs/COMPUTERS.md` especifica OpenBot como serviço/supervisor de computadores por Dot. Isso sustenta o uso como referência arquitetural, mas não prova que qualquer implementação descrita já exista no Whilo. [9] [10] [11] [12] [13]

Há também uma discrepância factual não funcional: `docs/OPENDOTS-WHILO.md:5` afirma 1.858 estrelas para OpenDots, mas os metadados oficiais consultados registram 1.438. Estrelas mudam com o tempo; remover números mutáveis ou registrar URL e data da consulta em vez de perpetuá-los como dado arquitetural. [9]

## Licenças e notices

`LICENSE:1-4` é MIT com copyright “2026 OpenMuse contributors”; `openbot/LICENSE:1-4` é MIT com copyright “2026 CopilotKit”. Os arquivos oficiais confirmam MIT para OpenBot, OpenMuse e OpenDots; a condição relevante do MIT é preservar o aviso de copyright e o texto de permissão em cópias ou partes substanciais. O OpenDots tem aviso próprio, “Copyright (c) Atai Barkai”. [6] [14] [15]

**Estado atual: parcial, sem violação observada.** O submodule conserva seu `LICENSE`, e o código do adapter é um contrato HTTP próprio, não encontrei cópia evidente de implementação do OpenBot na árvore de produção. A raiz não possui inventário de upstreams/notices que explique a mistura de origem OpenMuse, submodule OpenBot e influência OpenDots. A licença MIT da raiz não deve ser tratada como substituta do aviso de terceiro caso arquivos de um upstream sejam copiados para fora do submodule. Quando código for absorvido, manter o notice upstream no arquivo/pacote distribuído e registrar origem, SHA, licença e alterações em `THIRD_PARTY_NOTICES.md` ou equivalente. Se o produto distribuir execução que dependa de CopilotKit Intelligence, documentar que o serviço e suas condições são separados da licença dos repositórios, conforme os READMEs oficiais. Isso é avaliação de engenharia, não parecer jurídico.

## Recomendações implementáveis

1. **P0 — convergir identidade, pin e linguagem da documentação.** Alterar `.gitmodules` para `https://github.com/CopilotKit/OpenBot.git`; executar `git submodule sync --recursive` e validar `git submodule update --init --recursive` em checkout limpo. Atualizar `docs/OPENBOT-BASE.md`, `docs/OPENBOT-INTEGRATION.md` e `OPENBOT_CONTRACT_REF` para explicar distintamente: gitlink implantável/testado, SHA histórico de inspeção e revisão contra a qual os fixtures foram escritos. Remover a afirmação de OpenBot como base do runtime até existir integração. O custo é baixo; depende de validar endpoints/identidade com a revisão escolhida.

2. **P0 — criar um ledger único de upstreams.** Adicionar `docs/UPSTREAMS.md` com projeto, URL canônica, papel (ancestral, código fixado, referência), SHA/tag, licença/copyright, data da última verificação, se o código está ligado em runtime e teste de atualização esperado. Exigir que cada menção a branch `main` seja acompanhada do SHA observado. Vincular os caminhos e commits deste relatório. Isso elimina a divergência entre os três pins e torna atualização auditável.

3. **P1 — fazer atualização de OpenMuse como manutenção de fork, não rebase cego.** Primeiro atualizar `upstream/main` para o commit oficial corrente; gerar comparação de commits e árvore contra o common ancestor; selecionar mudanças upstream aplicáveis em branch de integração, resolver conflitos por área, executar lint/typecheck/test/build e documentar commits aceitos/rejeitados. Como o `main` local já avançou centenas de commits, prefira merge controlado ou cherry-picks pequenos em branch/PR; não reescreva histórico compartilhado nem tente “voltar” o produto ao upstream. Dependências: responsáveis por domínio, janela para conflitos e CI reproduzível. Valor alto para correções herdáveis; risco alto se feito em lote.

4. **P1 — escolha explicitamente como consumir OpenBot.** Se o objetivo é usar computadores/policy/audit, primeiro trate OpenBot como serviço separado e evolua o adapter HTTP/AG-UI; não importe caminhos de workspaces privados nem acople o runtime à árvore inteira do submodule. Entregue um teste de contrato contra deployment da revisão exata (auth por usuário, run/reconnect/stop, policy refusal, takeover, cancelamento e resultado incerto), sem credenciais compartilhadas. Se o objetivo mudar para absorver código, faça revisão file-by-file da licença e dos limites de identidade/dados, escolha um commit upstream explícito e copie apenas unidades necessárias preservando notices. Valor potencial alto em capabilities de computador; custo/dependência altos porque OpenBot é alpha e tem auth, dados e configuração próprios.

5. **P1 — fechar proveniência/licença no CI e na release.** Incluir OpenBot, OpenMuse e outros materiais efetivamente copiados em `THIRD_PARTY_NOTICES.md` e SBOM com nome, URL, SHA, SPDX, copyright, modificações e escopo de distribuição; não listar OpenDots como código incorporado enquanto for só referência. CI deve inicializar submodules, verificar que o gitlink corresponde ao ledger, checar presença dos notices licenciados e produzir o inventário de dependências. Inventariar separadamente serviços externos e assets/artefatos, sem atribuir a eles a licença MIT do código. Dependências: definição do pacote distribuído e identificação de qualquer código/assets copiados além do que foi localizado nesta auditoria.

6. **P2 — usar OpenDots como catálogo de padrões com atribuição precisa.** Manter comparação em docs e registrar decisões de produto que serão implementadas pelo Whilo. Evitar copiar UI, nomes, vídeo ou código por conveniência. Se um trecho MIT for adotado, registrar commit do OpenDots e o copyright “Atai Barkai” além dos outros notices correspondentes; verificar licenças individuais de dependências e assets. Valor médio/alto para priorização, baixo para integração técnica direta.

## Matriz de estado, risco, valor e dependências

- **Já existe — OpenBot pinado:** gitlink em `cb5dc32...` / `v0.1.0`, alinhado ao upstream oficial em 3/10. **Risco residual médio:** URL configurada é fork. **Valor alto** como snapshot reproduzível. Dependência: migrar URL e manter revisão fixa.
- **Parcial — contrato OpenBot:** adapter disabled-by-default e testes de fixture em `packages/backends/src/openbot.ts` / `tests/openbot.test.ts`. **Risco alto** se confundido com integração. **Valor alto** como boundary já testado. Dependências: deployment, identity bridge e contract/live suite.
- **Ausente — runtime OpenBot conectado:** nenhum uso de produção encontrado, sem live round trip. **Risco alto** para planejamento que conte com suas capabilities. Valor potencial alto; exige serviço, identidade, isolamento e modelo de autorização.
- **Parcial — evolução OpenMuse:** fork e remote upstream existem, mas o ref local está desatualizado e o histórico divergiu. **Risco alto** de merge cego. Valor alto; depende de plano de sincronização incremental.
- **Parcial — compliance de MIT:** licença raiz e licença no submodule existem; inventário consolidado e CI de attribution não existem. **Risco atual baixo/moderado, risco futuro alto** ao copiar código. Dependência: manifest/notice e SBOM.
- **Ausente — código OpenDots incorporado:** só a documentação comparativa apareceu na busca de dependências/código. **Risco baixo hoje; valor como referência médio/alto.** Não abrir adoção de código sem revisão de notice e proveniência.

## Referências oficiais

[1]: https://api.github.com/repos/CopilotKit/OpenBot "GitHub API — metadados do repositório CopilotKit/OpenBot"
[2]: https://api.github.com/repos/CopilotKit/OpenBot/branches/main "GitHub API — branch main do OpenBot"
[3]: https://api.github.com/repos/CopilotKit/OpenBot/releases/latest "GitHub API — release mais recente do OpenBot"
[4]: https://api.github.com/repos/ryantheirreal/OpenBot "GitHub API — fork OpenBot configurado no submodule"
[5]: https://github.com/CopilotKit/OpenBot/blob/main/README.md "OpenBot README — alpha, template e dependências"
[6]: https://raw.githubusercontent.com/CopilotKit/OpenBot/main/LICENSE "OpenBot — licença MIT oficial"
[7]: https://api.github.com/repos/CopilotKit/OpenMuse/branches/main "GitHub API — branch main do OpenMuse"
[8]: https://github.com/CopilotKit/OpenMuse/blob/main/README.md "OpenMuse README — escopo e status do produto"
[9]: https://api.github.com/repos/CopilotKit/OpenDots "GitHub API — metadados, atividade, estrelas e licença do OpenDots"
[10]: https://api.github.com/repos/CopilotKit/OpenDots/branches/main "GitHub API — branch main do OpenDots"
[11]: https://api.github.com/repos/CopilotKit/OpenDots/releases?per_page=10 "GitHub API — releases publicados pelo OpenDots"
[12]: https://github.com/CopilotKit/OpenDots/blob/main/README.md "OpenDots README — template e estado alpha"
[13]: https://github.com/CopilotKit/OpenDots/blob/main/docs/COMPUTERS.md "OpenDots COMPUTERS — dependência de serviço OpenBot"
[14]: https://raw.githubusercontent.com/CopilotKit/OpenMuse/main/LICENSE "OpenMuse — licença MIT oficial"
[15]: https://raw.githubusercontent.com/CopilotKit/OpenDots/main/LICENSE "OpenDots — licença MIT oficial"
[16]: https://api.github.com/repos/ryantheirreal/whilo "GitHub API — Whilo como fork do OpenMuse"
[17]: https://api.github.com/repos/CopilotKit/OpenMuse "GitHub API — metadados atuais do OpenMuse"
[18]: https://api.github.com/repos/CopilotKit/OpenMuse/releases?per_page=10 "GitHub API — releases publicados pelo OpenMuse"
[19]: https://api.github.com/repos/ryantheirreal/OpenBot/branches/main "GitHub API — branch main do fork OpenBot"
