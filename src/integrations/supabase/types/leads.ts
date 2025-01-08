import { LeadStatus } from "./enums";
import { Json } from "./json";

export interface Lead {
  id: string;
  email: string | null;
  phone: string | null;
  phone_formatted: string | null;
  description: string | null;
  client: string | null;
  status: LeadStatus;
  location: string;
  source: string | null;
  timezone: string | null;
  script: string | null;
  phone_status: string | null;
  phone_type: string | null;
  api_url: string | null;
  date_created: string | null;
  date_updated: string | null;
  created_by: string | null;
  updated_by: string | null;
  custom_fields: Json | null;
  first_name: string;
  last_name: string | null;
  transfer_ext: string | null;
  lead_type: string | null;
  crm_id: string | null;
}

export interface LeadInsert extends Partial<Omit<Lead, "first_name" | "location">> {
  first_name: string;
  location: string;
}

export interface LeadUpdate extends Partial<Lead> {}