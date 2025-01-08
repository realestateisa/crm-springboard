import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CallBar } from './CallBar';
import { useTwilioDevice } from '@/hooks/use-twilio-device';
import { useCallState } from './CallState';

interface CallManagerProps {
  phoneNumber: string | null;
}

export function CallManager({ phoneNumber }: CallManagerProps) {
  const { device, resetDevice } = useTwilioDevice();
  const {
    call,
    setCall,
    callStatus,
    setCallStatus,
    isMuted,
    setIsMuted,
    transferState,
    setTransferState,
    resetCallState
  } = useCallState();

  const handleCall = async () => {
    if (!device || !phoneNumber) return;

    try {
      setCallStatus('queued');
      
      const newCall = await device.connect({
        params: {
          To: phoneNumber,
        }
      });

      setCall(newCall);

      // Setup call event handlers
      newCall.on('ringing', () => setCallStatus('ringing'));
      
      newCall.on('accept', async () => {
        setCallStatus('in-progress');
        console.log('Call accepted, parent call SID:', newCall.parameters.CallSid);
        
        try {
          const { data: childCalls, error } = await supabase.functions.invoke('get-child-calls', {
            body: { parentCallSid: newCall.parameters.CallSid }
          });
          
          if (error) throw error;
          
          if (childCalls && childCalls.length > 0) {
            const childCallSid = childCalls[0].sid;
            console.log('Found child call SID:', childCallSid);
            setTransferState(prev => ({
              ...prev,
              childCallSid
            }));
          }
        } catch (error) {
          console.error('Error fetching child calls:', error);
        }
      });

      newCall.on('disconnect', async () => {
        resetCallState();
        await resetDevice();
      });

      newCall.on('error', (error: any) => {
        console.error('Call error:', error);
        setCallStatus('failed');
        toast.error('Call error: ' + error.message);
      });

    } catch (error) {
      console.error('Error making call:', error);
      setCallStatus('failed');
      toast.error('Failed to make call');
    }
  };

  const handleHangup = async () => {
    if (call) {
      call.disconnect();
      resetCallState();
      await resetDevice();
    }
  };

  const handleMute = () => {
    if (call) {
      if (isMuted) {
        call.mute(false);
      } else {
        call.mute(true);
      }
      setIsMuted(!isMuted);
    }
  };

  const handleDigitPress = (digit: string) => {
    if (call && callStatus === 'in-progress') {
      call.sendDigits(digit);
    }
  };

  const handleTransfer = async () => {
    if (!call || !transferState.childCallSid) {
      toast.error('No active call to transfer');
      return;
    }

    try {
      if (transferState.status === 'initial') {
        const { data, error } = await supabase.functions.invoke('transfer-call', {
          body: {
            action: 'initiate',
            childCallSid: transferState.childCallSid,
            parentCallSid: call.parameters.CallSid
          }
        });

        if (error) throw error;

        setTransferState(prev => ({
          ...prev,
          transferCallSid: data.transferCallSid,
          status: 'connecting'
        }));

        toast.success('Transfer initiated - click again to complete transfer');

      } else if (transferState.status === 'connecting') {
        const { error } = await supabase.functions.invoke('transfer-call', {
          body: {
            action: 'complete',
            childCallSid: transferState.childCallSid,
            parentCallSid: call.parameters.CallSid
          }
        });

        if (error) throw error;

        setTransferState(prev => ({
          ...prev,
          status: 'completed'
        }));

        toast.success('Transfer completed');
        handleHangup();
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Transfer failed: ' + error.message);
    }
  };

  useEffect(() => {
    const handleInitiateCall = () => {
      if (!device || !phoneNumber || callStatus !== null) return;
      handleCall();
    };

    window.addEventListener('initiate-call', handleInitiateCall);
    return () => {
      window.removeEventListener('initiate-call', handleInitiateCall);
    };
  }, [device, phoneNumber, callStatus]);

  return (
    <>
      {callStatus && (
        <CallBar
          status={callStatus}
          phoneNumber={phoneNumber || ''}
          onHangup={handleHangup}
          onMute={handleMute}
          onTransfer={handleTransfer}
          isMuted={isMuted}
          transferState={transferState.status}
          onDigitPress={handleDigitPress}
        />
      )}
    </>
  );
}