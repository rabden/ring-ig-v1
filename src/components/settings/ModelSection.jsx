import React from 'react';
import { Button } from "@/components/ui/button";
import SettingSection from './SettingSection';

const ModelSection = ({ model, setModel, nsfwEnabled, quality }) => {
  return (
    <SettingSection 
      label="Model" 
      tooltip="Choose between fast generation or higher quality output."
    >
      <div className="grid grid-cols-3 gap-1.5">
        {!nsfwEnabled ? (
          <>
            <Button
              size="sm"
              variant={model === 'turbo' ? 'default' : 'outline'}
              onClick={() => setModel('turbo')}
              className="text-xs h-7"
            >
              Ring.1 turbo
            </Button>
            <Button
              size="sm"
              variant={model === 'flux' ? 'default' : 'outline'}
              onClick={() => setModel('flux')}
              className="text-xs h-7"
            >
              Ring.1
            </Button>
            <Button
              size="sm"
              variant={model === 'fluxDev' ? 'default' : 'outline'}
              onClick={() => setModel('fluxDev')}
              className="text-xs h-7"
            >
              Ring.1 hyper
            </Button>
            <Button
              size="sm"
              variant={model === 'preLar' ? 'default' : 'outline'}
              onClick={() => setModel('preLar')}
              className="text-xs h-7"
            >
              Ring.1 Pre-lar
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant={model === 'nsfwMaster' ? 'default' : 'outline'}
              onClick={() => setModel('nsfwMaster')}
              className="text-xs h-7"
            >
              Ring.1N
            </Button>
            <Button
              size="sm"
              variant={model === 'animeNsfw' ? 'default' : 'outline'}
              onClick={() => setModel('animeNsfw')}
              className="text-xs h-7"
            >
              Ring.1 Anime
            </Button>
            <Button
              size="sm"
              variant={model === 'nsfwPro' ? 'default' : 'outline'}
              onClick={() => setModel('nsfwPro')}
              className="text-xs h-7"
            >
              Ring.1Npro
            </Button>
          </>
        )}
      </div>
    </SettingSection>
  );
};

export default ModelSection;