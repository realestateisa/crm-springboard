import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TransferStatus } from './useCallState';

export function useCallTransfer() {
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
      toast.error('Call ID not available');
      return;
    }

    try {
      const conferenceId = `conf_${Date.now()}`;
      const childCallSid = call.parameters.StirIdentity;
      
      console.log('Moving call to conference:', { parentCallSid: outboundCallSid, childCallSid, conferenceId });

      const body = { 
        parentCallSid: outboundCallSid, 
        childCallSid,
        conferenceId 
      };
      console.log('Sending to edge function:', body);

      // Move both calls to the conference using the edge function
      const { data, error } = await supabase.functions.invoke('move-call-to-conference', {
        body
      });

      if (error) {
        throw new Error('Failed to move call to conference: ' + error.message);
      }

      // Put the original call on hold
      call.mute(true);
      setIsOnHold(true);
      setTransferStatus('connecting');

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
    handleTransfer
  };
}