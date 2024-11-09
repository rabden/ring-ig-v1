import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PrivacySettings = ({ nsfwEnabled, setNsfwEnabled }) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <Label htmlFor="nsfwToggle" className="text-sm font-medium">Enable NSFW Content</Label>
      <Switch
        id="nsfwToggle"
        checked={nsfwEnabled}
        onCheckedChange={setNsfwEnabled}
      />
    </div>
  );
};

export default React.memo(PrivacySettings);