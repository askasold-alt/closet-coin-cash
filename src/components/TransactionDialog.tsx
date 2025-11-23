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
  onConfirm: (amount: number, spendAmount?: number, saveAmount?: number) => void;
}

const TransactionDialog = ({ open, onOpenChange, type, onConfirm }: TransactionDialogProps) => {
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountToSpend, setAmountToSpend] = useState("");
  const [amountToSave, setAmountToSave] = useState("");

  const handleConfirm = () => {
    if (type === "add") {
      const numTotal = parseFloat(totalAmount);
      const numSpend = parseFloat(amountToSpend);
      const numSave = parseFloat(amountToSave);
      
      if (!isNaN(numTotal) && numTotal > 0 && !isNaN(numSpend) && numSpend >= 0 && !isNaN(numSave) && numSave >= 0) {
        onConfirm(numTotal, numSpend, numSave);
        setTotalAmount("");
        setAmountToSpend("");
        setAmountToSave("");
        onOpenChange(false);
      }
    } else {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount) && numAmount > 0) {
        onConfirm(numAmount);
        setAmount("");
        onOpenChange(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  const handleTotalChange = (value: string) => {
    setTotalAmount(value);
    const total = parseFloat(value) || 0;
    const spend = parseFloat(amountToSpend) || 0;
    if (spend > 0) {
      setAmountToSave((total - spend).toFixed(2));
    }
  };

  const handleSpendChange = (value: string) => {
    setAmountToSpend(value);
    const total = parseFloat(totalAmount) || 0;
    const spend = parseFloat(value) || 0;
    setAmountToSave((total - spend).toFixed(2));
  };

  const handleSaveChange = (value: string) => {
    setAmountToSave(value);
    const total = parseFloat(totalAmount) || 0;
    const save = parseFloat(value) || 0;
    setAmountToSpend((total - save).toFixed(2));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {type === "add" ? "Add Money" : type === "subtract" ? "Record Spending" : "Distribute from Savings"}
          </DialogTitle>
          <DialogDescription>
            {type === "add" 
              ? "Split your money between spending and savings" 
              : type === "subtract"
              ? "Enter the amount you spent today"
              : "Enter the amount to distribute from savings to remaining days of the month"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {type === "add" ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="totalAmount">Total amount ($)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={totalAmount}
                  onChange={(e) => handleTotalChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amountToSpend">Amount to spend ($)</Label>
                <Input
                  id="amountToSpend"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amountToSpend}
                  onChange={(e) => handleSpendChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amountToSave">Amount to save ($)</Label>
                <Input
                  id="amountToSave"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amountToSave}
                  onChange={(e) => handleSaveChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </>
          ) : (
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
          )}
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={type === "add" 
              ? !totalAmount || parseFloat(totalAmount) <= 0 || !amountToSpend || !amountToSave
              : !amount || parseFloat(amount) <= 0
            }
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
