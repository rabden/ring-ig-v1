import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SettingSection = ({ label, tooltip, children, className }) => (
  <div className={cn(
    "space-y-2.5 rounded-lg transition-all duration-200",
    "hover:bg-muted/40 p-3 -mx-3",
    className
  )}>
    <div className="flex items-center space-x-2">
      <Label className="text-sm font-medium text-foreground/90">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "h-5 w-5 p-0 text-muted-foreground/70",
              "hover:text-foreground hover:bg-accent/40",
              "transition-all duration-200"
            )}
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "w-80 text-sm bg-card/80 backdrop-blur-sm",
            "border-none shadow-lg animate-in fade-in-0 zoom-in-95"
          )} 
          align="start"
        >
          {tooltip}
        </PopoverContent>
      </Popover>
    </div>
    <div className="transition-all duration-200">
      {children}
    </div>
  </div>
);

export default SettingSection;