import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useQueryClient } from '@tanstack/react-query';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState';
import { useProUser } from '@/hooks/useProUser';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useRemixImage } from '@/hooks/useRemixImage';
import { toast } from 'sonner';

// Import components
import AuthOverlay from '@/components/AuthOverlay';
import BottomNavbar from '@/components/BottomNavbar';
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings';
import ImageGallery from '@/components/ImageGallery';
import ImageDetailsDialog from '@/components/ImageDetailsDialog';
import FullScreenImageView from '@/components/FullScreenImageView';
import MobileGeneratingStatus from '@/components/MobileGeneratingStatus';
import DesktopHeader from '@/components/header/DesktopHeader';
import MobileHeader from '@/components/header/MobileHeader';
import MobileNotificationsMenu from '@/components/MobileNotificationsMenu';
import MobileProfileMenu from '@/components/MobileProfileMenu';

const ImageGenerator = () => {
  const { imageId } = useParams();
  const location = useLocation();
  const isRemixRoute = location.pathname.startsWith('/remix/');

  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showTopFilter, setShowTopFilter] = useState(false);
  const isHeaderVisible = useScrollDirection();
  const { session } = useSupabaseAuth();
  const { credits, bonusCredits, updateCredits } = useUserCredits(session?.user?.id);
  const { data: isPro } = useProUser(session?.user?.id);
  const { data: modelConfigs } = useModelConfigs();
  const queryClient = useQueryClient();

  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight, steps, setSteps,
    model, setModel, activeTab, setActiveTab, aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio, quality, setQuality,
    selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen, fullScreenViewOpen, setFullScreenViewOpen,
    fullScreenImageIndex, setFullScreenImageIndex, generatingImages, setGeneratingImages,
    activeView, setActiveView, nsfwEnabled, setNsfwEnabled, style, setStyle
  } = useImageGeneratorState();

  const handleRemix = useRemixImage({
    setPrompt,
    setSeed,
    setRandomizeSeed,
    setWidth,
    setHeight,
    setModel,
    setSteps,
    setQuality,
    setStyle,
    setAspectRatio,
    setUseAspectRatio,
    session,
    aspectRatios: []
  });

  const { generateImage } = useImageGeneration({
    session,
    prompt,
    seed,
    randomizeSeed,
    width,
    height,
    model,
    quality,
    useAspectRatio,
    aspectRatio,
    updateCredits,
    setGeneratingImages,
    style,
    modelConfigs,
    steps
  });

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    if (!session) {
      toast.error('Please sign in to generate images');
      return;
    }
    await generateImage();
  };

  // Image handling functions
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setFullScreenViewOpen(true);
  };

  const handleModelChange = (newModel) => {
    setModel(newModel);
  };

  const handlePromptKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleGenerateImage();
    }
  };

  const handleDownload = async (imageUrl, prompt) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${prompt.slice(0, 30)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDiscard = async (image) => {
    if (confirm('Are you sure you want to delete this image?')) {
      await deleteImageCompletely(image.id);
      queryClient.invalidateQueries(['userImages']);
    }
  };

  const handleViewDetails = (image) => {
    setSelectedImage(image);
    setDetailsDialogOpen(true);
  };

  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleRemoveFilter = (type) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[type];
      return newFilters;
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Add remix image loading
  const { data: remixImage } = useQuery({
    queryKey: ['remixImage', imageId],
    queryFn: async () => {
      if (!imageId) return null;
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!imageId && isRemixRoute,
  });

  // Handle remix image loading
  useEffect(() => {
    if (remixImage && isRemixRoute) {
      handleRemix(remixImage);
    }
  }, [remixImage, isRemixRoute]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        {session && (
          <>
            <DesktopHeader
              user={session.user}
              credits={credits}
              bonusCredits={bonusCredits}
              activeView={activeView}
              setActiveView={setActiveView}
              generatingImages={generatingImages}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
              onSearch={handleSearch}
              nsfwEnabled={nsfwEnabled}
              showTopFilter={showTopFilter}
              setShowTopFilter={setShowTopFilter}
            />
            <MobileHeader
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
              onSearch={handleSearch}
              isVisible={isHeaderVisible}
              nsfwEnabled={nsfwEnabled}
            />
          </>
        )}

        <div className="md:mt-16 mt-12">
          <ImageGallery
            userId={session?.user?.id}
            onImageClick={handleImageClick}
            onDownload={handleDownload}
            onDiscard={handleDiscard}
            onRemix={handleRemix}
            onViewDetails={handleViewDetails}
            activeView={activeView}
            generatingImages={generatingImages}
            nsfwEnabled={nsfwEnabled}
            modelConfigs={modelConfigs}
            activeFilters={activeFilters}
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
            setStyle={setStyle}
            showTopFilter={showTopFilter}
            session={session}
          />
        </div>
      </div>

      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-4 md:p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
        {!session && (
          <div className="absolute inset-0 z-10">
            <AuthOverlay />
          </div>
        )}
        <ImageGeneratorSettings
          prompt={prompt}
          setPrompt={setPrompt}
          handlePromptKeyDown={handlePromptKeyDown}
          generateImage={handleGenerateImage}
          model={model}
          setModel={handleModelChange}
          seed={seed}
          setSeed={setSeed}
          randomizeSeed={randomizeSeed}
          setRandomizeSeed={setRandomizeSeed}
          quality={quality}
          setQuality={setQuality}
          useAspectRatio={useAspectRatio}
          setUseAspectRatio={setUseAspectRatio}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          width={width}
          setWidth={setWidth}
          height={height}
          setHeight={setHeight}
          session={session}
          credits={credits}
          bonusCredits={bonusCredits}
          nsfwEnabled={nsfwEnabled}
          setNsfwEnabled={setNsfwEnabled}
          style={style}
          setStyle={setStyle}
          steps={steps}
          setSteps={setSteps}
          proMode={isPro}
          modelConfigs={modelConfigs}
        />
      </div>

      <MobileNotificationsMenu activeTab={activeTab} />
      <MobileProfileMenu 
        user={session?.user}
        credits={credits}
        bonusCredits={bonusCredits}
        activeTab={activeTab}
      />

      <BottomNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        session={session} 
        credits={credits}
        bonusCredits={bonusCredits}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      
      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={selectedImage}
      />
      <FullScreenImageView
        image={selectedImage}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onDownload={handleDownload}
        onDiscard={handleDiscard}
        onRemix={handleRemix}
        isOwner={false}
        session={session}
        setPrompt={setPrompt}
        setSeed={setSeed}
        setRandomizeSeed={setRandomizeSeed}
        setWidth={setWidth}
        setHeight={setHeight}
        setModel={setModel}
        setSteps={setSteps}
        setQuality={setQuality}
        setStyle={setStyle}
        setAspectRatio={setAspectRatio}
        setUseAspectRatio={setUseAspectRatio}
      />
      {generatingImages.length > 0 && (
        <MobileGeneratingStatus generatingImages={generatingImages} />
      )}
    </div>
  );
};

export default ImageGenerator;
