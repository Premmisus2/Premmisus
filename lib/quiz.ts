// The premmisus.ca quiz, in one place: the Qualifier form asks it with buttons, the chatbot
// asks it in conversation (chatbot/premmisus/config.ts). Moved out of Qualifier.tsx 2026-10-25.
//
// Q1's wording is read verbatim by the Sales Portal (lib/web-enquiry.ts nicheFrom) to file the
// lead's trade, and its options are the portal's own niche names (NICHE_LIST). Change neither
// without changing the portal. Rewritten with Elliott 2026-10-25.

export interface QuizQuestion {
  /** Stable key, used by the chatbot's lead tool. */
  key: string;
  id: number;
  text: string;
  /** Label for this answer in the enquiry message the rep reads (Inbox, lead note, Telegram). */
  short: string;
  options: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    key: 'trade',
    id: 1,
    text: "Which industry describes you best?",
    short: "Trade",
    options: ["Cleaning", "Landscaping", "Plumbing", "Pressure Washing", "Window Washing", "Construction & Handyman", "Other"]
  },
  {
    key: 'website',
    id: 2,
    text: "Do you have a website now?",
    short: "Has a website",
    options: ["Yes, and it brings in work", "Yes, but it doesn't bring in much", "No"]
  },
  {
    key: 'slipping',
    id: 3,
    text: "Where do jobs slip away?",
    short: "Jobs slip away",
    options: ["Calls I miss while I'm on a job", "New requests I'm slow to answer", "Not enough Google reviews", "Past customers who don't come back", "Not sure, I'd like to talk it through"]
  }
];

/** The answers as one line for the rep. The portal shows only the message, never raw answers. */
export function quizAnswersMessage(answers: Record<string, string>): string {
  return QUIZ_QUESTIONS
    .filter(q => answers[q.text])
    .map(q => `${q.short}: ${answers[q.text]}`)
    .join(' | ');
}
