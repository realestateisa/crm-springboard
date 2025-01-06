import { Device } from '@twilio/voice-sdk';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useCallDevice() {
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const setupDevice = async () => {
      try {
        const { data: { token }, error } = await supabase.functions.invoke('get-twilio-token');
        
        if (error) throw error;

        const newDevice = new Device(token, {
          codecPreferences: ['opus', 'pcmu'] as any,
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

  return device;
}