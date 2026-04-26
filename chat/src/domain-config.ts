export interface ChatDomainEnv {
  CHAT_PARENT_DOMAINS?: string;
  CHAT_PARENT_DOMAIN?: string;
  CHAT_SIGNING_PREFIX?: string;
}

const LABEL_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const FULL_DOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

function normalizeParentEntry(entry: string, networkTld: string): string | null {
  const raw = entry.trim().toLowerCase().replace(/^\*\./, "").replace(/^\./, "");
  if (!raw) return null;
  const candidate = raw.includes(".") ? raw : `${raw}.${networkTld}`;
  if (!FULL_DOMAIN_PATTERN.test(candidate)) return null;
  return candidate;
}

export function getAllowedParentDomains(
  env: ChatDomainEnv,
  networkTld: string,
): string[] {
  const raw = env.CHAT_PARENT_DOMAINS || env.CHAT_PARENT_DOMAIN || "wtf,hack";
  const domains = raw
    .split(",")
    .map((entry) => normalizeParentEntry(entry, networkTld))
    .filter((entry): entry is string => Boolean(entry));
  return [...new Set(domains)];
}

export function defaultParentDomain(parentDomains: string[]): string {
  return parentDomains[0] || "wtf.tez";
}

export function getChatSigningPrefix(
  env: ChatDomainEnv,
  parentDomains: string[],
): string {
  return (env.CHAT_SIGNING_PREFIX || `${defaultParentDomain(parentDomains)}-chat`).trim();
}

export function buildChatChallengeMessage(
  timestamp: number,
  nonce: string,
  signingPrefix: string,
): string {
  return `${signingPrefix}:${timestamp}:${nonce}`;
}

export function normalizeChatDomain(
  input: string,
  parentDomains: string[],
): { ok: true; domain: string } | { ok: false; error: string } {
  const raw = input.trim().toLowerCase();
  if (!raw) return { ok: false, error: "targetDomain is required" };
  if (raw.length > 180) return { ok: false, error: "Domain is too long" };

  if (!raw.includes(".")) {
    if (raw.length > 63 || !LABEL_PATTERN.test(raw)) {
      return { ok: false, error: "Invalid label format" };
    }
    return { ok: true, domain: `${raw}.${defaultParentDomain(parentDomains)}` };
  }

  for (const parent of parentDomains) {
    const suffix = `.${parent}`;
    if (!raw.endsWith(suffix)) continue;
    const label = raw.slice(0, -suffix.length);
    if (!label.includes(".") && LABEL_PATTERN.test(label)) {
      return { ok: true, domain: raw };
    }
  }

  return {
    ok: false,
    error: `Domain must be a label or end with ${parentDomains.map((d) => `.${d}`).join(" / ")}`,
  };
}

export function getAdminDomains(parentDomains: string[]): string[] {
  return parentDomains.map((parent) => `admin.${parent}`);
}

export function stripKnownParentDomain(domain: string, parentDomains: string[]): string {
  const lower = domain.toLowerCase();
  for (const parent of parentDomains) {
    const suffix = `.${parent}`;
    if (lower.endsWith(suffix)) return domain.slice(0, -suffix.length);
  }
  return domain;
}
