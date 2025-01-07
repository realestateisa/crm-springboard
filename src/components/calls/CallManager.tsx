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
  const [callStatus, setCallStatus] = useState<'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const setupDevice = async () => {
      try {
        // Get token from our Supabase Edge Function
        const { data: { token }, error } = await supabase.functions.invoke('get-twilio-token');
        
        if (error) throw error;

        // Create new device
        const newDevice = new Device(token, {
          // @ts-ignore - Twilio types are incorrect, but these are valid codec options
          codecPreferences: ['opus', 'pcmu'],
          allowIncomingWhileBusy: false
        });

        await newDevice.register();
        setDevice(newDevice);

        // Setup device event handlers
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
          statusCallback: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/twilio-status-callback`,
          statusCallbackEvent: 'initiated,ringing,answered,completed'
        }
      });

      setCall(newCall);

      // Setup call event handlers
      newCall.on('ringing', () => setCallStatus('ringing'));
      
      newCall.on('accept', () => {
        setCallStatus('in-progress');
        console.log('Parent call connected, SID:', newCall.parameters.CallSid);
      });

      // Monitor for child calls immediately
      console.log('Setting up child call monitoring');
      newCall.children.forEach((childCall: any) => {
        console.log('Existing child call found, SID:', childCall.sid);
        setupChildCallHandlers(childCall);
      });

      newCall.on('childCall', (childCall: any) => {
        console.log('New child call created, SID:', childCall.sid);
        setupChildCallHandlers(childCall);
      });

      newCall.on('disconnect', () => setCallStatus('completed'));
      
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

  const setupChildCallHandlers = (childCall: any) => {
    childCall.on('accept', () => {
      console.log('Child call connected, SID:', childCall.sid);
    });

    childCall.on('disconnect', () => {
      console.log('Child call disconnected, SID:', childCall.sid);
    });

    childCall.on('error', (error: any) => {
      console.error('Child call error:', error);
      toast.error('Transfer error: ' + error.message);
    });
  };

  const handleHangup = () => {
    if (call) {
      call.disconnect();
      setCallStatus('completed');
      setCall(null);
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

  const handleTransfer = () => {
    // TODO: Implement transfer functionality
    toast.info('Transfer functionality coming soon');
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