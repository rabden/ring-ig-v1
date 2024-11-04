import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Lock } from "lucide-react";

const PrivacyToggle = ({ isPrivate, onToggle }) => {
  return (
    <Button
      size="sm"
      variant={isPrivate ? "outline" : "default"}
      className="rounded-full"
      onClick={onToggle}
    >
      {isPrivate ? (
        <>
          <Lock className="h-4 w-4 mr-2" />
          Private
        </>
      ) : (
        <>
          <Globe className="h-4 w-4 mr-2" />
          Public
        </>
      )}
    </Button>
  );
};

export default PrivacyToggle;