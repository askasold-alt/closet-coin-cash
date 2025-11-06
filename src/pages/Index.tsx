import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import Shelf from "@/components/Shelf";
import MoneyBag from "@/components/MoneyBag";
import TransactionDialog from "@/components/TransactionDialog";
import { toast } from "sonner";

const DAILY_BUDGET = 50; // Default daily budget

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [savings, setSavings] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "subtract">("add");
  
  // Initialize budgets for 14 days (2 weeks)
  const [dailyBudgets, setDailyBudgets] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      initial[date.getDate()] = DAILY_BUDGET;
    }
    return initial;
  });

  useEffect(() => {
    // Check for day/month transitions
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
        
        // Reset on first of month
        if (now.getDate() === 1) {
          const newBudgets: Record<number, number> = {};
          for (let i = 0; i < 14; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            newBudgets[date.getDate()] = DAILY_BUDGET;
          }
          setDailyBudgets(newBudgets);
          setSavings(0);
          toast.success("New month started! Budget reset.");
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  const getCurrentWeekJars = () => {
    const jars = [];
    const today = currentDate.getDate();
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayOfMonth = date.getDate();
      
      jars.push({
        dayOfMonth,
        dailyBudget: DAILY_BUDGET,
        remainingAmount: dailyBudgets[dayOfMonth] || DAILY_BUDGET,
        isCurrentDay: dayOfMonth === today,
      });
    }
    return jars;
  };

  const getNextWeekJars = () => {
    const jars = [];
    const dayOfWeek = currentDate.getDay();
    const startOfNextWeek = new Date(currentDate);
    startOfNextWeek.setDate(currentDate.getDate() - dayOfWeek + 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfNextWeek);
      date.setDate(startOfNextWeek.getDate() + i);
      const dayOfMonth = date.getDate();
      
      jars.push({
        dayOfMonth,
        dailyBudget: DAILY_BUDGET,
        remainingAmount: dailyBudgets[dayOfMonth] || DAILY_BUDGET,
      });
    }
    return jars;
  };

  const handleTransaction = (amount: number) => {
    const today = currentDate.getDate();
    
    if (dialogType === "add") {
      setSavings(prev => prev + amount);
      toast.success(`Added $${amount.toFixed(2)} to savings!`);
    } else {
      const remaining = dailyBudgets[today] || DAILY_BUDGET;
      if (amount > remaining) {
        toast.error("Not enough budget for today!");
        return;
      }
      
      setDailyBudgets(prev => ({
        ...prev,
        [today]: remaining - amount,
      }));
      toast.success(`Spent $${amount.toFixed(2)} today`);
    }
  };

  const totalSpent = Object.values(dailyBudgets).reduce(
    (sum, remaining) => sum + (DAILY_BUDGET - remaining),
    0
  );

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-between">
      <div className="w-full max-w-md space-y-4 pt-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-foreground mb-6">
          Budget Closet
        </h1>

        {/* Closet - Upper part */}
        <div className="space-y-6 p-4 bg-card rounded-xl shadow-xl">
          <Shelf jars={getCurrentWeekJars()} label="This Week" />
          <Shelf jars={getNextWeekJars()} label="Next Week" />
        </div>
      </div>

      {/* Floor - Lower part */}
      <div className="w-full max-w-md pb-8">
        <div className="bg-card rounded-xl shadow-xl p-6">
          {/* Bags */}
          <div className="flex justify-center items-end gap-8 mb-6">
            <MoneyBag 
              amount={savings} 
              label="Savings" 
              size="small"
              variant="savings"
            />
            <MoneyBag 
              amount={totalSpent} 
              label="Spent This Month" 
              size="large"
              variant="spent"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="default"
              className="w-16 h-16 rounded-full"
              onClick={() => {
                setDialogType("add");
                setDialogOpen(true);
              }}
            >
              <Plus className="w-6 h-6" />
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="w-16 h-16 rounded-full"
              onClick={() => {
                setDialogType("subtract");
                setDialogOpen(true);
              }}
            >
              <Minus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={dialogType}
        onConfirm={handleTransaction}
      />
    </div>
  );
};

export default Index;
