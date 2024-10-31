import React from 'react';
import { Button } from "@/components/ui/button";
import SettingSection from './SettingSection';
import { modelConfigs } from '@/utils/modelConfigs';

const ModelSection = ({ model, setModel, nsfwEnabled, quality }) => {
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
            >
              Ring.1 turbo
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
            >
              Ring.1 hyper
            </Button>
            <Button
              variant={model === 'preLar' ? 'default' : 'outline'}
              onClick={() => setModel('preLar')}
            >
              Ring.1 Pre-lar
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
              Ring.1 Anime
            </Button>
            <Button
              variant={model === 'nsfwPro' ? 'default' : 'outline'}
              onClick={() => setModel('nsfwPro')}
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