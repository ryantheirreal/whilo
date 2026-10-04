# Whilo — entrega S+ 01: 24 capacidades funcionais

**Commit:** a publicar após validação  
**Escopo:** control plane server-side e higiene do deploy Vercel

## Capacidades entregues

1. `policyVersion` imutável para correlacionar decisões.
2. Hash SHA-256 determinístico de requests.
3. Grants one-shot com actor, tool, target, request hash e TTL.
4. Claim atômico de grant.
5. Revogação persistida de grant.
6. Expiração persistida de grant.
7. Escopo de grant com recusa de fingerprint divergente.
8. HMAC-SHA256 para webhooks.
9. Timing-safe comparison de assinaturas.
10. Inbox idempotente por `provider:eventId`.
11. Detecção de webhook duplicado.
12. Readiness com leitura real do Store.
13. Contadores de saúde por tipo de registro.
14. Métricas persistidas por owner.
15. Export de auditoria redigido.
16. Classificação de falhas existente exposta por contrato HTTP.
17. Estratégia de recovery existente exposta por contrato HTTP.
18. Snapshot de capabilities com garantias explícitas.
19. Snapshot de segurança fail-closed.
20. Snapshot de deployment sem declarar plataforma não configurada.
21. Budget check persistido em métrica.
22. Verificação de integridade de artefatos por SHA-256.
23. Validação de origin reutilizável.
24. Headers de segurança e `X-Request-ID` em todas as respostas.

## Rotas novas

| Rota | Função |
|---|---|
| `GET /api/o1/splus/capabilities` | Garantias e defaults inseguros desabilitados |
| `GET /api/o1/splus/security` | Política efetiva e TTL máximo |
| `GET /api/o1/splus/deployment` | Estado observável de frontend/API/DB |
| `GET /api/o1/splus/readiness` | Readiness por owner |
| `GET /api/o1/splus/metrics` | Métricas persistidas |
| `GET /api/o1/splus/audit/export` | Export redigido |
| `POST /api/o1/splus/grants` | Emissão de grant |
| `POST /api/o1/splus/grants/:id/claim` | Claim único |
| `POST /api/o1/splus/grants/:id/revoke` | Revogação |
| `POST /api/o1/splus/budget/check` | Orçamento e remaining |
| `POST /api/o1/splus/artifacts/verify` | Integridade SHA-256 |
| `POST /api/o1/splus/recovery` | Recovery classificado |
| `POST /api/o1/splus/webhooks/:provider` | Webhook assinado e deduplicado |

## Segurança

- Nenhum segredo é enviado ao cliente.
- Webhooks sem `WHILO_WEBHOOK_SECRET` falham com `503`.
- Grants são limitados a uma hora e consumidos uma única vez.
- Recursos são sempre particionados pelo owner autenticado.
- O frontend Vercel não recebe backend, worker, Docker, submodule, testes ou documentos.

## Limites honestos

Esta entrega não transforma automaticamente o Whilo em multi-tenant, não cria pagamento de consumidor, não faz booking, não cria WebRTC full-duplex e não publica API persistente na Vercel. Esses caminhos continuam dependentes dos executores e credenciais correspondentes.
