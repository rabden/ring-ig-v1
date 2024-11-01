import React from 'react';
import { FileQuestion } from "lucide-react";

const NoResults = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileQuestion className="w-24 h-24 text-muted-foreground/50 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Oops! Nothing found</h3>
      <p className="text-muted-foreground">
        Try searching something else or remove some filters
      </p>
    </div>
  );
};

export default NoResults;