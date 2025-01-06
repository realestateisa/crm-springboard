import { useState } from 'react';

export type CallStatus = 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
export type TransferStatus = 'connecting' | 'transferred' | 'failed' | undefined;

export function useCallState() {
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [transferStatus, setTransferStatus] = useState<TransferStatus>();
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [originalCallerHungUp, setOriginalCallerHungUp] = useState(false);
  const [outboundCallSid, setOutboundCallSid] = useState<string | null>(null);

  return {
    callStatus,
    setCallStatus,
    transferStatus,
    setTransferStatus,
    isMuted,
    setIsMuted,
    isOnHold,
    setIsOnHold,
    originalCallerHungUp,
    setOriginalCallerHungUp,
    outboundCallSid,
    setOutboundCallSid
  };
}