import { useState, useEffect } from 'react'
import { useModelConfigs } from './useModelConfigs'

export const useImageGeneratorState = () => {
  const { data: modelConfigs } = useModelConfigs();
  const [prompt, setPrompt] = useState('');
  const [seed, setSeed] = useState(0);
  const [randomizeSeed, setRandomizeSeed] = useState(true);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(4);
  const [model, setModel] = useState('turbo');
  const [activeTab, setActiveTab] = useState('images');
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [useAspectRatio, setUseAspectRatio] = useState(true);
  const [quality, setQuality] = useState("HD");
  const [modelSidebarOpen, setModelSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [fullScreenViewOpen, setFullScreenViewOpen] = useState(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);
  const [generatingImages, setGeneratingImages] = useState([]);
  const [activeView, setActiveView] = useState('myImages');
  const [nsfwEnabled, setNsfwEnabled] = useState(false);
  const [style, setStyle] = useState(null);
  const [imageCount, setImageCount] = useState(1);

  useEffect(() => {
    if (modelConfigs) {
      if (nsfwEnabled) {
        setModel('nsfwMaster');
        setSteps(modelConfigs['nsfwMaster']?.defaultStep || 35);
      } else {
        setModel('turbo');
        setSteps(modelConfigs['turbo']?.defaultStep || 4);
      }
    }
  }, [nsfwEnabled, modelConfigs]);

  return {
    prompt, setPrompt,
    seed, setSeed,
    randomizeSeed, setRandomizeSeed,
    width, setWidth,
    height, setHeight,
    steps, setSteps,
    model, setModel,
    activeTab, setActiveTab,
    aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio,
    quality, setQuality,
    modelSidebarOpen, setModelSidebarOpen,
    selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen,
    fullScreenViewOpen, setFullScreenViewOpen,
    fullScreenImageIndex, setFullScreenImageIndex,
    generatingImages, setGeneratingImages,
    activeView, setActiveView,
    nsfwEnabled, setNsfwEnabled,
    style, setStyle,
    imageCount, setImageCount
  };
};