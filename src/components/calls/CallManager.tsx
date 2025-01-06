import { useState } from 'react';
import { toast } from 'sonner';
import { CallBar } from './CallBar';
import { useCallDevice } from './useCallDevice';
import { useCallState } from './useCallState';
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
      newCall.on('accept', () => setCallStatus('in-progress'));
      newCall.on('disconnect', () => {
        setCallStatus('completed');
        setOriginalCallerHungUp(true);
      });
      newCall.on('error', (error: any) => {
        console.error('Call error:', error);
        setCallStatus('failed');
        toast.error('Call error: ' + error.message);
      });

      newCall.on('info', (info: any) => {
        if (info.CallSid) {
          setOutboundCallSid(info.CallSid);
        }
      });

    } catch (error) {
      console.error('Error making call:', error);
      setCallStatus('failed');
      toast.error('Failed to make call');
    }
  };

  const handleTransfer = async () => {
    if (!device || !call || call.status() !== 'open') {
      toast.error('No active call to transfer');
      return;
    }

    try {
      const conferenceId = `conf_${Date.now()}`;
      
      // Put the original call on hold
      call.mute(true);
      setIsOnHold(true);
      setTransferStatus('connecting');

      // Move the current call to the conference using the edge function
      const { error: moveError } = await supabase.functions.invoke('move-call-to-conference', {
        body: { 
          callSid: outboundCallSid,
          conferenceId 
        }
      });

      if (moveError) {
        throw new Error('Failed to move call to conference: ' + moveError.message);
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

      setTransferCall(newTransferCall);

      newTransferCall.on('accept', () => {
        setTransferStatus('transferred');
        // Original call can now be disconnected as it's in the conference
        if (call) {
          call.disconnect();
        }
      });

      newTransferCall.on('disconnect', () => {
        setTransferCall(null);
        setTransferStatus(undefined);
        if (call && call.status() === 'open' && !originalCallerHungUp) {
          call.mute(false);
          setIsOnHold(false);
        }
      });

      newTransferCall.on('error', (error: any) => {
        console.error('Transfer call error:', error);
        setTransferStatus('failed');
        toast.error('Transfer failed: ' + error.message);
        if (call && call.status() === 'open' && !originalCallerHungUp) {
          call.mute(false);
          setIsOnHold(false);
        }
      });

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
          onTransfer={handleTransfer}
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