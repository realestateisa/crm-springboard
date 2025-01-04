import { CallDisposition } from "./enums"

export interface Call {
  id: string
  external_id: string | null
  lead_id: string | null
  disposition: CallDisposition | null
  duration: number | null
  recording_url: string | null
  notes: string | null
  scheduled_date: string | null
  started_at: string | null
  ended_at: string | null
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
}

export interface CallInsert extends Omit<Call, "id"> {
  id?: string
}

export interface CallUpdate extends Partial<Call> {}