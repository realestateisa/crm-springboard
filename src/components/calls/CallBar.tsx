import { useState, useEffect } from 'react';
import { Phone } from "lucide-react";
import { CallControls } from './CallControls';
import { TransferPanel } from './TransferPanel';

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
            <CallControls
              onHangup={onHangup}
              onMute={onMute}
              isMuted={isMuted}
              status={status}
            />
            
            {status === 'in-progress' && (
              <TransferPanel
                onTransfer={onTransfer}
                transferStatus={transferStatus}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}