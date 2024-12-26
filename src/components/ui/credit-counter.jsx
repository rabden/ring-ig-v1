import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

const CreditCounter = ({ credits, bonusCredits, className }) => {
  const MAX_CREDITS = 50;
  const creditsProgress = (credits / MAX_CREDITS) * 100;

  return (
    <div className={cn("space-y-2 w-full", className)}>
      <div className="flex justify-between text-xs items-center">
        <span className="text-muted-foreground">daily credits</span>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>{credits}/{MAX_CREDITS} remaining</span>
          {bonusCredits > 0 && (
            <>
              <span className="mx-1">+</span>
              <Zap className="w-3 h-3" />
              <span className="text-green-500">B{bonusCredits}</span>
            </>
          )}
        </div>
      </div>
      <Progress value={creditsProgress} className="h-2 bg-destructive/25" />
    </div>
  );
};

export default CreditCounter;