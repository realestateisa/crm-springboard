import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CallBarProps {
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
  phoneNumber: string;
  onHangup: () => void;
  onMute: () => void;
  onTransfer: () => void;
  isMuted: boolean;
  transferState: 'initial' | 'connecting' | 'completed';
}

export function CallBar({ 
  status, 
  phoneNumber, 
  onHangup, 
  onMute, 
  onTransfer,
  isMuted,
  transferState
}: CallBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [dialpadOpen, setDialpadOpen] = useState(false);

  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!isVisible) return null;

  const getTransferButtonText = () => {
    switch (transferState) {
      case 'connecting':
        return 'Complete Transfer';
      case 'completed':
        return 'Transfer Complete';
      default:
        return 'Transfer';
    }
  };

  const dialpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out">
      <div className="container max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">{phoneNumber}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-[240px] p-4 bg-background border shadow-lg"
                style={{ zIndex: 100 }}
              >
                <div className="grid grid-cols-3 gap-2">
                  {dialpadButtons.map((row, rowIndex) => (
                    <div key={rowIndex} className="col-span-3 grid grid-cols-3 gap-2">
                      {row.map((digit) => (
                        <Button
                          key={digit}
                          variant="outline"
                          size="sm"
                          className="w-full h-12 text-lg font-medium hover:bg-accent"
                        >
                          {digit}
                        </Button>
                      ))}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-muted-foreground capitalize">
              {status.replace('-', ' ')}
            </span>
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
              <Button
                variant="outline"
                size="sm"
                onClick={onTransfer}
                disabled={transferState === 'completed'}
              >
                {getTransferButtonText()}
              </Button>
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