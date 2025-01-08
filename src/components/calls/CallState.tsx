import { useState } from 'react';
import { TransferState } from './types';

export function useCallState() {
  const [call, setCall] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [transferState, setTransferState] = useState<TransferState>({
    childCallSid: null,
    transferCallSid: null,
    status: 'initial'
  });

  const resetCallState = () => {
    setCall(null);
    setCallStatus(null); // Changed from 'completed' to null to ensure full reset
    setIsMuted(false);
    setTransferState({
      childCallSid: null,
      transferCallSid: null,
      status: 'initial'
    });
  };

  return {
    call,
    setCall,
    callStatus,
    setCallStatus,
    isMuted,
    setIsMuted,
    transferState,
    setTransferState,
    resetCallState
  };
}