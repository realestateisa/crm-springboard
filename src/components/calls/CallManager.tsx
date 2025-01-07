import { Device, Call } from '@twilio/voice-sdk';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CallBar } from './CallBar';

interface CallManagerProps {
  phoneNumber: string | null;
}

// Define interface for Twilio Call
interface TwilioCall extends Call {
  parameters: {
    CallSid: string;
  };
}

export function CallManager({ phoneNumber }: CallManagerProps) {
  const [device, setDevice] = useState<Device | null>(null);
  const [call, setCall] = useState<TwilioCall | null>(null);
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
      }) as TwilioCall;

      setCall(newCall);

      // Setup call event handlers
      newCall.on('ringing', () => setCallStatus('ringing'));
      
      newCall.on('accept', () => {
        setCallStatus('in-progress');
        console.log('Parent call connected, SID:', newCall.parameters.CallSid);
        // Get child calls through Edge Function
        monitorChildCalls(newCall.parameters.CallSid);
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

  const monitorChildCalls = async (parentCallSid: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-child-calls', {
        body: { parentCallSid }
      });

      if (error) throw error;

      // Setup handlers for each child call
      if (data.childCalls) {
        data.childCalls.forEach((childCall: any) => {
          console.log('Child call found, SID:', childCall.sid);
          setupChildCallHandlers(childCall.sid);
        });
      }

      // Poll for new child calls every few seconds
      const pollInterval = setInterval(async () => {
        const { data: newData, error: newError } = await supabase.functions.invoke('get-child-calls', {
          body: { parentCallSid }
        });

        if (newError) {
          console.error('Error polling child calls:', newError);
          return;
        }

        if (newData.childCalls) {
          newData.childCalls.forEach((childCall: any) => {
            console.log('New child call detected, SID:', childCall.sid);
            setupChildCallHandlers(childCall.sid);
          });
        }
      }, 5000);

      // Cleanup interval on disconnect
      if (call) {
        call.on('disconnect', () => clearInterval(pollInterval));
      }

    } catch (error) {
      console.error('Error monitoring child calls:', error);
    }
  };

  const setupChildCallHandlers = (childCallSid: string) => {
    console.log('Setting up handlers for child call:', childCallSid);
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