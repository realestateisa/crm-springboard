import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CallBar } from './CallBar';
import { useTwilioDevice } from '@/hooks/use-twilio-device';
import { useCallState } from './CallState';
import { TranscriptionWindow } from './TranscriptionWindow';

interface CallManagerProps {
  phoneNumber: string | null;
}

export function CallManager({ phoneNumber }: CallManagerProps) {
  const { device, resetDevice } = useTwilioDevice();
  const {
    call,
    setCall,
    callStatus,
    setCallStatus,
    isMuted,
    setIsMuted,
    transferState,
    setTransferState,
    resetCallState
  } = useCallState();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const handleInitiateCall = () => {
      console.log('Call initiation triggered', { phoneNumber });
      if (phoneNumber) {
        handleCall();
      }
    };

    window.addEventListener('initiate-call', handleInitiateCall);
    return () => {
      window.removeEventListener('initiate-call', handleInitiateCall);
    };
  }, [phoneNumber]);

  const handleCall = async () => {
    if (!device || !phoneNumber) {
      console.log('Cannot make call - device or phone number missing', { device, phoneNumber });
      return;
    }

    try {
      console.log('Initiating call to:', phoneNumber);
      setCallStatus('queued');
      
      const newCall = await device.connect({
        params: {
          To: phoneNumber,
        }
      });

      console.log('Call connected:', newCall);
      setCall(newCall);

      // Setup call event handlers
      newCall.on('ringing', () => {
        console.log('Call ringing');
        setCallStatus('ringing');
      });
      
      newCall.on('accept', async () => {
        console.log('Call accepted');
        setCallStatus('in-progress');
        console.log('Parent call SID:', newCall.parameters.CallSid);
        
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

      newCall.on('disconnect', async () => {
        console.log('Call disconnected, cleaning up...');
        resetCallState();
        await resetDevice();
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

  const handleHangup = async () => {
    if (call) {
      call.disconnect();
      resetCallState();
      await resetDevice();
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

  const handleDigitPress = (digit: string) => {
    if (call && callStatus === 'in-progress') {
      call.sendDigits(digit);
    }
  };

  const handleTranscribe = () => {
    setIsTranscribing(!isTranscribing);
  };

  const handleTransfer = async () => {
    if (!call || !transferState.childCallSid) return;

    try {
      if (transferState.status === 'initial') {
        const { data, error } = await supabase.functions.invoke('transfer-call', {
          body: { 
            childCallSid: transferState.childCallSid,
            action: 'initiate',
            parentCallSid: call.parameters.CallSid
          }
        });

        if (error) throw error;
        
        setTransferState(prev => ({
          ...prev,
          transferCallSid: data.transferCallSid,
          status: 'connecting'
        }));
      } else if (transferState.status === 'connecting') {
        const { error } = await supabase.functions.invoke('transfer-call', {
          body: { 
            childCallSid: transferState.childCallSid,
            action: 'complete',
            parentCallSid: call.parameters.CallSid
          }
        });

        if (error) throw error;

        setTransferState(prev => ({
          ...prev,
          status: 'completed'
        }));
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Failed to transfer call');
    }
  };

  useEffect(() => {
    if (call && callStatus === 'in-progress') {
      // Get the audio stream from the call
      const stream = new MediaStream();
      const audioTracks = call.getRemoteAudioTracks();
      audioTracks.forEach(track => stream.addTrack(track));
      setAudioStream(stream);
    } else {
      setAudioStream(null);
    }
  }, [call, callStatus]);

  return (
    <>
      {callStatus && (
        <>
          <CallBar
            status={callStatus}
            phoneNumber={phoneNumber || ''}
            onHangup={handleHangup}
            onMute={handleMute}
            onTransfer={handleTransfer}
            onTranscribe={handleTranscribe}
            isMuted={isMuted}
            isTranscribing={isTranscribing}
            transferState={transferState.status}
            onDigitPress={handleDigitPress}
          />
          <TranscriptionWindow 
            audioStream={audioStream}
            isVisible={isTranscribing}
          />
        </>
      )}
    </>
  );
}