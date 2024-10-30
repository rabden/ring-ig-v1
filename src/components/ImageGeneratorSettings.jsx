import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CharacterGeneratorSettings from './CharacterGeneratorSettings';
import ImageGeneratorForm from './ImageGeneratorForm';

const ImageGeneratorSettings = (props) => {
  const [generatorType, setGeneratorType] = React.useState('image');

  return (
    <div className="space-y-4 pb-20 md:pb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
      <div className="flex justify-between items-center mb-4">
        <Select value={generatorType} onValueChange={setGeneratorType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select generator type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image Generator</SelectItem>
            <SelectItem value="character">Character Generator</SelectItem>
          </SelectContent>
        </Select>
        {props.session && (
          <div className="text-sm font-medium">
            Credits: {props.credits}{props.bonusCredits > 0 ? ` + B${props.bonusCredits}` : ''}
          </div>
        )}
      </div>

      {generatorType === 'image' ? (
        <ImageGeneratorForm {...props} />
      ) : (
        <CharacterGeneratorSettings session={props.session} />
      )}
    </div>
  );
};

export default ImageGeneratorSettings;