export type TwilioCodec = 'opus' | 'pcmu';
export type Codec = 'opus' | 'pcmu';

export type TransferState = {
  childCallSid: string | null;
  transferCallSid: string | null;
  status: 'initial' | 'connecting' | 'completed';
};