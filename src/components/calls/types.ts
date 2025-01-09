export type TwilioCodec = "opus" | "pcmu";
export type Codec = TwilioCodec;

export interface CallState {
  isIncoming: boolean;
  isOngoing: boolean;
  isMuted: boolean;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | null;
}

export interface TransferState {
  childCallSid: string | null;
  transferCallSid: string | null;
  status: 'initial' | 'connecting' | 'completed';
}

export type Lead = Tables<"leads">;