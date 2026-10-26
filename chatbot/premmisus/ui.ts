// Premmisus's chatbot config (browser side). Nothing secret: this ships to every visitor.

import type { ChatbotUiConfig } from '../types';

export const PREMMISUS_CHATBOT_UI: ChatbotUiConfig = {
  title: 'Premmisus AI',
  greeting: "Hey. I'm the Premmisus assistant. Ask me about the four systems, how setup works, or whether it fits your business.",
  placeholder: 'Ask anything...',
  offline: "Having trouble connecting right now. Call (249) 468-2807 or email elliott@premmisus.com and we'll get back to you fast.",
  // The Sales Portal files it as source_tag 'premmisus.ca/chatbot'.
  destinationForm: 'chatbot',
  sentReply: 'Sent. Elliott will call you within one business day.',
  sendLabel: 'Send to Elliott',
};
