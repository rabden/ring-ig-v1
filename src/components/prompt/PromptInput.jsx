import React from 'react';

const PromptInput = ({ 
  value = '', 
  onChange, 
  onKeyDown,
  placeholder = "A 4D HDR immersive 3D image..."
}) => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full min-h-[430px] md:min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-4 px-2 md:px-2"
        style={{ 
          caretColor: 'currentColor',
        }}
      />
    </div>
  );
};

export default PromptInput;