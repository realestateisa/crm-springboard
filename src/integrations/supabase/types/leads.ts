import { Database } from './database';

type DbLead = Database['public']['Tables']['leads']['Row'];
type DbLeadInsert = Database['public']['Tables']['leads']['Insert'];
type DbLeadUpdate = Database['public']['Tables']['leads']['Update'];

export type Lead = DbLead;
export type LeadInsert = DbLeadInsert;
export type LeadUpdate = DbLeadUpdate;