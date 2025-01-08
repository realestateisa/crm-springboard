export const LeadStatusEnum = {
  SEND_AI_TEXT: 'Send AI Text (Continue Outreach)',
  POTENTIAL: 'Potential',
  CONNECTED: 'Connected',
  UNQUALIFIED: 'Unqualified',
  BAD_PHONE_NUMBER: 'Bad Phone Number',
  INTERESTED: 'Interested',
  MISSED_TRANSFER: 'Missed Transfer',
  DO_NOT_CONTACT: 'Do Not Contact',
  SEND_TO_CLIENT: 'Send to Client',
  CONTACT_LATER: 'Contact Later'
} as const;

export type LeadStatus = typeof LeadStatusEnum[keyof typeof LeadStatusEnum];

export type ActivityType = 'call' | 'sms' | 'email' | 'note' | 'custom';
export type CallDisposition = 'answered' | 'no_answer' | 'busy' | 'voicemail' | 'wrong_number' | 'disconnected' | 'callback_requested';
export type MessageStatus = 'draft' | 'scheduled' | 'sent' | 'delivered' | 'failed';
export type SequenceStatus = 'active' | 'paused' | 'archived';
export type UserRole = 'admin' | 'isa';