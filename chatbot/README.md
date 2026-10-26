# Chatbot module

A website chatbot that answers from a fixed set of facts, can walk the site's quiz in conversation,
and turns a visitor who wants a call into a lead. Built 2026-10-25 for premmisus.ca, written so the
next business reuses it by writing a config, not code.

## What lives where

| File | Side | Job |
|---|---|---|
| `types.ts` | both | The contract a business config fills in |
| `engine.ts` | server | Builds the instructions, the one lead tool, calls the model, cleans the reply |
| `guard.ts` | server | Turnstile check, signed chat sessions, rate limits, daily ceiling |
| `premmisus/config.ts` | server | Premmisus knowledge, price answer, quiz, routes, model, limits |
| `premmisus/ui.ts` | browser | Title, greeting, button text, the destination form name |
| `../api/chat.ts` | server | Wires the three server files to the request |
| `../components/Chatbot.tsx` | browser | The window, the editable lead card, the consent box |

## How a lead travels

1. The model has a name, a number and a need, and calls `save_lead`. Nothing is sent.
2. The widget shows a card the visitor can edit, with the optional texting consent box.
3. Send posts the card to the site's normal enquiry endpoint (`/api/enquiry`, form `chatbot`):
   Turnstile, signed forward to the Sales Portal, Inbox, Telegram. The visitor sees "Sent" only
   when that comes back ok.

## Routes

`routes` in the config decides where a conversation can go. A `lead` route ends in the card; a
`link` route points the visitor somewhere else. A new branch of the business (a custom build, a
second offer) is one more entry.

## Reusing it for another business

Copy this folder, write `<business>/config.ts` and `<business>/ui.ts`, point `api/chat.ts` and
`Chatbot.tsx` at them, and set the destination form on that site's enquiry endpoint. The knowledge
text is the only thing the bot may state, so write it from the site, never from memory.

## Cost controls

The API key belongs to a spend-capped workspace in the Anthropic Console (the hard monthly cap).
Under it: a Turnstile check to open each chat, a turn cap per chat, per-connection limits, size caps
and a per-instance daily ceiling. An empty POST to `/api/chat` is refused before any of that, which
is what Maeve's daily probe checks (`premmisus-ca-chat` in Mafia's `endpoint-probes.ts`).
