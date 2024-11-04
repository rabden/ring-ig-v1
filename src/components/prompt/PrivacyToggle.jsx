import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EyeOff } from "lucide-react";

const PrivacyToggle = ({ isPrivate, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="private-mode"
        checked={isPrivate}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="private-mode" className="flex items-center gap-1 cursor-pointer">
        <EyeOff className="h-4 w-4" />
        Private
      </Label>
    </div>
  );
};

export default PrivacyToggle;