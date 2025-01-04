import { MessageStatus } from "./enums"

export interface SMS {
  id: string
  external_id: string | null
  lead_id: string | null
  template_id: string | null
  content: string
  status: MessageStatus | null
  scheduled_date: string | null
  sent_date: string | null
  to_phone: string
  from_phone: string
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
}

export interface SMSInsert extends Omit<SMS, "id" | "content" | "to_phone" | "from_phone"> {
  id?: string
  content: string
  to_phone: string
  from_phone: string
}

export interface SMSUpdate extends Partial<SMS> {}