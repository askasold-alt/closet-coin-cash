import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "add" | "subtract" | "distribute";
  onConfirm: (amount: number) => void;
}

const TransactionDialog = ({ open, onOpenChange, type, onConfirm }: TransactionDialogProps) => {
  const [amount, setAmount] = useState("");

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      onConfirm(numAmount);
      setAmount("");
      onOpenChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {type === "add" ? "Add to Savings" : type === "subtract" ? "Record Spending" : "Distribute from Savings"}
          </DialogTitle>
          <DialogDescription>
            {type === "add" 
              ? "Enter the amount you want to add to your savings bag" 
              : type === "subtract"
              ? "Enter the amount you spent today"
              : "Enter the amount to distribute from savings to remaining days of the month"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!amount || parseFloat(amount) <= 0}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
