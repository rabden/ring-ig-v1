import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { characterOptions } from '@/utils/characterConfigs';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

const CharacterGeneratorSettings = ({ session }) => {
  const [formData, setFormData] = useState({
    character_name: '',
    description: '',
    age: '',
    character_id: Math.floor(Math.random() * 1000000),
    eyes_shape: '',
    eyes_color: '',
    nose_shape: '',
    hair_type: '',
    hair_color: '',
    hair_length: '',
    height: '',
    cultural_accent: '',
    gender: '',
    personality: '',
    face_shape: '',
    body_color: '',
    body_shape: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('characters')
        .insert({
          ...formData,
          user_id: session?.user?.id,
          age: parseInt(formData.age)
        });

      if (error) throw error;
      toast.success('Character created successfully!');
    } catch (error) {
      console.error('Error creating character:', error);
      toast.error('Failed to create character');
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="space-y-2">
        <Label>Character Name</Label>
        <Input
          value={formData.character_name}
          onChange={(e) => handleInputChange('character_name', e.target.value)}
          placeholder="Enter character name"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter character description"
        />
      </div>

      <div className="space-y-2">
        <Label>Age</Label>
        <Input
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          placeholder="Enter character age"
        />
      </div>

      <div className="space-y-2">
        <Label>Character ID (Seed)</Label>
        <Input
          value={formData.character_id}
          disabled
          className="bg-muted"
        />
      </div>

      {Object.entries(characterOptions).map(([key, options]) => (
        <div key={key} className="space-y-2">
          <Label>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
          <Select
            value={formData[key]}
            onValueChange={(value) => handleInputChange(key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${key.replace('_', ' ')}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
      >
        Create Character
      </button>
    </div>
  );
};

export default CharacterGeneratorSettings;