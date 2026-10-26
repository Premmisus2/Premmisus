// The chatbot module's contract. Everything business-specific lives in a config that fills these
// types in (chatbot/premmisus/), so the engine, the guard and the widget carry over to the next
// business unchanged. Built 2026-10-25 (Mafia/handoff/2026-10-24-chatbot-build-prompt.md).

/** One quiz question the bot can walk a visitor through in conversation. */
export interface ChatQuizQuestion {
  /** Stable key; becomes a field on the lead tool. */
  key: string;
  /** Exact wording. Sent to the destination as the answer's key, so keep it identical to the form. */
  text: string;
  /** Label in the one-line summary the rep reads. */
  short: string;
  options: string[];
}

/**
 * Where a conversation can lead. A 'lead' route ends in the confirm card and the destination; a
 * 'link' route points the visitor elsewhere. A new branch of the business (a bespoke build, a
 * second offer) is a new entry here, never new code.
 */
export type ChatRoute =
  | {
      id: string;
      kind: 'lead';
      /** When to choose this route, written for the model. */
      when: string;
      /** Shown to the rep in the lead message. */
      label: string;
    }
  | {
      id: string;
      kind: 'link';
      when: string;
      /** What the bot says, including the address. */
      say: string;
    };

/** Server-side config: knowledge, model, routes, limits. Never imported by browser code. */
export interface ChatbotServerConfig {
  /** e.g. 'premmisus.ca'. */
  site: string;
  /** Who the bot is, in one or two sentences. */
  identity: string;
  /** The person who calls leads back, as visitors should hear it. */
  ownerName: string;
  /** How quickly the owner calls back, as a phrase ("within one business day"). */
  callbackPromise: string;
  /** Plain-language rules on top of the engine's own (spelling, tone, words to avoid). */
  rules: string[];
  /** Everything the bot may state. Nothing outside this is allowed. */
  knowledge: string;
  /** What to say about price, word for word. */
  priceAnswer: string;
  quiz: ChatQuizQuestion[];
  routes: ChatRoute[];
  model: {
    id: string;
    effort: 'low' | 'medium' | 'high' | 'max';
    maxTokens: number;
    /** Name of the environment variable holding the API key (a key on a spend-capped workspace). */
    apiKeyEnv: string;
  };
  limits: {
    /** Messages kept from the conversation per request; older ones are dropped. */
    maxMessages: number;
    maxMessageChars: number;
    /** Visitor messages allowed in one chat session before the bot hands over to the owner. */
    maxUserTurnsPerSession: number;
    sessionMinutes: number;
    /** Messages one connection may send in ten minutes. */
    perIpPer10Min: number;
    /** New chat sessions one connection may start per hour. */
    sessionsPerIpPerHour: number;
    /** Model calls one server instance makes per day before refusing (backstop under the console cap). */
    callsPerInstancePerDay: number;
  };
  /** Replies the server sends without calling the model. */
  canned: {
    /** When the model wrote nothing alongside the lead card. */
    leadCardIntro: string;
    /** Turn limit reached, model refused, or the model is unavailable. */
    handOver: string;
  };
}

/** Browser-side config: what the widget shows. Holds nothing secret. */
export interface ChatbotUiConfig {
  title: string;
  greeting: string;
  placeholder: string;
  /** Shown when the chat cannot reach the server. */
  offline: string;
  /** The `form` value the destination files this lead under (source_tag becomes site/form). */
  destinationForm: string;
  /** Reply added after the visitor's details reach the destination. */
  sentReply: string;
  sendLabel: string;
}

/** What the server hands the widget when the model asks to save a lead. */
export interface ChatLeadDraft {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  need: string;
  route: string;
  routeLabel: string;
  /** Quiz answers keyed by the question's exact wording. */
  answers: Record<string, string>;
  /** One line for the rep: the need, the quiz answers, the route. */
  message: string;
}

export type ChatLeadStatus = 'none' | 'card' | 'sent';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}
