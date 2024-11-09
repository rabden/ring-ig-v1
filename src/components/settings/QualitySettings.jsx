import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingSection from './SettingSection';

const QualitySettings = ({ quality, setQuality, availableQualities }) => {
  return (
    <SettingSection label="Quality" tooltip="Higher quality settings produce more detailed images but require more credits.">
      <Tabs value={quality} onValueChange={setQuality}>
        <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${availableQualities.length}, 1fr)` }}>
          {availableQualities.map((q) => (
            <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </SettingSection>
  );
};

export default React.memo(QualitySettings);