import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

const ImageActions = ({ handleDownload, handleRemix }) => {
  return (
    <div className="flex gap-2 justify-between">
      <Button variant="ghost" size="sm" className="flex-1" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button variant="ghost" size="sm" className="flex-1" onClick={handleRemix}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Remix
      </Button>
    </div>
  );
};

export default ImageActions;