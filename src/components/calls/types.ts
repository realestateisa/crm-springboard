import { Tables } from "@/integrations/supabase/types";

export type TwilioCodec = "opus" | "pcmu";
export type Codec = TwilioCodec;

export interface CallState {
  isIncoming: boolean;
  isOnHold: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  isMuted: boolean;
  status: string | null;
}

export interface TransferState {
  childCallSid: string | null;
  transferCallSid: string | null;
  status: 'initial' | 'connecting' | 'completed';
}

export type Lead = Tables<"leads">;