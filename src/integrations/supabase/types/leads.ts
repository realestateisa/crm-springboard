import { LeadStatus } from './enums';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string | null;
  email?: string;
  phone?: string;
  client?: string;
  status: LeadStatus;
  location: string;
  source?: string;
  timezone?: string;
  lead_type?: string;
  date_created?: string;
  date_updated?: string;
  created_by?: string;
  updated_by?: string;
  description?: string;
}