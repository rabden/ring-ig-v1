import React from 'react';
import { FileQuestion } from "lucide-react";

const NoResults = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileQuestion className="w-24 h-24 text-muted-foreground/50" />
    </div>
  );
};

export default NoResults;