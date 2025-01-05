import { Json } from "./json"
import { LeadStatus } from "./enums"

export interface Lead {
  api_url: string | null
  client: string | null
  created_by: string | null
  custom_fields: Json | null
  date_created: string | null
  date_updated: string | null
  description: string | null
  email: string | null
  external_id: string | null
  first_name: string
  last_name: string
  id: string
  location: string | null
  phone: string | null
  phone_formatted: string | null
  phone_status: string | null
  phone_type: string | null
  script: string | null
  source: string | null
  status: LeadStatus | null
  timezone: string | null
  updated_by: string | null
}

export interface LeadInsert extends Partial<Omit<Lead, "first_name" | "last_name">> {
  first_name: string
  last_name: string
}

export interface LeadUpdate extends Partial<Lead> {}