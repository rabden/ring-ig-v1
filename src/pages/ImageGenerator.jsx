import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';
import { Card } from "@/components/ui/card";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useNotification } from '@/contexts/NotificationContext';
import { toast } from 'sonner';
import { generateImage } from '@/lib/api';
import GeneratorForm from '@/components/generator/GeneratorForm';
import ImageGallery from '@/components/generator/ImageGallery';
import FullScreenImageView from '@/components/FullScreenImageView';
import MobileImageDrawer from '@/components/MobileImageDrawer';

const ImageGenerator = () => {
  const { imageId } = useParams();
  const location = useLocation();
  const { session } = useSupabaseAuth();
  const { showNotification } = useNotification();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();

  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('sdxl');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [quality, setQuality] = useState('standard');
  const [size, setSize] = useState('1024x1024');
  const [seed, setSeed] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

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
    enabled: !!imageId
  });

  const { data: userImages = [] } = useQuery({
    queryKey: ['userImages'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    if (remixImage) {
      setPrompt(remixImage.prompt);
      setSelectedModel(remixImage.model);
      setSelectedStyle(remixImage.style);
      setQuality(remixImage.quality);
      setSize(`${remixImage.width}x${remixImage.height}`);
      setSeed(remixImage.seed);
    }
  }, [remixImage]);

  const handleGenerate = async () => {
    if (!session) {
      showNotification({
        title: "Authentication Required",
        message: "Please sign in to generate images",
        type: "error"
      });
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const [width, height] = size.split('x').map(Number);
      const response = await generateImage({
        prompt,
        model: selectedModel,
        style: selectedStyle,
        quality,
        width,
        height,
        seed: seed || undefined
      });

      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageClick = (image) => {
    if (window.innerWidth < 768) {
      setSelectedImage(image);
      setShowMobileDrawer(true);
    } else {
      setSelectedImage(image);
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
    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('id', image.id);
      if (error) throw error;
      toast.success('Image discarded');
    } catch (error) {
      toast.error('Failed to discard image');
    }
  };

  const handleRemix = (image) => {
    setPrompt(image.prompt);
    setSelectedModel(image.model);
    setSelectedStyle(image.style);
    setQuality(image.quality);
    setSize(`${image.width}x${image.height}`);
    setSeed(image.seed);
  };

  if (!session) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Sign in to Generate Images</h2>
          <SupabaseAuthUI />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid lg:grid-cols-[1fr,400px] gap-6">
        <GeneratorForm
          prompt={prompt}
          setPrompt={setPrompt}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          quality={quality}
          setQuality={setQuality}
          size={size}
          setSize={setSize}
          isGenerating={isGenerating}
          handleGenerate={handleGenerate}
          modelConfigs={modelConfigs}
          styleConfigs={styleConfigs}
        />

        <ImageGallery 
          images={userImages}
          onImageClick={handleImageClick}
        />
      </div>

      {selectedImage && (
        <>
          <div className="hidden md:block">
            <FullScreenImageView
              image={selectedImage}
              isOpen={!!selectedImage}
              onClose={() => setSelectedImage(null)}
              onDownload={handleDownload}
              onDiscard={handleDiscard}
              onRemix={handleRemix}
              isOwner={selectedImage?.user_id === session?.user?.id}
            />
          </div>
          <div className="md:hidden">
            <MobileImageDrawer
              image={selectedImage}
              open={showMobileDrawer}
              onOpenChange={setShowMobileDrawer}
              onDownload={handleDownload}
              onDiscard={handleDiscard}
              onRemix={handleRemix}
              isOwner={selectedImage?.user_id === session?.user?.id}
              showImage={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGenerator;