import React from 'react';
import { styleConfigs } from '@/utils/styleConfigs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StyleChooser = ({ style, setStyle }) => {
  return (
    <Select value={style} onValueChange={setStyle}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a style" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(styleConfigs).map(([key, config]) => (
          <SelectItem key={key} value={key}>
            {config.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StyleChooser;