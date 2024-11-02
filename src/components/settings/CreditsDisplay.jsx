import React from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { Skeleton } from "@/components/ui/skeleton";

const CreditsDisplay = ({ session, quality }) => {
  const { credits = 0, bonusCredits = 0, isLoading, error } = useUserCredits(session?.user?.id);
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
  const totalCredits = credits + bonusCredits;
  const hasEnoughCredits = totalCredits >= creditCost;

  if (isLoading) {
    return <Skeleton className="h-4 w-24" />;
  }

  if (error) {
    console.error('Credits fetch error:', error);
    return (
      <div className="text-sm font-medium text-destructive">
        Error loading credits
      </div>
    );
  }

  return (
    <div className="text-sm font-medium">
      Credits: {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''}
      {!hasEnoughCredits && (
        <span className="text-destructive ml-2">
          Need {creditCost} credits for {quality}
        </span>
      )}
    </div>
  );
};

export default CreditsDisplay;