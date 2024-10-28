import React from 'react';
import { Button } from "@/components/ui/button";
import SettingSection from './SettingSection';
import { modelConfigs } from '@/utils/modelConfigs';

const ModelSection = ({ model, setModel, nsfwEnabled, quality }) => {
  const isQualitySupported = (modelName) => {
    const modelConfig = modelConfigs[modelName];
    return !modelConfig.qualityLimits || modelConfig.qualityLimits.includes(quality);
  };

  return (
    <SettingSection 
      label="Model" 
      tooltip="Choose between fast generation or higher quality output."
    >
      <div className="grid grid-cols-2 gap-2">
        {!nsfwEnabled ? (
          <>
            <Button
              variant={model === 'turbo' ? 'default' : 'outline'}
              onClick={() => setModel('turbo')}
              disabled={!isQualitySupported('turbo')}
            >
              Ring.1 turbo
              {!isQualitySupported('turbo') && <span className="text-xs block">Not available for HD+</span>}
            </Button>
            <Button
              variant={model === 'flux' ? 'default' : 'outline'}
              onClick={() => setModel('flux')}
            >
              Ring.1
            </Button>
            <Button
              variant={model === 'fluxDev' ? 'default' : 'outline'}
              onClick={() => setModel('fluxDev')}
              className="col-span-2"
            >
              Ring.1 hyper
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={model === 'nsfwMaster' ? 'default' : 'outline'}
              onClick={() => setModel('nsfwMaster')}
            >
              Ring.1N
            </Button>
            <Button
              variant={model === 'animeNsfw' ? 'default' : 'outline'}
              onClick={() => setModel('animeNsfw')}
            >
              Ring.1Nanime
            </Button>
          </>
        )}
      </div>
    </SettingSection>
  );
};

export default ModelSection;