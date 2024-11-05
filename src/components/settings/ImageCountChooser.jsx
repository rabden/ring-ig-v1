import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingSection from './SettingSection';

const ImageCountChooser = ({ count, setCount }) => {
  return (
    <SettingSection 
      label="Number of Images" 
      tooltip="Generate multiple images at once. Higher counts require more credits."
    >
      <Tabs value={count.toString()} onValueChange={(value) => setCount(parseInt(value))}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="1">1</TabsTrigger>
          <TabsTrigger value="2">2</TabsTrigger>
          <TabsTrigger value="3">3</TabsTrigger>
          <TabsTrigger value="4">4</TabsTrigger>
        </TabsList>
      </Tabs>
    </SettingSection>
  );
};

export default ImageCountChooser;