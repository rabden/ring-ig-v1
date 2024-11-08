import React from 'react';
import AuthOverlay from '@/components/AuthOverlay';
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings';

const ImageGeneratorPanel = ({
  session,
  activeTab,
  settings,
  handlers
}) => {
  return (
    <div className={`w-full md:w-[350px] bg-card text-card-foreground p-4 md:p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
      {!session && (
        <div className="absolute inset-0 z-10">
          <AuthOverlay />
        </div>
      )}
      <ImageGeneratorSettings
        {...settings}
        {...handlers}
      />
    </div>
  );
};

export default ImageGeneratorPanel;