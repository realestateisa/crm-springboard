import { Tables } from '@/integrations/supabase/types';

export type TwilioCodec = "opus" | "pcmu";
export type Codec = TwilioCodec;

export type CallStatus = 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | null;

export interface CallState {
  isIncoming: boolean;
  isOngoing: boolean;
  isMuted: boolean;
  status: CallStatus;
}

export interface TransferState {
  childCallSid: string | null;
  transferCallSid: string | null;
  status: 'initial' | 'connecting' | 'completed';
}

export type Lead = Tables<"leads">;