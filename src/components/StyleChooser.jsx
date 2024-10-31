import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown } from 'lucide-react';
import { styleConfigs } from '@/utils/styleConfigs';

const StyleChooser = ({ style, setStyle }) => {
  const proStyles = ['cinematic', 'anime', 'digital-art', 'photographic'];
  
  const renderProBadge = () => (
    <Crown className="w-4 h-4 ml-1 inline-block text-yellow-500" />
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(styleConfigs).map(([key, config]) => (
        <Button
          key={key}
          variant={style === key ? 'default' : 'outline'}
          onClick={() => setStyle(key)}
          className="flex items-center justify-center"
        >
          {config.name}
          {proStyles.includes(key) && renderProBadge()}
        </Button>
      ))}
    </div>
  );
};

export default StyleChooser;