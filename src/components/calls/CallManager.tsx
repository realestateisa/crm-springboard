import { Device } from '@twilio/voice-sdk';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CallBar } from './CallBar';
import { TwilioCodec, TransferState } from './types';

interface CallManagerProps {
  phoneNumber: string | null;
}

export function CallManager({ phoneNumber }: CallManagerProps) {
  const [device, setDevice] = useState<Device | null>(null);
  const [call, setCall] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [transferState, setTransferState] = useState<TransferState>({
    childCallSid: null,
    transferCallSid: null,
    status: 'initial'
  });

  useEffect(() => {
    const setupDevice = async () => {
      try {
        const { data: { token }, error } = await supabase.functions.invoke('get-twilio-token');
        
        if (error) throw error;

        const newDevice = new Device(token, {
          codecPreferences: ['opus', 'pcmu'],
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

      newCall.on('disconnect', () => {
        setCallStatus('completed');
        setCall(null);
        setTransferState({
          childCallSid: null,
          transferCallSid: null,
          status: 'initial'
        });
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
      setTransferState({
        childCallSid: null,
        transferCallSid: null,
        status: 'initial'
      });
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

  const handleTransfer = async () => {
    if (!call || !transferState.childCallSid) {
      toast.error('No active call to transfer');
      return;
    }

    try {
      if (transferState.status === 'initial') {
        // First click - initiate transfer
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
        // Second click - complete transfer
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