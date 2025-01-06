import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TransferStatus } from './useCallState';

export function useCallTransfer() {
  const [isWaitingForCallSid, setIsWaitingForCallSid] = useState(false);

  const handleTransfer = async (
    device: any,
    call: any,
    outboundCallSid: string | null,
    setTransferStatus: (status: TransferStatus) => void,
    setIsOnHold: (isOnHold: boolean) => void,
    originalCallerHungUp: boolean
  ) => {
    if (!device || !call || call.status() !== 'open') {
      toast.error('No active call to transfer');
      return;
    }

    if (!outboundCallSid) {
      if (!isWaitingForCallSid) {
        setIsWaitingForCallSid(true);
        toast.error('Call ID not available yet. Please wait a moment and try again.');
      }
      return;
    }

    try {
      const conferenceId = `conf_${Date.now()}`;
      
      // Put the original call on hold
      call.mute(true);
      setIsOnHold(true);
      setTransferStatus('connecting');

      console.log('Moving call to conference:', { callSid: outboundCallSid, conferenceId });

      // Move the current call to the conference using the edge function
      const { data, error } = await supabase.functions.invoke('move-call-to-conference', {
        body: { 
          callSid: outboundCallSid,
          conferenceId 
        }
      });

      if (error) {
        throw new Error('Failed to move call to conference: ' + error.message);
      }

      // Make the transfer call
      const newTransferCall = await device.connect({
        params: {
          To: '12106643493',
          ConferenceName: conferenceId,
          StartConferenceOnEnter: 'true',
          EndConferenceOnExit: 'false'
        }
      });

      handleTransferCallEvents(
        newTransferCall,
        call,
        setTransferStatus,
        setIsOnHold,
        originalCallerHungUp
      );

    } catch (error) {
      console.error('Error making transfer:', error);
      setTransferStatus('failed');
      toast.error('Failed to initiate transfer');
      if (call && call.status() === 'open' && !originalCallerHungUp) {
        call.mute(false);
        setIsOnHold(false);
      }
    }
  };

  const handleTransferCallEvents = (
    transferCall: any,
    originalCall: any,
    setTransferStatus: (status: TransferStatus) => void,
    setIsOnHold: (isOnHold: boolean) => void,
    originalCallerHungUp: boolean
  ) => {
    transferCall.on('accept', () => {
      setTransferStatus('transferred');
    });

    transferCall.on('disconnect', () => {
      setTransferStatus(undefined);
      if (originalCall && originalCall.status() === 'open' && !originalCallerHungUp) {
        originalCall.mute(false);
        setIsOnHold(false);
      }
    });

    transferCall.on('error', (error: any) => {
      console.error('Transfer call error:', error);
      setTransferStatus('failed');
      toast.error('Transfer failed: ' + error.message);
      if (originalCall && originalCall.status() === 'open' && !originalCallerHungUp) {
        originalCall.mute(false);
        setIsOnHold(false);
      }
    });
  };

  return {
    handleTransfer,
    isWaitingForCallSid
  };
}