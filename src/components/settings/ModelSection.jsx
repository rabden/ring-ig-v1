import React from 'react';
import { Button } from "@/components/ui/button";
import SettingSection from './SettingSection';

const ModelSection = ({ model, setModel, nsfwEnabled }) => (
  <SettingSection 
    label="Model" 
    tooltip="Choose between fast generation or higher quality output."
  >
    <div className="grid grid-cols-2 gap-2">
      {!nsfwEnabled ? (
        <>
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

export default ModelSection;