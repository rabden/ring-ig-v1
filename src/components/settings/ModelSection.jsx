import React from 'react';
import { Button } from "@/components/ui/button";
import SettingSection from './SettingSection';
import { Crown } from "lucide-react";

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
              variant="outline"
              onClick={() => setModel('turbo')}
              className={model === 'turbo' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
            >
              Ring.1 turbo
            </Button>
            <Button
              variant="outline"
              onClick={() => setModel('flux')}
              className={`flex items-center gap-1 ${model === 'flux' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
            >
              Ring.1 <Crown className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setModel('fluxDev')}
              className={`flex items-center gap-1 ${model === 'fluxDev' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
            >
              Ring.1 hyper <Crown className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setModel('preLar')}
              className={model === 'preLar' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
            >
              Ring.1 Pre-lar
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setModel('nsfwMaster')}
              className={model === 'nsfwMaster' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
            >
              Ring.1N
            </Button>
            <Button
              variant="outline"
              onClick={() => setModel('animeNsfw')}
              className={model === 'animeNsfw' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
            >
              Ring.1 Anime
            </Button>
            <Button
              variant="outline"
              onClick={() => setModel('nsfwPro')}
              className={`flex items-center gap-1 ${model === 'nsfwPro' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
            >
              Ring.1Npro <Crown className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </SettingSection>
  );
};

export default ModelSection;