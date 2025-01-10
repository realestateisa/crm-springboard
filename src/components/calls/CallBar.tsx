import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, Users, Type } from "lucide-react";
import { CallStatus } from "./types";
import { DialPad } from "./DialPad";

interface CallBarProps {
  status: CallStatus;
  phoneNumber: string;
  onHangup: () => void;
  onMute: () => void;
  onTransfer: () => void;
  onTranscribe: () => void;
  isMuted: boolean;
  isTranscribing: boolean;
  transferState: 'initial' | 'connecting' | 'completed';
  onDigitPress: (digit: string) => void;
}

export function CallBar({
  status,
  phoneNumber,
  onHangup,
  onMute,
  onTransfer,
  onTranscribe,
  isMuted,
  isTranscribing,
  transferState,
  onDigitPress,
}: CallBarProps) {
  return (
    <div className="fixed top-16 inset-x-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {status === "in-progress" ? "Connected" : status}
          </span>
          <span className="text-sm text-muted-foreground">{phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="sm"
            onClick={onMute}
          >
            {isMuted ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant={isTranscribing ? "default" : "outline"}
            size="sm"
            onClick={onTranscribe}
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onTransfer}
            disabled={transferState === "completed"}
          >
            <Users className="h-4 w-4" />
          </Button>
          <DialPad onDigitPress={onDigitPress} />
          <Button variant="destructive" size="sm" onClick={onHangup}>
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}