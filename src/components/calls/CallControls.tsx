import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";

interface CallControlsProps {
  onHangup: () => void;
  onMute: () => void;
  isMuted: boolean;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
}

export function CallControls({ onHangup, onMute, isMuted, status }: CallControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onMute}
        className={isMuted ? 'text-destructive' : ''}
      >
        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={onHangup}
      >
        <PhoneOff className="h-4 w-4 mr-2" />
        Hang Up
      </Button>
    </div>
  );
}