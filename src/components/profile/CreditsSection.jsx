import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreditsSection = ({ credits, bonusCredits, maxCredits = 50 }) => {
  const creditsProgress = ((credits || 0) / maxCredits) * 100;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
      <CardHeader>
        <CardTitle className="text-lg">Credits Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Available Credits</span>
          <div className="text-right">
            <span className="text-2xl font-bold">{credits || 0}</span>
            <span className="text-sm text-muted-foreground ml-1">/ {maxCredits}</span>
            {bonusCredits > 0 && (
              <span className="text-green-500 ml-2">+{bonusCredits}</span>
            )}
          </div>
        </div>
        <Progress value={creditsProgress} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default CreditsSection;