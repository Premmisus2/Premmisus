// What stops a bot running up the model bill. Server only.
//
// Four layers, cheapest first:
//   1. Every chat session starts with a Cloudflare Turnstile check, exchanged for a signed session
//      token. No token, no model call. A script cannot mint tokens without passing Turnstile.
//   2. Per connection and per session limits, held in memory. Fluid compute reuses an instance
//      across requests, so they hold for real traffic; a cold instance starts at zero, which is
//      why layer 1 and 4 exist.
//   3. Size caps on every request, and a daily call ceiling per instance.
//   4. The hard monthly cap: the API key belongs to a spend-limited workspace in the Anthropic
//      Console. When it is reached the model refuses and the bot hands over to the owner.

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { ChatbotServerConfig } from './types';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
let dayKey = '';
let callsToday = 0;

/** Counts one hit against `key`; false once `max` is passed inside the window. */
export function allow(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= max;
}

/** The per-instance daily ceiling. The day is Toronto's, like every other day boundary we keep. */
export function allowModelCall(config: ChatbotServerConfig, now = new Date()): boolean {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  if (today !== dayKey) { dayKey = today; callsToday = 0; }
  callsToday += 1;
  return callsToday <= config.limits.callsPerInstancePerDay;
}

const b64url = (s: string) => Buffer.from(s).toString('base64url');

function sign(key: Buffer, body: string): string {
  return createHmac('sha256', key).update(body).digest('base64url');
}

/** A session key derived from a server secret, so the chat needs no secret of its own. */
export function sessionKey(serverSecret: string): Buffer {
  return createHmac('sha256', serverSecret).update('chatbot-session-v1').digest();
}

export function issueSession(key: Buffer, minutes: number, now = Date.now()): string {
  const body = b64url(JSON.stringify({ sid: randomUUID(), exp: now + minutes * 60_000 }));
  return `${body}.${sign(key, body)}`;
}

export function readSession(key: Buffer, token: unknown, now = Date.now()):
  { ok: true; sid: string } | { ok: false; error: 'session_required' | 'session_invalid' | 'session_expired' } {
  if (typeof token !== 'string' || !token) return { ok: false, error: 'session_required' };
  const [body, sig] = token.split('.');
  if (!body || !sig) return { ok: false, error: 'session_invalid' };
  const expected = Buffer.from(sign(key, body));
  const given = Buffer.from(sig);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, error: 'session_invalid' };
  try {
    const { sid, exp } = JSON.parse(Buffer.from(body, 'base64url').toString()) as { sid?: string; exp?: number };
    if (!sid || typeof exp !== 'number') return { ok: false, error: 'session_invalid' };
    if (exp < now) return { ok: false, error: 'session_expired' };
    return { ok: true, sid };
  } catch {
    return { ok: false, error: 'session_invalid' };
  }
}

export async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }).toString(),
    signal: AbortSignal.timeout(8000),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}
