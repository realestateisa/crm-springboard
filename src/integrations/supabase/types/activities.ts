import { ActivityType } from "./enums"
import { Json } from "./json"

export interface Activity {
  id: string
  external_id: string | null
  lead_id: string
  type: ActivityType
  description: string | null
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
  custom_fields: Json | null
}

export interface ActivityInsert extends Omit<Activity, "id" | "lead_id" | "type"> {
  id?: string
  lead_id: string
  type: ActivityType
}

export interface ActivityUpdate extends Partial<Activity> {}