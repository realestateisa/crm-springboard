import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, PhoneForwarded } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from '@/components/ui/dialog';

interface CallBarProps {
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
  phoneNumber: string;
  onHangup: () => void;
  onMute: () => void;
  onTransfer: () => void;
  isMuted: boolean;
  transferStatus?: 'connecting' | 'transferred' | 'failed';
  isOnHold?: boolean;
  originalCallerHungUp?: boolean;
}

export function CallBar({ 
  status, 
  phoneNumber, 
  onHangup, 
  onMute, 
  onTransfer,
  isMuted,
  transferStatus,
  isOnHold,
  originalCallerHungUp
}: CallBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out">
      <div className="container max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">
                {phoneNumber}
              </span>
            </div>
            <span className="text-sm text-muted-foreground capitalize">
              {status.replace('-', ' ')}
            </span>
            {isOnHold && (
              <span className="text-sm text-yellow-500">
                On Hold
              </span>
            )}
            {originalCallerHungUp && (
              <span className="text-sm text-red-500">
                Original caller hung up
              </span>
            )}
            {transferStatus && (
              <span className={`text-sm ${
                transferStatus === 'failed' ? 'text-red-500' : 
                transferStatus === 'transferred' ? 'text-green-500' : 
                'text-blue-500'
              }`}>
                Transfer: {transferStatus}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMute}
              className={isMuted ? 'text-destructive' : ''}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            {status === 'in-progress' && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <PhoneForwarded className="h-4 w-4" />
                    Transfer
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <DialogTitle className="text-lg font-semibold pt-6">Transfer to Support</DialogTitle>
                  <div className="flex flex-col gap-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Transfer number: (210) 664-3493
                    </p>
                    <Button 
                      onClick={onTransfer}
                      className="w-full"
                      disabled={transferStatus === 'connecting' || transferStatus === 'transferred'}
                    >
                      {transferStatus === 'connecting' ? 'Connecting...' : 'Start Transfer'}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <Button
              variant="destructive"
              size="sm"
              onClick={onHangup}
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              Hang Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}