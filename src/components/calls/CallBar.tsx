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
  onDigitPress?: (digit: string) => void;
}

export function CallBar({ 
  status, 
  phoneNumber, 
  onHangup, 
  onMute, 
  onTransfer,
  isMuted,
  transferState,
  onDigitPress
}: CallBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [dialpadOpen, setDialpadOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsExiting(false);
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

  const handleDigitPress = (digit: string) => {
    if (onDigitPress) {
      onDigitPress(digit);
      setDialpadOpen(true);
    }
  };

  const dialpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <div 
      className={`absolute top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out transform call-bar ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">{phoneNumber}</span>
            </Button>
            <span className="text-sm text-muted-foreground capitalize">
              {status.replace('-', ' ')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu open={dialpadOpen} onOpenChange={setDialpadOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-[240px] p-4 bg-background border shadow-lg -translate-x-16"
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
                          onClick={() => handleDigitPress(digit)}
                          disabled={status !== 'in-progress'}
                        >
                          {digit}
                        </Button>
                      ))}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

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