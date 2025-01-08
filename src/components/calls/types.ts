export type TwilioCodec = "opus" | "pcmu";

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