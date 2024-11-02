import React from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';

const CreditsDisplay = ({ session, quality }) => {
  const { credits = 0, bonusCredits = 0 } = useUserCredits(session?.user?.id);
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
  const totalCredits = credits + bonusCredits;
  const hasEnoughCredits = totalCredits >= creditCost;

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