import BudgetJar from "./BudgetJar";

interface ShelfProps {
  jars: Array<{
    dayOfMonth: number;
    dailyBudget: number;
    remainingAmount: number;
    isCurrentDay?: boolean;
  }>;
  label: string;
}

const Shelf = ({ jars, label }: ShelfProps) => {
  return (
    <div className="relative animate-fade-in">
      {/* Shelf label */}
      <div className="text-xs font-semibold text-muted-foreground mb-2 text-center">
        {label}
      </div>
      
      {/* Shelf surface */}
      <div className="wood-texture rounded-lg p-3 shadow-lg">
        <div className="flex justify-around items-end gap-1">
          {jars.map((jar, index) => (
            <BudgetJar key={index} {...jar} />
          ))}
        </div>
      </div>
      
      {/* Shelf support shadow */}
      <div className="h-2 bg-gradient-to-b from-shadow/20 to-transparent rounded-b-lg" />
    </div>
  );
};

export default Shelf;
