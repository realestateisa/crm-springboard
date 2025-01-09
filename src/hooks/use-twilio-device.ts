import { Device } from '@twilio/voice-sdk';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useTwilioDevice() {
  const [device, setDevice] = useState<Device | null>(null);

  const setupDevice = async () => {
    try {
      const { data: { token }, error } = await supabase.functions.invoke('get-twilio-token');
      
      if (error) throw error;

      const newDevice = new Device(token, {
        codecPreferences: ['opus', 'pcmu'],
        allowIncomingWhileBusy: false,
        playRingtone: false,
        sounds: {
          incoming: '',    // Empty string disables the sound
          outgoing: '',    // Empty string disables the sound
          disconnect: ''   // Empty string disables the sound
        }
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

  const destroyDevice = () => {
    if (device) {
      device.destroy();
      setDevice(null);
    }
  };

  const resetDevice = async () => {
    destroyDevice();
    await setupDevice();
  };

  useEffect(() => {
    setupDevice();
    return () => {
      destroyDevice();
    };
  }, []);

  return { device, resetDevice };
}