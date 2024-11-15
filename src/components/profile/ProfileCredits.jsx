import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProfileCredits = ({ credits, bonusCredits, isPro, proRequest }) => {
  return (
    <div className="space-y-2">
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Credits</span>
          <span className="text-sm">{credits}+ B{bonusCredits}</span>
        </div>
      </div>

      {!isPro && !proRequest && (
        <Button 
          variant="default" 
          className="w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 hover:from-yellow-400 hover:via-yellow-600 hover:to-amber-600"
          onClick={() => toast.error("Pro request feature not implemented")}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Request Pro Access
        </Button>
      )}
      {!isPro && proRequest && (
        <div className="text-sm text-center text-muted-foreground p-3 bg-muted rounded-lg">
          Pro request under review
        </div>
      )}
    </div>
  );
};

export default ProfileCredits;