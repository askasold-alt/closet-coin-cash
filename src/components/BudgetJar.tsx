import { cn } from "@/lib/utils";

interface BudgetJarProps {
  dayOfMonth: number;
  dailyBudget: number;
  remainingAmount: number;
  isCurrentDay?: boolean;
}

const BudgetJar = ({ dayOfMonth, dailyBudget, remainingAmount, isCurrentDay }: BudgetJarProps) => {
  const fillPercentage = (remainingAmount / dailyBudget) * 100;
  const coinsCount = Math.floor(fillPercentage / 10);

  return (
    <div className="flex flex-col items-center gap-1 animate-fade-in">
      {/* Jar */}
      <div className={cn(
        "relative w-14 h-20 rounded-t-lg rounded-b-2xl jar-glass overflow-hidden transition-all duration-300",
        isCurrentDay && "ring-2 ring-accent shadow-lg"
      )}>
        {/* Jar lid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-2 rounded-t-lg wood-texture" />
        
        {/* Coins */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center items-end p-1 gap-0.5"
             style={{ height: `${fillPercentage}%` }}>
          {Array.from({ length: Math.min(coinsCount, 15) }).map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-2 rounded-full coin animate-scale-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
        
        {/* Amount label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-foreground bg-background/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
          ${remainingAmount.toFixed(0)}
        </div>
      </div>
      
      {/* Day label */}
      <div className={cn(
        "text-xs font-medium text-muted-foreground",
        isCurrentDay && "text-accent font-bold"
      )}>
        {dayOfMonth}
      </div>
    </div>
  );
};

export default BudgetJar;
