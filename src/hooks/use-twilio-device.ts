import { Device } from '@twilio/voice-sdk';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useTwilioDevice() {
  const [device, setDevice] = useState<Device | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const mountedRef = useRef(true);

  const setupDevice = async () => {
    try {
      const { data: { token }, error } = await supabase.functions.invoke('get-twilio-token');
      
      if (error) {
        console.error('Error getting Twilio token:', error);
        throw error;
      }

      if (!token) {
        throw new Error('No token received from server');
      }

      // Destroy existing device if any
      if (device) {
        device.destroy();
      }

      // Configure new device with more conservative settings
      const newDevice = new Device(token, {
        codecPreferences: ['opus', 'pcmu'] as ('opus' | 'pcmu')[],
        maxCallSignalingTimeoutMs: 30000,
        closeProtection: true,
        reconnectBackOffMs: 100
      });

      // Register device with error handling
      try {
        await newDevice.register();
        console.log('Device registered successfully');
        if (mountedRef.current) {
          setDevice(newDevice);
        }
      } catch (regError) {
        console.error('Error registering device:', regError);
        throw regError;
      }

      // Add error handlers
      newDevice.on('error', (error: any) => {
        console.error('Twilio device error:', error);
        
        if (error.code === 31005) {
          toast.error('Connection error. Please try again.');
          resetDevice();
        } else if (error.code === 31000) {
          toast.error('Device error. Attempting to reconnect...');
          resetDevice();
        }
      });

    } catch (error) {
      console.error('Error setting up Twilio device:', error);
      toast.error('Failed to setup call device. Please try again.');
      if (mountedRef.current) {
        setDevice(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsInitializing(false);
      }
    }
  };

  const destroyDevice = () => {
    if (device) {
      try {
        device.destroy();
        if (mountedRef.current) {
          setDevice(null);
        }
      } catch (error) {
        console.error('Error destroying device:', error);
      }
    }
  };

  const resetDevice = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    try {
      destroyDevice();
      await setupDevice();
    } catch (error) {
      console.error('Error resetting device:', error);
      toast.error('Failed to reset device. Please refresh the page.');
    } finally {
      if (mountedRef.current) {
        setIsInitializing(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    setupDevice();
    
    return () => {
      mountedRef.current = false;
      destroyDevice();
    };
  }, []);

  return { device, resetDevice, isInitializing };
}