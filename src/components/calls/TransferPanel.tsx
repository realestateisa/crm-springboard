import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from '@/components/ui/dialog';
import { PhoneForwarded } from "lucide-react";

interface TransferPanelProps {
  onTransfer: () => void;
  transferStatus?: 'connecting' | 'transferred' | 'failed';
}

export function TransferPanel({ onTransfer, transferStatus }: TransferPanelProps) {
  return (
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
      <SheetContent 
        side="right"
        aria-label="Transfer Call Panel"
        aria-describedby="transfer-description"
      >
        <DialogTitle className="text-lg font-semibold pt-6">Transfer to Support</DialogTitle>
        <p id="transfer-description" className="text-sm text-muted-foreground pt-4">
          Transfer number: (210) 664-3493
        </p>
        <div className="flex flex-col gap-4 pt-4" role="dialog" aria-label="Transfer Controls">
          <Button 
            onClick={onTransfer}
            className="w-full"
            disabled={transferStatus === 'connecting' || transferStatus === 'transferred'}
            aria-label={transferStatus === 'connecting' ? 'Connecting transfer' : 'Start transfer'}
          >
            {transferStatus === 'connecting' ? 'Connecting...' : 'Start Transfer'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}