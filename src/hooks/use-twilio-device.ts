import { Device } from '@twilio/voice-sdk';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useTwilioDevice() {
  const [device, setDevice] = useState<Device | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

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
        codecPreferences: ['opus', 'pcmu'],
        maxCallSignalingTimeoutMs: 30000, // Increase timeout
        wsServer: 'wss://voice-js.twilio.com',  // Use primary server
        closeProtection: true, // Prevent accidental disconnects
        enableIceRestart: true, // Allow connection recovery
        maxReconnectAttempts: 3,
        reconnectBackOffMs: 100
      });

      // Register device with error handling
      try {
        await newDevice.register();
        console.log('Device registered successfully');
        setDevice(newDevice);
      } catch (regError) {
        console.error('Error registering device:', regError);
        throw regError;
      }

      // Add error handlers
      newDevice.on('error', (error: any) => {
        console.error('Twilio device error:', error);
        
        // Handle specific error codes
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
      setDevice(null);
    }
  };

  const destroyDevice = () => {
    if (device) {
      try {
        device.destroy();
        setDevice(null);
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
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    setupDevice();
    return () => {
      destroyDevice();
    };
  }, []);

  return { device, resetDevice, isInitializing };
}