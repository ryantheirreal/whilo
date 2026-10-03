# Whilo — plano de execução S+ acelerado

**Status:** em execução  
**Baseline auditado:** 4,7/10  
**Objetivo imediato:** 8/10 demonstrável  
**Objetivo final:** 10/10 operacional, sem inflar score por capability flag

## Regra de qualidade

Só contar uma capacidade quando houver **executor real, autorização server-side, estado persistido, receipt, teste e observabilidade**. Plataformas externas conectadas não substituem evidência versionada no repositório.

## Lote 1 — bloqueadores P0 fechados nesta entrega

- Claim atômico genérico no `Store` para transições de status.
- Browser actions passam a usar `insertIfAbsent` antes do dispatch externo.
- Aprovação de connector usa claim condicional `awaiting_review → executing`.
- Aprovação passa a registrar evento `approved` antes do efeito externo.
- `approve_for_me` não autoriza automaticamente ações `external` ou `destructive`.

## Lote 2 — próxima sequência obrigatória

1. Criar `ActionKernel` único e encaminhar browser, connector, computer, file mutation e payment por ele.
2. Propagar `invocationId`, `runId`, `toolCallId`, `requestHash` e `policyVersion` em toda ação.
3. Transformar receipts em máquina de estados universal: `proposed → approved → claimed → executing → succeeded|failed|outcome_unknown`.
4. Criar grants CUA one-shot vinculados a chamada, hash de ações, ator e expiração.
5. Adicionar testes de corrida, crash antes/depois do provider e timeout pós-dispatch.
6. Corrigir capability registry para anunciar somente executores realmente conectados.

## Lote 3 — nota 8 demonstrável

- CI verde em clone limpo com Node/pnpm fixados.
- Testes de concorrência para browser/connectors.
- Auditoria pré e pós-dispatch correlacionada.
- Recovery de `executing` com `outcome_unknown` e reconciliação explícita.
- OpenBot mantido disabled até contrato live, `requestId`, identidade delegada e ACL comprovados.
- Travel/purchase/payment/voice descritos exatamente no nível implementado.
- PWA com design tokens semânticos, assets separados e contraste validado.

## Lote 4 — nota 10/1000

- Auth/tenant/RBAC com isolamento no banco.
- Supabase migrations, RLS, event log, outbox/inbox e storage privado.
- Cloudflare ingress assinado com replay protection, Queue e DLQ.
- API/worker/browser separados, readiness real, métricas, SLO, backup e restore testado.
- Voice WebRTC/realtime com consentimento, captions, cancelamento e bridge governada.
- Commerce somente após quote/cart/payment/booking/refund com provider state e reconciliação.
- Spaces, Pages, Missions e Handoffs com IDs tipados e dispatch real.

## Gates de release

| Gate | Critério |
|---|---|
| Segurança | Zero dispatch sem grant; external/destructive sempre revisados por chamada |
| Idempotência | N chamadas concorrentes iguais produzem no máximo um efeito |
| Incerteza | Timeout pós-dispatch nunca vira retry automático |
| Identidade | Owner/tenant/actor derivados do servidor e testados cross-scope |
| Proveniência | SHA, URL, licença, notices e SBOM conferidos no CI |
| Operação | readiness DB/worker/browser, logs redigidos, métricas e rollback documentados |
| Produto | Copy e capabilities correspondem ao caminho executável real |

## Evidência desta fase

- Auditoria consolidada: `docs/SPLUS-CODE-REVIEW-GRAPH.md`.
- Auditorias-base: `docs/audit-splus-01-execution.md`, `docs/audit-splus-02-security.md`, `docs/audit-splus-11-platform.md`.
- Alterações desta fase: `apps/server/src/db.ts`, `apps/server/src/o1/browser-actions.ts`, `apps/server/src/o1/connector-actions.ts`, `apps/server/src/o1/permissions.ts`.

## Observação de plataformas

Cloudflare, Vercel, GitHub e Supabase foram declarados pelo owner como conectados, mas não há configuração correspondente exposta nesta sessão. Nenhum segredo foi lido, e nenhum deploy é declarado como concluído sem evidência do ambiente.
