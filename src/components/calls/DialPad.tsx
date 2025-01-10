import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyIcon } from "lucide-react";

interface DialPadProps {
  onDigitPress: (digit: string) => void;
}

export function DialPad({ onDigitPress }: DialPadProps) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid grid-cols-3 gap-4 py-4">
          {digits.map((digit) => (
            <Button
              key={digit}
              variant="outline"
              onClick={() => onDigitPress(digit)}
            >
              {digit}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}