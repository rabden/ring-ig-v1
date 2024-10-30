import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { qualityOptions } from '@/utils/imageConfigs';
import StyleChooser from './StyleChooser';
import AspectRatioChooser from './AspectRatioChooser';
import SettingSection from './settings/SettingSection';
import ModelSection from './settings/ModelSection';
import CharacterGallery from './CharacterGallery';
import { ArrowRight, X } from 'lucide-react';
import { useCharacters } from '@/hooks/useCharacters';

const PromptInput = ({ value, onChange, onKeyDown, onGenerate, onMentionCharacter }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef(null);
  const [showClear, setShowClear] = React.useState(false);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 300) + 'px';
      setShowClear(scrollHeight > 100);
    }
  }, [value]);

  const handleInput = (e) => {
    const text = e.target.value;
    const lastWord = text.split(' ').pop();
    
    if (lastWord.startsWith('@')) {
      const characterName = lastWord.slice(1);
      onMentionCharacter(characterName, text);
    } else {
      onChange(e);
    }
  };

  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  const showButton = isFocused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Enter your prompt here. Use @character to reference saved characters"
        className="w-full min-h-[40px] max-h-[300px] resize-none overflow-y-auto bg-background rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 pr-10 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
        rows={1}
      />
      <div className="absolute right-3 bottom-3 flex flex-col gap-2 items-center">
        {showClear && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {showButton && (
          <Button
            size="icon"
            className="h-7 w-7"
            onClick={onGenerate}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

const ImageGeneratorForm = ({
  prompt, setPrompt,
  handlePromptKeyDown,
  generateImage,
  model, setModel,
  seed, setSeed,
  randomizeSeed, setRandomizeSeed,
  quality, setQuality,
  useAspectRatio, setUseAspectRatio,
  aspectRatio, setAspectRatio,
  width, setWidth,
  height, setHeight,
  session,
  credits,
  bonusCredits,
  nsfwEnabled, setNsfwEnabled,
  style, setStyle,
  steps, setSteps,
}) => {
  const { data: characters } = useCharacters(session?.user?.id);
  const creditCost = { "SD": 1, "HD": 2, "HD+": 3 }[quality];
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCredits = totalCredits >= creditCost;

  const handleMentionCharacter = (name, currentText) => {
    const character = characters?.find(c => 
      c.character_name.toLowerCase() === name.toLowerCase()
    );
    
    if (character) {
      const characterDetails = `{${character.character_name}, ${character.description}, Age:${character.age}, ${character.eyes_shape} eyes, ${character.eyes_color} eye color, ${character.nose_shape} nose, ${character.hair_type} ${character.hair_color} ${character.hair_length} hair, ${character.height} height, ${character.cultural_accent} features, ${character.personality} personality, ${character.face_shape} face, ${character.body_color} skin, ${character.body_shape} body}`;
      
      // Replace @mention with character name
      const newText = currentText.replace(`@${name}`, character.character_name);
      setPrompt(newText);
      
      // Set model to preLar and use character's ID as seed
      setModel('preLar');
      setSeed(character.character_id);
      setRandomizeSeed(false);
    }
  };

  const handleUseCharacter = (character) => {
    const characterPrompt = `${character.character_name}: A ${character.age} year old ${character.gender.toLowerCase()} with ${character.eyes_color.toLowerCase()} ${character.eyes_shape.toLowerCase()} eyes, ${character.hair_length.toLowerCase()} ${character.hair_color.toLowerCase()} ${character.hair_type.toLowerCase()} hair, ${character.height.toLowerCase()} height, ${character.body_shape.toLowerCase()} body shape, ${character.body_color.toLowerCase()} skin tone, ${character.face_shape.toLowerCase()} face, ${character.nose_shape.toLowerCase()} nose, ${character.cultural_accent} features, ${character.personality.toLowerCase()} personality`;
    setPrompt((currentPrompt) => currentPrompt ? `${currentPrompt}, ${characterPrompt}` : characterPrompt);
    
    // Set model to preLar and use character's ID as seed
    setModel('preLar');
    setSeed(character.character_id);
    setRandomizeSeed(false);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Settings</h2>
        {session && (
          <div className="text-sm font-medium">
            Credits: {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''}
            {!hasEnoughCredits && (
              <span className="text-destructive ml-2">
                Need {creditCost} credits for {quality}
              </span>
            )}
          </div>
        )}
      </div>

      <SettingSection label="Characters" tooltip="Use your saved characters in the prompt">
        <CharacterGallery session={session} onUseCharacter={handleUseCharacter} />
      </SettingSection>

      <SettingSection label="Prompt" tooltip="Enter your prompt. Use @character to reference saved characters">
        <PromptInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handlePromptKeyDown}
          onGenerate={generateImage}
          onMentionCharacter={handleMentionCharacter}
        />
      </SettingSection>

      <ModelSection 
        model={model} 
        setModel={setModel}
        nsfwEnabled={nsfwEnabled} 
        quality={quality}
      />

      <SettingSection label="Quality" tooltip="Higher quality settings produce more detailed images but require more credits.">
        <Tabs value={quality} onValueChange={setQuality}>
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${Object.keys(qualityOptions).length}, 1fr)` }}>
            {Object.keys(qualityOptions).map((q) => (
              <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </SettingSection>

      <SettingSection label="Aspect Ratio" tooltip="Slide left for portrait, center for square, right for landscape">
        <AspectRatioChooser aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
      </SettingSection>

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
    </div>
  );
};

export default ImageGeneratorForm;