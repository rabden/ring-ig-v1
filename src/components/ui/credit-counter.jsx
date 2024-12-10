import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CreditCounter = ({ credits = 0, bonusCredits = 0, maxCredits = 50 }) => {
  const tooltipText = `You have ${credits} daily credits out of ${maxCredits}${bonusCredits > 0 ? ` and ${bonusCredits} bonus credits` : ''}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-medium">
            {credits + bonusCredits}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CreditCounter;