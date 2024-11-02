import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const GeneratorForm = ({ 
  prompt, setPrompt,
  selectedModel, setSelectedModel,
  selectedStyle, setSelectedStyle,
  quality, setQuality,
  size, setSize,
  isGenerating,
  handleGenerate,
  modelConfigs,
  styleConfigs 
}) => {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Describe the image you want to generate..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[120px] text-lg"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(modelConfigs || {}).map(([id, config]) => (
              <SelectItem key={id} value={id}>{config.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">General</SelectItem>
            {Object.entries(styleConfigs || {}).map(([id, config]) => (
              <SelectItem key={id} value={id}>{config.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={quality} onValueChange={setQuality}>
          <SelectTrigger>
            <SelectValue placeholder="Select quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="hd">HD</SelectItem>
          </SelectContent>
        </Select>

        <Select value={size} onValueChange={setSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1024x1024">1024x1024</SelectItem>
            <SelectItem value="1024x1792">1024x1792</SelectItem>
            <SelectItem value="1792x1024">1792x1024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleGenerate}
          className="w-full"
          disabled={isGenerating}
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
};

export default GeneratorForm;