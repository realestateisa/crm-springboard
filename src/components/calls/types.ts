export type Codec = "opus" | "pcmu";

export interface CallState {
  isIncoming: boolean;
  isOnHold: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  isMuted: boolean;
  status: string | null;
}