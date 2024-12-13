import { Progress } from '@/components/ui/progress';

const CreditCounter = ({ credits, bonusCredits, className }) => {
  const MAX_CREDITS = 50;
  const creditsProgress = (credits / MAX_CREDITS) * 100;

  return (
    <div className={`space-y-2 min-w-[200px] ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Credits</span>
        <span className="font-medium">
          {credits}
          <span className="text-muted-foreground font-normal"> / {MAX_CREDITS}</span>
          {bonusCredits > 0 && (
            <span className="text-green-500 ml-1">+{bonusCredits}</span>
          )}
        </span>
      </div>
      <Progress value={creditsProgress} className="h-2 bg-secondary" />
    </div>
  );
};

export default CreditCounter; 