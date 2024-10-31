import React from 'react';
import SettingSection from './SettingSection';
import { modelConfigs } from '@/utils/modelConfigs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModelSection = ({ model, setModel, nsfwEnabled }) => {
  const models = nsfwEnabled 
    ? ['nsfwMaster', 'animeNsfw', 'nsfwPro']
    : ['turbo', 'flux', 'fluxDev', 'preLar'];

  return (
    <SettingSection 
      label="Model" 
      tooltip="Choose between fast generation or higher quality output."
    >
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((modelKey) => (
            <SelectItem key={modelKey} value={modelKey}>
              {modelConfigs[modelKey]?.name || modelKey}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingSection>
  );
};

export default ModelSection;