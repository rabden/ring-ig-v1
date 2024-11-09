import React from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SettingSection from './SettingSection';

const SeedSettings = ({ seed, setSeed, randomizeSeed, setRandomizeSeed }) => {
  return (
    <SettingSection label="Seed" tooltip="A seed is a number that initializes the random generation process. Using the same seed with the same settings will produce the same image.">
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={seed}
          onChange={(e) => setSeed(parseInt(e.target.value))}
          disabled={randomizeSeed}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="randomizeSeed"
            checked={randomizeSeed}
            onCheckedChange={setRandomizeSeed}
          />
          <Label htmlFor="randomizeSeed">Random</Label>
        </div>
      </div>
    </SettingSection>
  );
};

export default React.memo(SeedSettings);