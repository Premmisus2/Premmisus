// premmisus.ca chatbot endpoint. The brain, the guard and the Premmisus config live in chatbot/;
// this file only wires them to the request. Rebuilt 2026-10-25 from the answer-only bot
// (Mafia/handoff/2026-10-24-chatbot-build-prompt.md).
//
//   { action: 'start', turnstileToken }          -> { ok, session }  (Turnstile checked once)
//   { action: 'message', session, messages, lead } -> { ok, reply, lead? }
//
// A lead is only ever a draft here. The visitor sends it from the card through /api/enquiry,
// the same path as every other form. An empty POST is refused with 400 JSON before anything
// else runs: Maeve's daily probe checks exactly that.

import Anthropic from '@anthropic-ai/sdk';
import { runTurn } from '../chatbot/engine.js';
import { allow, allowModelCall, issueSession, readSession, sessionKey, verifyTurnstile } from '../chatbot/guard.js';
import { PREMMISUS_CHATBOT as config } from '../chatbot/premmisus/config.js';
import type { ChatLeadStatus, ChatTurn } from '../chatbot/types';

const MAX_BODY_CHARS = 40_000;

function clientIp(req: any): string {
  const fwd = String(req.headers?.['x-forwarded-for'] || '');
  return (fwd.split(',')[0] || String(req.headers?.['x-real-ip'] || '')).trim().slice(0, 64);
}

/** Visitor and bot turns only, each cut to the size cap, ending on the visitor. */
function readTurns(raw: unknown): ChatTurn[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const turns: ChatTurn[] = [];
  for (const m of raw.slice(-config.limits.maxMessages)) {
    if (!m || typeof m !== 'object') return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const text = content.trim().slice(0, config.limits.maxMessageChars);
    if (!text) return null;
    turns.push({ role, content: text });
  }
  return turns[turns.length - 1].role === 'user' ? turns : null;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  if (JSON.stringify(body).length > MAX_BODY_CHARS) return res.status(413).json({ ok: false, error: 'too_large' });
  const action = body.action;
  if (action !== 'start' && action !== 'message') return res.status(400).json({ ok: false, error: 'missing_fields' });

  const serverSecret = (process.env.INBOUND_WEB_SECRET || '').trim();
  const turnstileSecret = (process.env.TURNSTILE_SECRET_KEY || '').trim();
  const apiKey = (process.env[config.model.apiKeyEnv] || '').trim();
  if (!serverSecret || !turnstileSecret || !apiKey) {
    console.error('chat: not configured', { serverSecret: !!serverSecret, turnstileSecret: !!turnstileSecret, apiKey: !!apiKey });
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }
  const key = sessionKey(serverSecret);
  const ip = clientIp(req) || 'unknown';

  if (action === 'start') {
    const token = String(body.turnstileToken ?? '').slice(0, 4096);
    if (!token) return res.status(403).json({ ok: false, error: 'verification_required' });
    if (!allow(`start:${ip}`, config.limits.sessionsPerIpPerHour, 3_600_000)) return res.status(429).json({ ok: false, error: 'rate_limited' });
    try {
      if (!(await verifyTurnstile(turnstileSecret, token, ip))) return res.status(403).json({ ok: false, error: 'verification_failed' });
    } catch (err) {
      console.error('chat: Turnstile siteverify unreachable', err);
      return res.status(503).json({ ok: false, error: 'verification_unavailable' });
    }
    return res.status(200).json({ ok: true, session: issueSession(key, config.limits.sessionMinutes) });
  }

  const session = readSession(key, body.session);
  if (!session.ok) return res.status(401).json({ ok: false, error: session.error });
  const turns = readTurns(body.messages);
  if (!turns) return res.status(400).json({ ok: false, error: 'invalid_messages' });
  const leadStatus: ChatLeadStatus = body.lead === 'card' || body.lead === 'sent' ? body.lead : 'none';

  if (!allow(`ip:${ip}`, config.limits.perIpPer10Min, 600_000)) return res.status(429).json({ ok: false, error: 'rate_limited' });
  // Counted on the whole conversation sent, not the trimmed part, or a long chat never hits the cap.
  const userTurns = (body.messages as Array<{ role?: unknown }>).filter(m => m?.role === 'user').length;
  if (!allow(`sid:${session.sid}`, config.limits.maxUserTurnsPerSession, config.limits.sessionMinutes * 60_000)
    || userTurns > config.limits.maxUserTurnsPerSession
    || !allowModelCall(config)) {
    return res.status(200).json({ ok: true, reply: config.canned.handOver, limited: true });
  }

  try {
    const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 25_000 });
    const result = await runTurn(client, config, turns, leadStatus);
    return res.status(200).json({ ok: true, reply: result.reply, ...(result.lead ? { lead: result.lead } : {}) });
  } catch (err) {
    // Includes the workspace spend cap being reached. The visitor still gets a way to reach Elliott.
    console.error('chat: model call failed', (err as { status?: number })?.status ?? '', (err as Error)?.message ?? err);
    return res.status(503).json({ ok: false, error: 'model_unavailable', reply: config.canned.handOver });
  }
}
