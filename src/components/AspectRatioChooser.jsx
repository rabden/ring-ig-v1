import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown } from 'lucide-react';
import { aspectRatios } from '@/utils/imageConfigs';

const AspectRatioChooser = ({ aspectRatio, setAspectRatio }) => {
  const proRatios = ['21:9', '9:21', '1.91:1', '1:1.91'];
  
  const renderProBadge = () => (
    <Crown className="w-4 h-4 ml-1 inline-block text-yellow-500" />
  );

  return (
    <div className="grid grid-cols-4 gap-2">
      {Object.keys(aspectRatios).map((ratio) => (
        <Button
          key={ratio}
          variant={aspectRatio === ratio ? 'default' : 'outline'}
          onClick={() => setAspectRatio(ratio)}
          className="flex items-center justify-center"
        >
          {ratio}
          {proRatios.includes(ratio) && renderProBadge()}
        </Button>
      ))}
    </div>
  );
};

export default AspectRatioChooser;