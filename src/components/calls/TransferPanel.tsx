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
      <SheetContent side="right">
        <DialogTitle className="text-lg font-semibold pt-6">Transfer to Support</DialogTitle>
        <div className="flex flex-col gap-4 pt-4" role="dialog" aria-label="Transfer call">
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
  );
}