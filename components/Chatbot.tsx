import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Check } from 'lucide-react';
import {
  useTurnstile, newRequestId, submitEnquiry, consentTextFrom, enquiryErrorMessage, CONSENT_VERSION,
} from '../lib/enquiry';
import { PREMMISUS_CHATBOT_UI as ui } from '../chatbot/premmisus/ui';
import type { ChatLeadDraft, ChatLeadStatus, ChatTurn } from '../chatbot/types';

// The chat window (2026-10-25). It answers from the site's facts, can walk the quiz, and when a
// visitor wants a call it shows their details on a card they can fix. Pressing Send posts the card
// to /api/enquiry exactly like the quiz form (Turnstile, Sales Portal, Telegram), so the visitor
// sees "Sent" only when the portal (or its backup alert) has it.

type LeadCard = {
  kind: 'lead';
  id: string;
  draft: ChatLeadDraft;
  fields: { name: string; phone: string; email: string; businessName: string };
  status: 'editing' | 'sending' | 'sent';
  error: string;
  requestId: string;
};
type ChatItem = ({ kind: 'text' } & ChatTurn) | LeadCard;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const inputClass = 'w-full bg-white/5 border border-white/10 px-3 py-2 font-mono text-[11px] text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors rounded-md';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChatItem[]>([{ kind: 'text', role: 'assistant', content: ui.greeting }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const consentLabelRef = useRef<HTMLLabelElement>(null);

  // One hidden security check for the whole chat: its first token opens the chat session, the
  // next one sends the card. Cloudflare shows it only if it needs the visitor to click.
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstile = useTurnstile(turnstileRef, isOpen, 'interaction-only');
  const tokenRef = useRef('');
  const statusRef = useRef(turnstile.status);
  tokenRef.current = turnstile.token;
  statusRef.current = turnstile.status;
  const sessionRef = useRef<string | null>(null);
  const sessionPromise = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, items]);

  /** Waits for a fresh security token, uses it once, and asks Cloudflare for the next. */
  const takeToken = async (): Promise<string> => {
    const started = Date.now();
    while (!tokenRef.current) {
      if (statusRef.current === 'failed' || Date.now() - started > 15_000) return '';
      await sleep(200);
    }
    const token = tokenRef.current;
    tokenRef.current = '';
    turnstile.reset();
    return token;
  };

  const getSession = (): Promise<string | null> => {
    if (sessionRef.current) return Promise.resolve(sessionRef.current);
    if (!sessionPromise.current) {
      sessionPromise.current = (async () => {
        const token = await takeToken();
        if (!token) return null;
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start', turnstileToken: token }),
          });
          const data = await res.json().catch(() => null);
          sessionRef.current = res.ok && data?.ok ? String(data.session) : null;
        } catch {
          sessionRef.current = null;
        }
        return sessionRef.current;
      })().finally(() => { sessionPromise.current = null; });
    }
    return sessionPromise.current;
  };

  // Open the session as soon as the first token arrives, so the first message doesn't wait.
  useEffect(() => {
    if (isOpen && turnstile.token && !sessionRef.current) void getSession();
  }, [isOpen, turnstile.token]);

  const leadStatus = (list: ChatItem[]): ChatLeadStatus => {
    const cards = list.filter((i): i is LeadCard => i.kind === 'lead');
    if (cards.some(c => c.status === 'sent')) return 'sent';
    return cards.length ? 'card' : 'none';
  };

  const callChat = async (list: ChatItem[], retry = true): Promise<{ reply: string; lead?: ChatLeadDraft }> => {
    const session = await getSession();
    if (!session) return { reply: ui.offline };
    const turns = list.filter((i): i is { kind: 'text' } & ChatTurn => i.kind === 'text').map(({ role, content }) => ({ role, content }));
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'message', session, messages: turns, lead: leadStatus(list) }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 401 && retry) {
        sessionRef.current = null;
        return callChat(list, false);
      }
      if (res.ok && data?.ok && typeof data.reply === 'string') return { reply: data.reply, lead: data.lead };
      return { reply: typeof data?.reply === 'string' ? data.reply : ui.offline };
    } catch {
      return { reply: ui.offline };
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    const next: ChatItem[] = [...items, { kind: 'text', role: 'user', content: trimmed }];
    setItems(next);
    setInput('');
    setIsLoading(true);
    const { reply, lead } = await callChat(next);
    setItems(prev => {
      // A new draft replaces an unsent card (a detail changed); a sent card stays.
      const kept = lead ? prev.filter(i => i.kind !== 'lead' || i.status === 'sent') : prev;
      const added: ChatItem[] = [{ kind: 'text', role: 'assistant', content: reply }];
      if (lead) {
        added.push({
          kind: 'lead', id: newRequestId(), draft: lead, status: 'editing', error: '', requestId: newRequestId(),
          fields: { name: lead.name, phone: lead.phone, email: lead.email, businessName: lead.businessName },
        });
      }
      return [...kept, ...added];
    });
    setIsLoading(false);
  };

  const updateCard = (id: string, patch: Partial<LeadCard>) =>
    setItems(prev => prev.map(i => (i.kind === 'lead' && i.id === id ? { ...i, ...patch } : i)));

  const sendCard = async (card: LeadCard) => {
    const { name, phone, email, businessName } = card.fields;
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      updateCard(card.id, { error: 'Add your name and a phone number or email.' });
      return;
    }
    updateCard(card.id, { status: 'sending', error: '' });
    const token = await takeToken();
    if (!token) {
      updateCard(card.id, { status: 'editing', error: enquiryErrorMessage('verification_failed') });
      return;
    }
    const result = await submitEnquiry({
      requestId: card.requestId,
      form: ui.destinationForm as 'chatbot',
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      businessName: businessName.trim(),
      message: card.draft.message,
      answers: card.draft.answers,
      consent: { service: consent, marketing: false, text: consentTextFrom(consentLabelRef.current), version: CONSENT_VERSION },
      turnstileToken: token,
    });
    if (!result.ok) {
      updateCard(card.id, { status: 'editing', error: enquiryErrorMessage(result.error) });
      return;
    }
    setItems(prev => [
      ...prev.map(i => (i.kind === 'lead' && i.id === card.id ? { ...i, status: 'sent' as const } : i)),
      { kind: 'text', role: 'assistant', content: ui.sentReply },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderCard = (card: LeadCard) => {
    const set = (k: keyof LeadCard['fields']) => (e: React.ChangeEvent<HTMLInputElement>) =>
      updateCard(card.id, { fields: { ...card.fields, [k]: e.target.value }, error: '' });
    if (card.status === 'sent') {
      return (
        <div className="w-full px-4 py-3 rounded-2xl font-mono text-[11px] text-white/80 flex items-center gap-2" style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.25)' }}>
          <Check className="w-4 h-4 text-accent shrink-0" /> Sent to Elliott: {card.fields.name}, {card.fields.phone || card.fields.email}
        </div>
      );
    }
    return (
      <div className="w-full px-4 py-4 rounded-2xl space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,240,255,0.25)' }}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Your details</p>
        <input aria-label="Name" placeholder="Name" className={inputClass} value={card.fields.name} onChange={set('name')} />
        <input aria-label="Phone" type="tel" placeholder="Phone" className={inputClass} value={card.fields.phone} onChange={set('phone')} />
        <input aria-label="Email (optional)" type="email" placeholder="Email (optional)" className={inputClass} value={card.fields.email} onChange={set('email')} />
        <input aria-label="Business name" placeholder="Business name" className={inputClass} value={card.fields.businessName} onChange={set('businessName')} />
        {card.draft.need && (
          <p className="font-mono text-[11px] text-white/60 leading-relaxed"><span className="text-white/40">What you need: </span>{card.draft.need}</p>
        )}
        {/* Informational-only SMS consent checkbox (carrier requirement, Twilio 30913).
            Text must stay identical to Qualifier.tsx, SmsOptInPage.tsx and the Twilio A2P
            campaign MessageFlow, which quotes it verbatim. Optional, unticked by default. */}
        <label ref={consentLabelRef} className="flex items-start gap-2 text-left cursor-pointer pt-1">
          <input
            type="checkbox"
            name="smsConsentService"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-accent cursor-pointer"
          />
          <span className="text-[10px] font-mono text-text-secondary leading-relaxed">
            <span className="text-text-primary">Optional:</span> I agree to receive informational SMS messages from Premmisus Inc. at the number provided: call recaps, meeting confirmations and reminders. Messages may be sent by an automated system. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help at any time. Consent is not a condition of purchase. You must be 18 or older.{' '}
            <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> ·{' '}
            <a href="/terms" className="text-accent hover:underline">Terms &amp; Conditions</a>
          </span>
        </label>
        <p className="text-[10px] font-mono text-text-secondary leading-relaxed">
          By submitting, you agree we may contact you by phone or email about your inquiry. Submitting does not sign you up for text messages.{' '}
          <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> ·{' '}
          <a href="/terms" className="text-accent hover:underline">Terms</a>.
        </p>
        <button
          onClick={() => sendCard(card)}
          disabled={card.status === 'sending'}
          className="w-full bg-accent text-black font-mono font-bold uppercase tracking-wider text-[11px] py-2.5 rounded-md hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {card.status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : ui.sendLabel}
        </button>
        {card.error && <p role="alert" className="text-[11px] font-mono text-red-400 leading-relaxed">{card.error}</p>}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-[340px] md:w-[380px] flex flex-col"
            style={{
              height: '520px',
              maxHeight: 'calc(100vh - 120px)',
              background: 'rgba(0,0,0,0.92)',
              border: '1px solid rgba(0,240,255,0.2)',
              borderRadius: '16px',
              boxShadow: '0 0 40px rgba(0,240,255,0.1), 0 8px 32px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid rgba(0,240,255,0.12)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-sm font-bold text-white uppercase tracking-widest">
                  {ui.title}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-white/30 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
              {items.map((item, idx) =>
                item.kind === 'lead' ? (
                  <div key={item.id}>{renderCard(item)}</div>
                ) : (
                  <div
                    key={idx}
                    className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 font-mono text-xs leading-relaxed whitespace-pre-line ${
                        item.role === 'user'
                          ? 'bg-accent text-black rounded-2xl rounded-br-sm'
                          : 'text-white/80 rounded-2xl rounded-bl-sm'
                      }`}
                      style={
                        item.role === 'assistant'
                          ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
                          : undefined
                      }
                    >
                      {item.content}
                    </div>
                  </div>
                ),
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Loader2 className="w-4 h-4 text-accent animate-spin" />
                  </div>
                </div>
              )}
              <div ref={turnstileRef} className="flex justify-center" />
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="px-4 py-3 shrink-0"
              style={{ borderTop: '1px solid rgba(0,240,255,0.12)' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  maxLength={1000}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={ui.placeholder}
                  aria-label="Message"
                  className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-white/25 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="text-accent disabled:text-white/20 transition-colors hover:text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="w-14 h-14 rounded-2xl bg-accent text-black flex items-center justify-center shadow-lg neon-button"
        style={{ boxShadow: '0 0 24px rgba(0,240,255,0.35)' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
