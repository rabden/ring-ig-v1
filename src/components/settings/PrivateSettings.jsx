import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PrivateSettings = ({ isPrivate, onPrivateChange }) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <Label htmlFor="privateToggle" className="text-sm font-medium">Make Image Private</Label>
      <Switch
        id="privateToggle"
        checked={isPrivate}
        onCheckedChange={onPrivateChange}
      />
    </div>
  );
};

export default PrivateSettings;