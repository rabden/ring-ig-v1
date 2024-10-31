import React from 'react';
import { Button } from "@/components/ui/button";
import SettingSection from './SettingSection';
import { Crown } from 'lucide-react';

const ModelSection = ({ model, setModel, nsfwEnabled, quality }) => {
  const renderProBadge = () => (
    <Crown className="w-4 h-4 ml-1 inline-block text-yellow-500" />
  );

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
              className="flex items-center justify-center"
            >
              Ring.1 {renderProBadge()}
            </Button>
            <Button
              variant={model === 'fluxDev' ? 'default' : 'outline'}
              onClick={() => setModel('fluxDev')}
              className="flex items-center justify-center"
            >
              Ring.1 hyper {renderProBadge()}
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
              className="flex items-center justify-center"
            >
              Ring.1Npro {renderProBadge()}
            </Button>
          </>
        )}
      </div>
    </SettingSection>
  );
};

export default ModelSection;