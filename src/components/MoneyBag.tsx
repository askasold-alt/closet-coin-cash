import { cn } from "@/lib/utils";

interface MoneyBagProps {
  amount: number;
  label: string;
  size?: "small" | "large";
  variant?: "savings" | "spent";
}

const MoneyBag = ({ amount, label, size = "large", variant = "savings" }: MoneyBagProps) => {
  const sizeClasses = size === "large" ? "w-24 h-28" : "w-20 h-24";
  
  return (
    <div className="flex flex-col items-center gap-2 animate-scale-in">
      {/* Bag */}
      <div className={cn(
        "relative rounded-b-3xl rounded-t-lg bag-texture transition-transform hover:scale-105",
        sizeClasses,
        variant === "spent" && "opacity-80"
      )}>
        {/* Bag tie/knot */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 rounded-t-full wood-texture" />
        
        {/* Bag shine */}
        <div className="absolute top-4 left-4 w-6 h-8 bg-white/20 rounded-full blur-sm" />
        
        {/* Amount */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-lg font-bold text-accent drop-shadow-lg">
            ${amount.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-xs font-medium text-muted-foreground">
        {label}
      </div>
    </div>
  );
};

export default MoneyBag;
