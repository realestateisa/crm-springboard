import { useState } from 'react';
import { toast } from 'sonner';
import { CallBar } from './CallBar';
import { useCallDevice } from './useCallDevice';
import { useCallState } from './useCallState';
import { useCallTransfer } from './useCallTransfer';
import { supabase } from '@/integrations/supabase/client';

interface CallManagerProps {
  phoneNumber: string | null;
}

export function CallManager({ phoneNumber }: CallManagerProps) {
  const device = useCallDevice();
  const [call, setCall] = useState<any>(null);
  const [transferCall, setTransferCall] = useState<any>(null);
  const {
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
  } = useCallState();

  const { handleTransfer } = useCallTransfer();

  const handleCall = async () => {
    if (!device || !phoneNumber) return;

    try {
      setCallStatus('queued');
      
      const newCall = await device.connect({
        params: {
          To: phoneNumber,
          statusCallback: '/call-status',
        }
      });

      setCall(newCall);

      newCall.on('ringing', () => setCallStatus('ringing'));
      newCall.on('accept', () => {
        setCallStatus('in-progress');
        console.log('Call connected with CallSid:', newCall.parameters.CallSid);
        setOutboundCallSid(newCall.parameters.CallSid);
      });
      newCall.on('disconnect', () => {
        setCallStatus('completed');
        setOriginalCallerHungUp(true);
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

  const initiateTransfer = async () => {
    await handleTransfer(
      device,
      call,
      outboundCallSid,
      setTransferStatus,
      setIsOnHold,
      originalCallerHungUp
    );
  };

  const handleHangup = () => {
    if (call) {
      call.disconnect();
      setCallStatus('completed');
      setCall(null);
    }
    if (transferCall) {
      transferCall.disconnect();
      setTransferCall(null);
      setTransferStatus(undefined);
    }
    setIsOnHold(false);
    setOriginalCallerHungUp(false);
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

  return (
    <>
      {callStatus && (
        <CallBar
          status={callStatus}
          phoneNumber={phoneNumber || ''}
          onHangup={handleHangup}
          onMute={handleMute}
          onTransfer={initiateTransfer}
          isMuted={isMuted}
          transferStatus={transferStatus}
          isOnHold={isOnHold}
          originalCallerHungUp={originalCallerHungUp}
        />
      )}
      <button
        onClick={handleCall}
        disabled={!device || !phoneNumber || callStatus !== null}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Call
      </button>
    </>
  );
}