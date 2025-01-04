import { MessageStatus } from "./enums"

export interface Email {
  id: string
  external_id: string | null
  lead_id: string | null
  template_id: string | null
  subject: string
  content: string
  status: MessageStatus | null
  scheduled_date: string | null
  sent_date: string | null
  to_email: string
  from_email: string
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
}

export interface EmailInsert extends Omit<Email, "id" | "subject" | "content" | "to_email" | "from_email"> {
  id?: string
  subject: string
  content: string
  to_email: string
  from_email: string
}

export interface EmailUpdate extends Partial<Email> {}