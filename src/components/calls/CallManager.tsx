import { useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import { CallBar } from "./CallBar";
import { useToast } from "@/hooks/use-toast";

interface CallManagerProps {
  device: Device | null;
  isReady: boolean;
  activeCall: any | null;
  onCallAccepted: () => void;
  onCallEnded: () => void;
}

export const CallManager = ({
  device,
  isReady,
  activeCall,
  onCallAccepted,
  onCallEnded,
}: CallManagerProps) => {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [selectedCodecs, setSelectedCodecs] = useState<string[]>([]);

  useEffect(() => {
    if (device) {
      const audioHelper = device.audio;
      if (audioHelper) {
        setSelectedCodecs(audioHelper.availableCodecs);
      }
    }
  }, [device]);

  const handleMuteToggle = () => {
    if (activeCall) {
      setIsMuted(!isMuted);
      activeCall.mute(!isMuted);
      toast({
        title: isMuted ? "Unmuted" : "Muted",
        description: `You are now ${isMuted ? "unmuted" : "muted"}.`,
      });
    }
  };

  const handleHoldToggle = () => {
    if (activeCall) {
      setIsHeld(!isHeld);
      if (isHeld) {
        activeCall.unhold();
        toast({ title: "Call resumed" });
      } else {
        activeCall.hold();
        toast({ title: "Call on hold" });
      }
    }
  };

  const handleHangup = () => {
    if (activeCall) {
      activeCall.disconnect();
      onCallEnded();
      toast({ title: "Call ended" });
    }
  };

  const handleAccept = () => {
    onCallAccepted();
    toast({ title: "Call accepted" });
  };

  return (
    <CallBar
      activeCall={activeCall}
      isMuted={isMuted}
      isHeld={isHeld}
      onMuteToggle={handleMuteToggle}
      onHoldToggle={handleHoldToggle}
      onHangup={handleHangup}
      onAccept={handleAccept}
    />
  );
};