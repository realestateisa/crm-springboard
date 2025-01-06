export type ActivityType = "call" | "sms" | "email" | "note" | "custom"
export type CallDisposition = "answered" | "no_answer" | "busy" | "voicemail" | "wrong_number" | "disconnected" | "callback_requested"

export const LeadStatus = {
  SEND_AI_TEXT: "Send AI Text (Continue Outreach)",
  POTENTIAL: "Potential",
  CONNECTED: "Connected",
  UNQUALIFIED: "Unqualified",
  BAD_PHONE_NUMBER: "Bad Phone Number",
  INTERESTED: "Interested",
  MISSED_TRANSFER: "Missed Transfer",
  DO_NOT_CONTACT: "Do Not Contact",
  SEND_TO_CLIENT: "Send to Client",
  CONTACT_LATER: "Contact Later",
  NOT_INTERESTED: "Not Interested"
} as const;

export type LeadStatus = typeof LeadStatus[keyof typeof LeadStatus];

export type MessageStatus = "draft" | "scheduled" | "sent" | "delivered" | "failed"
export type SequenceStatus = "active" | "paused" | "archived"
export type UserRole = "admin" | "isa"