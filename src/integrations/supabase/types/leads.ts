import { Database } from './database';

export interface Lead extends Database['public']['Tables']['leads']['Row'] {}
export interface LeadInsert extends Database['public']['Tables']['leads']['Insert'] {}
export interface LeadUpdate extends Database['public']['Tables']['leads']['Update'] {}