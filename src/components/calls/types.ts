import { Tables } from "@/integrations/supabase/types";

// Make sure TwilioCodec and Codec are the same type - they must be identical
export type TwilioCodec = "opus" | "pcmu";
export type Codec = TwilioCodec; // This ensures they are exactly the same type

export interface CallState {
  isIncoming: boolean;
  isOutgoing: boolean;
  isActive: boolean;
  isMuted: boolean;
  isOnHold: boolean;
  phoneNumber: string | null;
  callSid: string | null;
  childCallSid: string | null;
  transferCallSid: string | null;
  status: 'initial' | 'connecting' | 'completed';
}

export interface TransferState {
  childCallSid: string | null;
  transferCallSid: string | null;
  status: 'initial' | 'connecting' | 'completed';
}

export type Lead = Tables<"leads">;