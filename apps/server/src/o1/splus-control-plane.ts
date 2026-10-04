import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Store } from "../db.ts";
import { AppError } from "../errors.ts";
import { classifyFailure, decideRecovery } from "./recovery-engine.ts";
import { redactSecrets, type O1Risk } from "./policy.ts";

export type SPlusGrantStatus = "active" | "claimed" | "revoked" | "expired";
export interface SPlusGrant {
  id: string;
  owner: string;
  actorId: string;
  toolId: string;
  risk: O1Risk;
  target?: string;
  requestHash: string;
  policyVersion: string;
  status: SPlusGrantStatus;
  createdAt: string;
  expiresAt: string;
  claimedAt?: string;
  revokedAt?: string;
}
export interface SPlusWebhookReceipt {
  id: string;
  owner: string;
  provider: string;
  eventId: string;
  payloadHash: string;
  status: "accepted" | "duplicate" | "rejected";
  receivedAt: string;
}

type Metric = {
  id: string;
  owner: string;
  name: string;
  value: number;
  at: string;
  tags?: Record<string, string>;
};
const POLICY_VERSION = "whilo-splus-2026-10-03";
const nowIso = () => new Date().toISOString();

export class SPlusControlPlane {
  constructor(private readonly db: Store) {}

  policyVersion() {
    return POLICY_VERSION;
  }

  requestHash(input: unknown) {
    return createHash("sha256").update(JSON.stringify(input)).digest("hex");
  }

  issueGrant(
    input: Omit<SPlusGrant, "id" | "status" | "createdAt" | "policyVersion"> & { ttlMs?: number },
  ) {
    const createdAt = nowIso();
    const grant: SPlusGrant = {
      id: randomUUID(),
      owner: input.owner,
      actorId: input.actorId,
      toolId: input.toolId,
      risk: input.risk,
      ...(input.target ? { target: input.target } : {}),
      requestHash: input.requestHash,
      policyVersion: POLICY_VERSION,
      status: "active",
      createdAt,
      expiresAt: new Date(
        Date.now() + Math.max(1_000, Math.min(input.ttlMs ?? 5 * 60_000, 60 * 60_000)),
      ).toISOString(),
    };
    return this.db
      .insertIfAbsent(input.owner, "splus-grants", grant)
      .then((stored) => stored ?? grant);
  }

  async getGrant(owner: string, id: string) {
    return this.db.get<SPlusGrant>(owner, "splus-grants", id);
  }

  async revokeGrant(owner: string, id: string) {
    const grant = await this.getGrant(owner, id);
    if (!grant) throw new AppError("Grant not found", 404);
    if (grant.status === "claimed" || grant.status === "revoked") return grant;
    const revoked = { ...grant, status: "revoked" as const, revokedAt: nowIso() };
    await this.db.put(owner, "splus-grants", revoked);
    return revoked;
  }

  async claimGrant(
    owner: string,
    id: string,
    input: { actorId: string; toolId: string; requestHash: string; target?: string },
  ) {
    const grant = await this.getGrant(owner, id);
    if (!grant) throw new AppError("Grant not found", 404);
    if (
      grant.actorId !== input.actorId ||
      grant.toolId !== input.toolId ||
      grant.requestHash !== input.requestHash ||
      grant.target !== input.target
    )
      throw new AppError("Grant scope does not match this action", 409);
    if (Date.parse(grant.expiresAt) <= Date.now()) {
      await this.db.put(owner, "splus-grants", { ...grant, status: "expired" as const });
      throw new AppError("Grant expired", 409);
    }
    const claimed = await this.db.claimStatus<SPlusGrant>(
      owner,
      "splus-grants",
      id,
      "active",
      "claimed",
    );
    if (!claimed) throw new AppError("Grant was already claimed or revoked", 409);
    return { ...claimed, claimedAt: nowIso() };
  }

