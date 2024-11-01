import React from 'react';
import { FileQuestion } from 'lucide-react';

const NoResults = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileQuestion className="w-24 h-24 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Oops, nothing found</h3>
      <p className="text-sm text-muted-foreground">
        Try searching something else or remove some filters
      </p>
    </div>
  );
};

export default NoResults;