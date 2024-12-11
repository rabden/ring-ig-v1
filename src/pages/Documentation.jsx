import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Wand2,
  Image as ImageIcon,
  Settings,
  Sparkles,
  Share2,
  Lock,
  Palette,
  ChevronRight,
  Play,
  Lightbulb,
  Zap,
  Code,
  Key,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useModelConfigs } from '@/hooks/useModelConfigs';

const sections = [
  { id: 'getting-started', title: 'Getting Started', icon: Play },
  { id: 'features', title: 'Features', icon: Sparkles },
  { id: 'advanced-techniques', title: 'Advanced Techniques', icon: Code },
  { id: 'tips', title: 'Tips & Tricks', icon: Lightbulb },
  { id: 'resources', title: 'Resources', icon: ImageIcon }
];

const gradientStyles = {
  meshGradient1: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-400 via-pink-500 to-red-500",
  meshGradient2: "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-400 via-cyan-400 to-blue-500",
  meshGradient3: "bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-pink-500",
  textGradient1: "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600",
  textGradient2: "bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-600",
  textGradient3: "bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600",
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="group hover:-translate-y-1 transition-all duration-300"
  >
    <Card className="p-6 h-full hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const VideoPlaceholder = ({ title }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
    className="relative aspect-video rounded-lg bg-muted/30 overflow-hidden group cursor-pointer"
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Play className="h-8 w-8 text-primary" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
      <p className="text-sm font-medium">{title}</p>
    </div>
  </motion.div>
);

const InteractivePromptBuilder = () => {
  const [prompt, setPrompt] = useState('A mountain landscape');
  const [showEnhanced, setShowEnhanced] = useState(false);

  const enhancePrompt = () => {
    setShowEnhanced(true);
    setPrompt('A majestic mountain landscape at sunset, dramatic lighting, snow-capped peaks, volumetric clouds, ultra detailed, 8k resolution');
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">Your Prompt</p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowEnhanced(false)}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
        <p className="text-muted-foreground">{prompt}</p>
      </div>
      {!showEnhanced && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={enhancePrompt}
          className="w-full"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Enhance Prompt
        </Button>
      )}
    </div>
  );
};

const heroImages = [
  "/hero-1.jpg", // Replace with actual image paths
  "/hero-2.jpg",
  "/hero-3.jpg",
  "/hero-4.jpg"
];

// Hero Section - Floating Cards Layout
const HeroSection = ({ scrollToSection }) => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-purple-700 via-pink-700 to-red-700 animate-[mesh_20s_linear_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-cyan-700 to-teal-700 mix-blend-multiply animate-[mesh_15s_linear_infinite]" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className={gradientStyles.textGradient1}>Create</span>{' '}
              <span className={gradientStyles.textGradient2}>Amazing</span>{' '}
              <span className={gradientStyles.textGradient3}>AI Art</span>
            </h1>
            <p className="text-xl text-white/80">
              Unleash your creativity with our powerful AI image generation platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={() => scrollToSection('getting-started')}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md"
              >
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="relative grid grid-cols-2 gap-4 p-4">
            {heroImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative aspect-square rounded-lg overflow-hidden"
                style={{
                  transform: `translateY(${index % 2 ? '2rem' : '-2rem'})`,
                }}
              >
                <img
                  src={image}
                  alt={`AI Art ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Models Section - 3D Carousel
const ModelShowcase = () => {
  const { data: modelConfigs } = useModelConfigs();
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const models = Object.entries(modelConfigs || {})
    .filter(([_, config]) => config.category !== "NSFW")
    .map(([key, config]) => ({
      id: key,
      ...config,
      description: getModelDescription(key)
    }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModelIndex((prev) => (prev + 1) % models.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [models.length]);

  return (
    <div className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute inset-0 ${gradientStyles.meshGradient2} animate-[mesh_20s_linear_infinite]`} />
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className={gradientStyles.textGradient2}>AI Models</span>
          </h2>
          
          <div className="relative w-full max-w-5xl mx-auto perspective">
            {models.map((model, index) => {
              const isActive = index === currentModelIndex;
              const offset = index - currentModelIndex;
              
              return (
                <motion.div
                  key={model.id}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.8,
                    x: `${offset * 100}%`,
                    rotateY: offset * -15,
                    zIndex: models.length - Math.abs(offset),
                    opacity: isActive ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 left-0 w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
                    <h3 className="text-2xl font-bold mb-4">{model.name}</h3>
                    <p className="text-white/80 mb-6">{model.description}</p>
                    <div className="flex gap-2">
                      <Badge className="bg-white/20">{model.category}</Badge>
                      {model.isPremium && (
                        <Badge className={gradientStyles.meshGradient1}>Premium</Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Section - Floating Grid
const FeatureShowcase = () => {
  const features = [
    {
      title: "Multiple AI Models",
      description: "Choose from various specialized models for different styles.",
      icon: Wand2,
      color: "from-purple-400 to-pink-600"
    },
    {
      title: "Advanced Controls",
      description: "Fine-tune your generations with precise controls.",
      icon: Settings,
      color: "from-blue-400 to-cyan-600"
    },
    {
      title: "Community Features",
      description: "Share and get inspired by the community.",
      icon: Share2,
      color: "from-emerald-400 to-teal-600"
    },
    {
      title: "Privacy Controls",
      description: "Keep your creations private or public.",
      icon: Lock,
      color: "from-orange-400 to-red-600"
    }
  ];

  return (
    <div className="relative min-h-[80vh] py-24">
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute inset-0 ${gradientStyles.meshGradient3} animate-[mesh_20s_linear_infinite]`} />
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">
          <span className={gradientStyles.textGradient3}>Features</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                   style={{ backgroundImage: `linear-gradient(to right, ${feature.color})` }} />
              
              <div className="relative bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get model descriptions
const getModelDescription = (modelId) => {
  const descriptions = {
    turbo: "Lightning-fast generation optimized for speed while maintaining quality. Perfect for rapid prototyping and quick iterations.",
    flux: "Our balanced model offering great quality and reasonable speed. The go-to choice for most creative projects.",
    fluxDev: "Premium high-fidelity model with enhanced detail and coherence. Ideal for professional-grade creations.",
    ultra: "The ultimate in image quality, pushing the boundaries of what's possible with AI generation."
  };
  return descriptions[modelId] || "";
};

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowMobileNav(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection scrollToSection={scrollToSection} />
      <ModelShowcase />
      <FeatureShowcase />
      {/* ... rest of the sections ... */}
      
      {/* Mobile Navigation */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <ScrollArea className="h-12" orientation="horizontal">
          <div className="flex gap-2 px-2">
            {sections.map(({ id, title, icon: Icon }) => (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(id)}
                className="bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 whitespace-nowrap"
              >
                <Icon className="h-4 w-4 mr-2" />
                {title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Documentation;