  async acceptWebhook(
    owner: string,
    provider: string,
    eventId: string,
    payload: unknown,
    signature?: string,
    secret = process.env.WHILO_WEBHOOK_SECRET,
  ) {
    if (!secret) throw new AppError("Webhook secret is not configured", 503);
    if (!signature) throw new AppError("Webhook signature is required", 401);
    const expected = createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");
    const a = Buffer.from(signature.replace(/^sha256=/, ""));
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b))
      throw new AppError("Invalid webhook signature", 401);
    const payloadHash = this.requestHash(payload);
    const receipt: SPlusWebhookReceipt = {
      id: randomUUID(),
      owner,
      provider,
      eventId,
      payloadHash,
      status: "accepted",
      receivedAt: nowIso(),
    };
    const stored = await this.db.insertIfAbsent(owner, "splus-webhooks", {
      ...receipt,
      id: eventId,
    });
    if (!stored) return { ...receipt, id: eventId, status: "duplicate" as const };
    return stored;
  }

  async recordMetric(owner: string, name: string, value = 1, tags?: Record<string, string>) {
    const metric: Metric = {
      id: randomUUID(),
      owner,
      name,
      value,
      at: nowIso(),
      ...(tags ? { tags } : {}),
    };
    await this.db.put(owner, "splus-metrics", metric);
    return metric;
  }

  async metrics(owner: string, limit = 200) {
    return (await this.db.list<Metric>(owner, "splus-metrics")).slice(
      0,
      Math.min(500, Math.max(1, limit)),
    );
  }

  async readiness(owner: string) {
    const started = Date.now();
    const [audit, grants, webhooks] = await Promise.all([
      this.db.list(owner, "o1-audit"),
      this.db.list(owner, "splus-grants"),
      this.db.list(owner, "splus-webhooks"),
    ]);
    return {
      ok: true,
      policyVersion: POLICY_VERSION,
      storage: "ready",
      latencyMs: Date.now() - started,
      counts: { audit: audit.length, grants: grants.length, webhooks: webhooks.length },
    };
  }

  async exportAudit(owner: string, limit = 500) {
    const events = await this.db.list(owner, "o1-audit");
    return {
      exportedAt: nowIso(),
      policyVersion: POLICY_VERSION,
      events: events
        .slice(0, Math.min(500, Math.max(1, limit)))
        .map((event) => redactSecrets(event)),
    };
  }

  verifyArtifact(input: { content: string | Uint8Array; expectedSha256?: string }) {
    const sha256 = createHash("sha256").update(input.content).digest("hex");
    return { sha256, verified: input.expectedSha256 ? sha256 === input.expectedSha256 : false };
  }

  recovery(error: unknown) {
    const failure = classifyFailure(error);
    return { failure, ...decideRecovery(failure) };
  }

  capabilitySnapshot() {
    return {
      policyVersion: POLICY_VERSION,
      guarantees: [
        "one-shot-grants",
        "atomic-claims",
        "signed-webhooks",
        "idempotent-webhook-receipts",
        "redacted-audit-export",
        "artifact-integrity",
        "recovery-classification",
        "readiness",
        "metrics",
      ],
      unsafeDefaultsDisabled: [
        "unscoped-cua",
        "blind-external-retry",
        "unsigned-webhook",
        "cross-owner-access",
      ],
    };
  }

  securitySnapshot() {
    return {
      denyByDefault: true,
      externalWritesRequireGrant: true,
      destructiveWritesRequireExplicitApproval: true,
      webhookSignature: "hmac-sha256",
      grantTtlMaxMs: 60 * 60_000,
      policyVersion: POLICY_VERSION,
    };
  }

  deploymentSnapshot() {
    return {
      frontend: "vercel-static",
      api: "node-persistent-required",
      worker: "separate-process-recommended",
      database: process.env.DATABASE_URL ? "postgres-configured" : "pglite-local",
      cloudflareIngress: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID),
      supabase: Boolean(process.env.SUPABASE_URL),
      policyVersion: POLICY_VERSION,
    };
  }

  async budget(owner: string, input: { scope: string; used: number; limit: number }) {
    if (
      !Number.isFinite(input.used) ||
      !Number.isFinite(input.limit) ||
      input.limit < 0 ||
      input.used < 0
    )
      throw new AppError("Invalid budget", 422);
    const allowed = input.used < input.limit;
    await this.recordMetric(owner, "budget.check", allowed ? 1 : 0, { scope: input.scope });
    return { ...input, allowed, remaining: Math.max(0, input.limit - input.used) };
  }

  validateToolScope(input: { allowedTools: string[]; toolId: string }) {
    return { toolId: input.toolId, allowed: input.allowedTools.includes(input.toolId) };
  }

  normalizeOrigin(origin: string) {
    try {
      return new URL(origin).origin;
    } catch {
      throw new AppError("Invalid origin", 422);
    }
  }

  eventKey(provider: string, eventId: string) {
    return `${provider}:${eventId}`;
  }

  healthHeaders() {
    return { "X-Whilo-Policy-Version": POLICY_VERSION, "X-Whilo-Readiness": "storage-backed" };
  }
}
