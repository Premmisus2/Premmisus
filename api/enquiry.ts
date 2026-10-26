// premmisus.ca enquiry intake. Elliott, 2026-10-23: a form submission is an
// opt-in. It lands in the Sales Portal (lead on the Canadian floor, Inbox,
// the portal's Telegram). This replaces /api/ghl and /api/lead-notify, which
// had been dead since 2026-03-25 (no Turnstile secret; nothing provisioned)
// while the forms told every visitor "Got it".
//
// Order:
//   1. Refuse incomplete submissions (400). The daily Mafia monitor probes this.
//   2. Verify Cloudflare Turnstile. No secret configured = refuse (503), never
//      wave everything through.
//   3. Forward to the Sales Portal, signed with INBOUND_WEB_SECRET, retrying once.
//   4. If the portal cannot be reached, or saved the lead but could not send its
//      Telegram, send the details to the Sales Portal chat directly. The visitor
//      gets success only if the enquiry reached someone.

import { createHmac } from 'node:crypto';

const SITE = 'premmisus.ca';
const MAX_BODY_CHARS = 16_000;
// 'chatbot' (2026-10-25): the chat's confirm card posts here like any other form.
const FORMS = new Set(['sms-opt-in', 'contact', 'qualifier', 'text', 'chatbot']);

type Json = Record<string, unknown>;

const str = (v: unknown, n: number): string => String(v ?? '').trim().slice(0, n);

function clientIp(req: any): string {
  const fwd = String(req.headers?.['x-forwarded-for'] || '');
  return (fwd.split(',')[0] || String(req.headers?.['x-real-ip'] || '')).trim().slice(0, 64);
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }).toString(),
    signal: AbortSignal.timeout(8000),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

async function forwardToPortal(portalUrl: string, secret: string, payload: Json): Promise<Json | null> {
  const raw = JSON.stringify(payload);
  for (let attempt = 0; attempt < 2; attempt++) {
    const ts = String(Date.now());
    try {
      const res = await fetch(`${portalUrl.replace(/\/$/, '')}/api/inbound-web`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-premmisus-timestamp': ts,
          'x-premmisus-signature': createHmac('sha256', secret).update(`${ts}.${raw}`).digest('hex'),
        },
        body: raw,
        signal: AbortSignal.timeout(8000),
      });
      const data = (await res.json().catch(() => null)) as Json | null;
      if (res.ok && data?.ok === true) return data;
      if (res.status < 500) return data; // a refusal will not change on retry
    } catch (err) {
      console.error('enquiry: portal forward failed', attempt, err);
    }
  }
  return null;
}

/** Backup alert to the Sales Portal chat. Plain text, so no Markdown can make Telegram reject it. */
async function backupAlert(lines: string[]): Promise<boolean> {
  const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chat = (process.env.TELEGRAM_CHAT_ID || '').trim();
  if (!token || !chat) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: lines.join('\n').slice(0, 3900) }),
      signal: AbortSignal.timeout(6000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const body: Json = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  if (JSON.stringify(body).length > MAX_BODY_CHARS) return res.status(413).json({ ok: false, error: 'too_large' });

  const name = str(body.name, 160);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const form = str(body.form, 40);
  const requestId = str(body.requestId, 100);
  if (!name || (!email && !phone) || !requestId || !FORMS.has(form)) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }
  // Same rules the portal applies, checked here so the visitor can fix a typo.
  const digits = phone.replace(/\D/g, '');
  if (phone && !(digits.length === 10 || (digits.length === 11 && digits.startsWith('1')))) {
    return res.status(400).json({ ok: false, error: 'invalid_phone' });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'invalid_email' });

  const ip = clientIp(req);
  const turnstileSecret = (process.env.TURNSTILE_SECRET_KEY || '').trim();
  if (!turnstileSecret) {
    console.error('enquiry: TURNSTILE_SECRET_KEY is not set; refusing submissions');
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }
  const token = str(body.turnstileToken, 4096);
  if (!token) return res.status(403).json({ ok: false, error: 'verification_required' });
  try {
    if (!(await verifyTurnstile(turnstileSecret, token, ip))) return res.status(403).json({ ok: false, error: 'verification_failed' });
  } catch (err) {
    console.error('enquiry: Turnstile siteverify unreachable', err);
    return res.status(503).json({ ok: false, error: 'verification_unavailable' });
  }

  const consent = (body.consent && typeof body.consent === 'object' ? body.consent : {}) as Json;
  const payload: Json = {
    requestId,
    site: SITE,
    form,
    name,
    email: email || undefined,
    phone: phone || undefined,
    businessName: str(body.businessName, 160) || undefined,
    message: str(body.message, 2000) || undefined,
    answers: body.answers && typeof body.answers === 'object' ? body.answers : undefined,
    consent: {
      service: consent.service === true,
      marketing: consent.marketing === true,
      text: consent.text && typeof consent.text === 'object' ? consent.text : undefined,
      version: str(consent.version, 60) || undefined,
    },
    pageUrl: str(body.pageUrl, 500) || undefined,
    ip: ip || undefined,
    userAgent: str(req.headers?.['user-agent'], 400) || undefined,
  };

  const portalUrl = (process.env.SALES_PORTAL_URL || '').trim();
  const secret = (process.env.INBOUND_WEB_SECRET || '').trim();
  const result = portalUrl && secret ? await forwardToPortal(portalUrl, secret, payload) : null;
  const saved = result?.ok === true;
  const alerts = (result?.alerts || {}) as Json;

  const details = [
    `Name: ${name}`,
    phone ? `Phone: ${phone}` : '',
    email ? `Email: ${email}` : '',
    payload.businessName ? `Business: ${payload.businessName}` : '',
    `Form: ${SITE}/${form}`,
    `Texts: ${consent.service === true ? 'OK (info)' : 'not agreed, call or email only'}`,
    payload.message ? `\n${payload.message}` : '',
  ].filter(Boolean);

  if (saved && alerts.telegram === true) return res.status(200).json({ ok: true });

  if (saved) {
    // Lead is on the floor, but the portal's own Telegram did not go out.
    await backupAlert(['🇨🇦 CANADA · 🌐 WEBSITE ENQUIRY (backup alert: the portal saved it but could not send Telegram)', ...details,
      `\nhttps://portal.premmisus.ca/?view=inbox&lead=${String(result?.leadId || '')}`]);
    return res.status(200).json({ ok: true });
  }

  // A flood from one IP: no backup alert, or a bot could fill the chat.
  if (result?.error === 'rate_limited') return res.status(429).json({ ok: false, error: 'rate_limited' });

  // The portal did not save it. The enquiry must still reach someone.
  console.error('enquiry: portal did not save', result?.error || 'unreachable');
  const reached = await backupAlert(['🇨🇦 CANADA · ⚠️ WEBSITE ENQUIRY NOT SAVED IN THE SALES PORTAL. Add it by hand and call them.',
    `Portal answer: ${String(result?.error || 'unreachable')}`, ...details]);
  return reached ? res.status(200).json({ ok: true, backup: true }) : res.status(502).json({ ok: false, error: 'not_delivered' });
}
