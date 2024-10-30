import React from 'react';
import { useCharacters } from '@/hooks/useCharacters';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CharacterGallery = ({ session, onUseCharacter }) => {
  const { data: characters, isLoading } = useCharacters(session?.user?.id);

  if (isLoading) {
    return <div>Loading characters...</div>;
  }

  if (!characters?.length) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No characters created yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] w-full pr-4">
      <div className="grid grid-cols-1 gap-4">
        {characters.map((character) => (
          <Card key={character.id} className="bg-card">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{character.character_name}</h3>
                  <p className="text-sm text-muted-foreground">{character.description}</p>
                  <div className="mt-2 text-sm">
                    <p>Age: {character.age}</p>
                    <p>Gender: {character.gender}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUseCharacter(character)}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CharacterGallery;