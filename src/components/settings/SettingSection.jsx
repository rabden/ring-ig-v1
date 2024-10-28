import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

const SettingSection = ({ label, tooltip, children }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-3 w-3 p-0 text-muted-foreground hover:text-foreground opacity-70">
            <HelpCircle className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 text-sm" align="start">
          {tooltip}
        </PopoverContent>
      </Popover>
    </div>
    {children}
  </div>
);

export default SettingSection;