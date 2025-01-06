import { Device } from '@twilio/voice-sdk';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CallBar } from './CallBar';

interface CallManagerProps {
  phoneNumber: string | null;
}

export function CallManager({ phoneNumber }: CallManagerProps) {
  const [device, setDevice] = useState<Device | null>(null);
  const [call, setCall] = useState<any>(null);
  const [transferCall, setTransferCall] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | null>(null);
  const [transferStatus, setTransferStatus] = useState<'connecting' | 'transferred' | 'failed' | undefined>();
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [originalCallerHungUp, setOriginalCallerHungUp] = useState(false);

  useEffect(() => {
    const setupDevice = async () => {
      try {
        const { data: { token }, error } = await supabase.functions.invoke('get-twilio-token');
        
        if (error) throw error;

        const newDevice = new Device(token, {
          codecPreferences: ['opus', 'pcmu'] as ['opus', 'pcmu'],
          allowIncomingWhileBusy: false
        });

        await newDevice.register();
        setDevice(newDevice);

        newDevice.on('error', (error: any) => {
          console.error('Twilio device error:', error);
          toast.error('Call error: ' + error.message);
        });

      } catch (error) {
        console.error('Error setting up Twilio device:', error);
        toast.error('Failed to setup call device');
      }
    };

    setupDevice();

    return () => {
      if (device) {
        device.destroy();
      }
    };
  }, []);

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

    } catch (error) {
      console.error('Error making call:', error);
      setCallStatus('failed');
      toast.error('Failed to make call');
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

  const handleTransfer = async () => {
    if (!device || !call) return;
    
    try {
      // Put the original call on hold
      if (call.status() === 'open') {
        call.mute(true);
        setIsOnHold(true);
      }

      setTransferStatus('connecting');
      
      // Make the transfer call
      const newTransferCall = await device.connect({
        params: {
          To: '12106643493',
        }
      });

      setTransferCall(newTransferCall);

      newTransferCall.on('ringing', () => setTransferStatus('connecting'));
      newTransferCall.on('accept', () => setTransferStatus('transferred'));
      newTransferCall.on('disconnect', () => {
        setTransferCall(null);
        setTransferStatus(undefined);
        // If the transfer call ends, unmute the original call
        if (call && call.status() === 'open' && !originalCallerHungUp) {
          call.mute(false);
          setIsOnHold(false);
        }
      });
      newTransferCall.on('error', (error: any) => {
        console.error('Transfer call error:', error);
        setTransferStatus('failed');
        toast.error('Transfer failed: ' + error.message);
        // If transfer fails, unmute the original call
        if (call && call.status() === 'open' && !originalCallerHungUp) {
          call.mute(false);
          setIsOnHold(false);
        }
      });

    } catch (error) {
      console.error('Error making transfer:', error);
      setTransferStatus('failed');
      toast.error('Failed to initiate transfer');
      // If transfer fails, unmute the original call
      if (call && call.status() === 'open' && !originalCallerHungUp) {
        call.mute(false);
        setIsOnHold(false);
      }
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
