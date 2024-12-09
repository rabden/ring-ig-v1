import React, { useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState';
import ImageGallery from './ImageGallery';
import ImageDetailsDialog from './ImageDetailsDialog';
import FullScreenImageView from './FullScreenImageView';
import DesktopPromptBox from './prompt/DesktopPromptBox';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useImageFilter } from '@/hooks/useImageFilter';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ImageGeneratorContent = ({ 
  activeTab, 
  setActiveTab, 
  isInspiration = false,
  showPrivate = false,
  profileUserId
}) => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const queryClient = useQueryClient();
  const { totalCredits, bonusCredits, updateCredits } = useUserCredits(session?.user?.id);

  const imageGeneratorProps = useImageGeneratorState({
    session,
    updateCredits,
    modelConfigs,
    styleConfigs,
    queryClient
  });

  const { 
    handleImageClick,
    handleDownload,
    handleDiscard,
    handleRemix,
    handleViewDetails,
    handleCloseDetails,
    handleCloseFullScreen
  } = useImageHandlers({
    session,
    setSelectedImage,
    setFullScreenImage,
    navigate,
    setActiveTab
  });

  const { activeFilters, searchQuery } = useImageFilter();

  if (!session && !isInspiration) {
    toast.error('Please sign in to generate images');
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="container mx-auto pb-20">
        {!isMobile && (
          <>
            {!isInspiration && (
              <DesktopPromptBox
                prompt={imageGeneratorProps.prompt}
                onChange={(e) => imageGeneratorProps.setPrompt(e.target.value)}
                onKeyDown={imageGeneratorProps.handlePromptKeyDown}
                onGenerate={imageGeneratorProps.generateImage}
                hasEnoughCredits={true}
                isGenerating={imageGeneratorProps.isGenerating}
                onImprove={imageGeneratorProps.handleImprove}
                onClear={imageGeneratorProps.handleClear}
                totalCredits={totalCredits}
                bonusCredits={bonusCredits}
              />
            )}
          </>
        )}

        <div className="md:mt-16">
          <ImageGallery
            userId={session?.user?.id}
            onImageClick={handleImageClick}
            onDownload={handleDownload}
            onDiscard={handleDiscard}
            onRemix={handleRemix}
            onViewDetails={handleViewDetails}
            activeView={isInspiration ? 'inspiration' : 'myImages'}
            generatingImages={imageGeneratorProps.generatingImages}
            nsfwEnabled={imageGeneratorProps.nsfwEnabled}
            activeFilters={activeFilters}
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
            showPrivate={showPrivate}
            profileUserId={profileUserId}
          />
        </div>
      </div>

      <ImageDetailsDialog
        open={!!selectedImage}
        onOpenChange={handleCloseDetails}
        image={selectedImage}
      />

      <FullScreenImageView
        image={fullScreenImage}
        isOpen={!!fullScreenImage}
        onClose={handleCloseFullScreen}
        onDownload={handleDownload}
        onDiscard={handleDiscard}
        onRemix={handleRemix}
        isOwner={fullScreenImage?.user_id === session?.user?.id}
        setStyle={imageGeneratorProps.setStyle}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default ImageGeneratorContent;