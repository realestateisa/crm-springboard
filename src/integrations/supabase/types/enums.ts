export type LeadStatus = 
  | 'Send AI Text (Continue Outreach)'
  | 'Potential'
  | 'Connected'
  | 'Unqualified'
  | 'Bad Phone Number'
  | 'Interested'
  | 'Missed Transfer'
  | 'Do Not Contact'
  | 'Send to Client'
  | 'Contact Later';

export type ActivityType = 'call' | 'sms' | 'email' | 'note' | 'custom';
export type CallDisposition = 'answered' | 'no_answer' | 'busy' | 'voicemail' | 'wrong_number' | 'disconnected' | 'callback_requested';
export type MessageStatus = 'draft' | 'scheduled' | 'sent' | 'delivered' | 'failed';
export type SequenceStatus = 'active' | 'paused' | 'archived';
export type UserRole = 'admin' | 'isa';