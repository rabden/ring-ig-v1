import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import SettingSection from './SettingSection';
import { modelConfigs } from '@/utils/modelConfigs';

const ModelSection = ({ model, setModel, nsfwEnabled, quality }) => {
  const premiumModels = ['preLar', 'animeNsfw'];

  const renderModelButton = (modelKey, label) => (
    <Button
      variant={model === modelKey ? 'default' : 'outline'}
      onClick={() => setModel(modelKey)}
      className="flex items-center justify-center gap-1"
    >
      {label}
      {premiumModels.includes(modelKey) && <Crown className="h-4 w-4" />}
    </Button>
  );

  return (
    <SettingSection 
      label="Model" 
      tooltip="Choose between fast generation or higher quality output."
    >
      <div className="grid grid-cols-2 gap-2">
        {!nsfwEnabled ? (
          <>
            {renderModelButton('turbo', 'Ring.1 turbo')}
            {renderModelButton('flux', 'Ring.1')}
            {renderModelButton('fluxDev', 'Ring.1 hyper')}
            {renderModelButton('preLar', 'Ring.1 Pre-lar')}
          </>
        ) : (
          <>
            {renderModelButton('nsfwMaster', 'Ring.1N')}
            {renderModelButton('animeNsfw', 'Ring.1 Anime')}
          </>
        )}
      </div>
    </SettingSection>
  );
};

export default ModelSection;