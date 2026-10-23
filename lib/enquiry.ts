/// <reference types="vite/client" />
// premmisus.ca form submissions: the browser half. Elliott, 2026-10-23.
//
// Every form posts to /api/enquiry, which verifies Cloudflare Turnstile and
// forwards the enquiry to the Sales Portal (lead on the Canadian floor, Inbox,
// Telegram). The visitor sees success ONLY when that answer comes back ok.
// Until this change all three forms showed "Got it" whatever happened, and for
// six months nothing reached anyone.

import { useEffect, useRef, useState, type RefObject } from 'react';
import '../types/turnstile.d.ts';

// Production key by default. Local tests set VITE_TURNSTILE_SITEKEY to Cloudflare's
// always-pass test key (1x00000000000000000000AA) so a headless run can submit.
export const TURNSTILE_SITEKEY: string = import.meta.env.VITE_TURNSTILE_SITEKEY || '0x4AAAAAACwEfcixkS53YLBM';
export const CA_PHONE_DISPLAY = '(249) 468-2807';
export const CA_PHONE_TEL = '+12494682807';
/** Bumped whenever the consent checkbox wording changes (it is quoted in the A2P filing). */
export const CONSENT_VERSION = 'ca-sms-info-2026-10-09';

export type TurnstileStatus = 'loading' | 'ready' | 'failed';

/**
 * Renders the Turnstile widget once its script has loaded. The script tag is
 * async, so on a fast page it is often not there yet when the form mounts: the
 * old code checked once and never rendered (P-015). This polls until it is.
 */
export function useTurnstile(containerRef: RefObject<HTMLDivElement>, active = true) {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<TurnstileStatus>('loading');
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (cancelled || widgetId.current) return;
      if (window.turnstile && containerRef.current) {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          callback: (t: string) => { setToken(t); setStatus('ready'); },
          'expired-callback': () => setToken(''),
          'error-callback': () => setStatus('failed'),
          theme: 'dark',
          size: 'flexible',
        });
        window.clearInterval(timer);
      } else if (Date.now() - started > 15_000) {
        setStatus('failed');
        window.clearInterval(timer);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [active, containerRef]);

  const reset = () => {
    setToken('');
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  };

  return { token, status, reset };
}

/** One id per form fill, reused on a retry, so a double click or retry lands once. */
export function newRequestId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export type EnquiryPayload = {
  requestId: string;
  form: 'sms-opt-in' | 'contact' | 'qualifier';
  name: string;
  email?: string;
  phone?: string;
  businessName?: string;
  message?: string;
  answers?: Record<string, string>;
  consent?: { service: boolean; marketing: boolean; text?: Record<string, string>; version: string };
  turnstileToken: string;
};

/** ok only when the server confirms the enquiry reached the Sales Portal (or the backup alert). */
export async function submitEnquiry(payload: EnquiryPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, pageUrl: window.location.href }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data && data.ok === true) return { ok: true };
    return { ok: false, error: (data && typeof data.error === 'string' && data.error) || `http_${res.status}` };
  } catch {
    return { ok: false, error: 'network' };
  }
}

/** What the visitor reads when a submission did not go through. Always honest, always a way out. */
export function enquiryErrorMessage(error?: string): string {
  switch (error) {
    case 'invalid_phone': return 'Please check your phone number: 10 digits, area code first.';
    case 'invalid_email': return 'Please check your email address.';
    case 'verification_required':
    case 'verification_failed': return 'The security check did not go through. Please try again.';
    case 'rate_limited': return `Too many attempts from this connection. Please call us at ${CA_PHONE_DISPLAY}.`;
    default: return `Something went wrong and your details were not sent. Please call us at ${CA_PHONE_DISPLAY}.`;
  }
}

/** Shown when Submit is pressed before the security check is ready. */
export function turnstileWaitMessage(status: TurnstileStatus): string {
  return status === 'failed'
    ? `The security check did not load. Please refresh the page or call us at ${CA_PHONE_DISPLAY}.`
    : 'One moment: the security check above the button is still finishing.';
}

/** The consent wording exactly as the visitor saw it, read from the rendered label. */
export function consentTextFrom(label: HTMLElement | null): Record<string, string> | undefined {
  const text = label?.innerText?.replace(/\s+/g, ' ').trim();
  return text ? { service: text } : undefined;
}
