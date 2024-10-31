import React from 'react';
import { Switch } from "@/components/ui/switch";
import SettingSection from './SettingSection';

const NSFWToggle = ({ enabled, onToggle }) => {
  return (
    <SettingSection 
      label="NSFW Content" 
      tooltip="Enable to access NSFW models and content. Please ensure you are of legal age in your jurisdiction."
    >
      <div className="flex items-center space-x-2">
        <Switch
          id="nsfw-mode"
          checked={enabled}
          onCheckedChange={onToggle}
        />
        <span className="text-sm text-muted-foreground">
          {enabled ? "NSFW Content Enabled" : "NSFW Content Disabled"}
        </span>
      </div>
    </SettingSection>
  );
};

export default NSFWToggle;