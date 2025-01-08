import { Database } from './database';

type Tables = Database['public']['Tables'];
export type Lead = Tables['leads']['Row'];
export type LeadInsert = Tables['leads']['Insert'];
export type LeadUpdate = Tables['leads']['Update'];