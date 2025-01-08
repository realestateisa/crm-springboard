export type TwilioCodec = 'opus' | 'pcmu';
export type Codec = TwilioCodec; // Make Codec type match TwilioCodec

export type TransferState = {
  childCallSid: string | null;
  transferCallSid: string | null;
  status: 'initial' | 'connecting' | 'completed';
};