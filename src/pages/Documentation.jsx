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

const glowStyles = {
  heroGlow: "after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_50%)] after:animate-mesh after:-z-10",
  cardGlow: "after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.1),transparent_50%)] after:animate-mesh after:-z-10",
  textGlow: "text-shadow-glow",
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

  const currentModel = models[currentModelIndex];

  return (
    <div className="relative">
      {/* Background gradient for the section */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(var(--primary-rgb),0.15),transparent_50%)] animate-mesh" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--primary-rgb),0.15),transparent_50%)] animate-mesh" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
        {/* Model Info */}
        <motion.div
          key={currentModel?.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="space-y-6 relative"
        >
          <div className={glowStyles.cardGlow}>
            <Badge 
              variant="outline" 
              className="mb-2 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent border-primary/30 backdrop-blur-sm"
            >
              Model
            </Badge>
            <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-transparent bg-clip-text text-transparent ${glowStyles.textGlow}`}>
              {currentModel?.name}
            </h3>
            <p className="text-muted-foreground backdrop-blur-sm">{currentModel?.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-secondary/50 via-secondary/30 to-transparent backdrop-blur-sm"
            >
              {currentModel?.category}
            </Badge>
            {currentModel?.isPremium && (
              <Badge 
                variant="default" 
                className="bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 animate-gradient-x backdrop-blur-sm"
              >
                Premium
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Model Image */}
        <motion.div
          key={`image-${currentModel?.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative aspect-square rounded-lg overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
          <img
            src={`/model-examples/${currentModel?.id}.jpg`}
            alt={currentModel?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.1),transparent_70%)] animate-mesh" />
        </motion.div>
      </div>
    </div>
  );
};

const FeatureShowcase = () => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const features = [
    {
      title: "Multiple AI Models",
      description: "Choose from various specialized models, each optimized for different artistic styles and purposes.",
      icon: Wand2,
      image: "/feature-models.jpg" // Replace with actual image path
    },
    {
      title: "Advanced Controls",
      description: "Fine-tune your generations with precise controls over size, quality, and style variations.",
      icon: Settings,
      image: "/feature-controls.jpg"
    },
    {
      title: "Community Features",
      description: "Share your creations, follow other artists, and get inspired by the community gallery.",
      icon: Share2,
      image: "/feature-community.jpg"
    },
    {
      title: "Privacy Controls",
      description: "Keep your generations private or share them with the world. You're in control.",
      icon: Lock,
      image: "/feature-privacy.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentFeature = features[currentFeatureIndex];

  return (
    <div className="relative">
      {/* Background gradient for the section */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.1),transparent_50%)] animate-mesh" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(var(--primary-rgb),0.1),transparent_50%)] animate-mesh" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
        {/* Feature Info */}
        <motion.div
          key={currentFeature.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="space-y-6 relative"
        >
          <div className={glowStyles.cardGlow}>
            <Badge 
              variant="outline" 
              className="mb-2 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent border-primary/30 backdrop-blur-sm"
            >
              Feature
            </Badge>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/30 via-primary/20 to-transparent backdrop-blur-sm">
                <currentFeature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-transparent bg-clip-text text-transparent ${glowStyles.textGlow}`}>
                {currentFeature.title}
              </h3>
            </div>
            <p className="text-muted-foreground backdrop-blur-sm">{currentFeature.description}</p>
          </div>
        </motion.div>

        {/* Feature Image */}
        <motion.div
          key={`image-${currentFeature.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative aspect-square rounded-lg overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
          <img
            src={currentFeature.image}
            alt={currentFeature.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.1),transparent_70%)] animate-mesh" />
        </motion.div>
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border-b`}>
        {/* Add meshing gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(var(--primary-rgb),0.15),transparent_50%)] animate-mesh" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--primary-rgb),0.15),transparent_50%)] animate-mesh" />
        
        <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16 lg:py-24">
          <Link to="/" className="inline-block mb-8">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 space-y-6"
            >
              <Badge 
                className="mb-4 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/10 backdrop-blur-sm" 
                variant="secondary"
              >
                Documentation
              </Badge>
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent ${glowStyles.textGlow}`}>
                Create Amazing AI Art
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 backdrop-blur-sm">
                Learn how to use our powerful AI image generation platform to bring your creative vision to life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => scrollToSection('getting-started')}
                  className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Quick Start Guide
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5 backdrop-blur-sm"
                >
                  Watch Tutorial
                </Button>
              </div>
            </motion.div>

            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className={`relative aspect-square rounded-lg overflow-hidden shadow-2xl shadow-primary/20 ${glowStyles.heroGlow} hidden md:block`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
              <img
                src={heroImages[currentHeroImage]}
                alt="AI Art Example"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.2),transparent_70%)] rounded-full blur-3xl animate-mesh" />
        <div className="absolute -bottom-24 right-48 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.25),transparent_70%)] rounded-full blur-2xl animate-mesh" />
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* Model Showcase Section */}
        <section id="models" className="mb-24 scroll-mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Badge variant="outline" className="mb-2 bg-gradient-to-r from-primary/20 to-primary/10 border-primary/20">
              Models
            </Badge>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Powerful AI Models
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose from our suite of specialized models, each optimized for different use cases.
            </p>
          </motion.div>

          <ModelShowcase />
        </section>

        {/* Features Section */}
        <section id="features" className="mb-24 scroll-mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Badge variant="outline" className="mb-2 bg-gradient-to-r from-primary/20 to-primary/10 border-primary/20">
              Features
            </Badge>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Powerful Creation Tools
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to create stunning AI-generated artwork.
            </p>
          </motion.div>

          <FeatureShowcase />
        </section>

        {/* Getting Started Section */}
        <section id="getting-started" className="mb-24 scroll-mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Badge variant="outline" className="mb-2">Getting Started</Badge>
            <h2 className="text-3xl font-bold mb-4">Start Creating in Minutes</h2>
            <p className="text-xl text-muted-foreground">Follow our simple guide to begin generating amazing AI art.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <VideoPlaceholder title="Quick Start Tutorial" />
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Enter Your Prompt",
                  description: "Describe your desired image in detail. The more specific you are, the better the results will be."
                },
                {
                  step: 2,
                  title: "Choose Your Settings",
                  description: "Select your preferred model and adjust settings like size, quality, and style to match your vision."
                },
                {
                  step: 3,
                  title: "Generate & Share",
                  description: "Click generate and watch your idea come to life. Save your favorites and share them with the community."
                }
              ].map(({ step, title, description }) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: step * 0.2 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section id="advanced-techniques" className="mb-24 scroll-mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Badge variant="outline" className="mb-2">Advanced Techniques</Badge>
            <h2 className="text-3xl font-bold mb-4">Master AI Art Creation</h2>
            <p className="text-xl text-muted-foreground">Take your generations to the next level with advanced techniques.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Prompt Engineering</h3>
                  <p className="text-muted-foreground">
                    Learn the art of crafting effective prompts that consistently produce amazing results.
                  </p>
                </div>
              </div>
              <InteractivePromptBuilder />
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Key className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Style Keywords</h3>
                  <p className="text-muted-foreground">
                    Use these powerful keywords to influence the style of your generations.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "cinematic", "photorealistic", "anime", "digital art",
                  "oil painting", "watercolor", "concept art", "illustration",
                  "3D render", "studio lighting"
                ].map((style, i) => (
                  <TooltipProvider key={i}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant="secondary"
                          className="text-sm cursor-help"
                        >
                          {style}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to copy this style keyword</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Tips & Tricks */}
        <section id="tips" className="mb-24 scroll-mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Badge variant="outline" className="mb-2">Tips & Tricks</Badge>
            <h2 className="text-3xl font-bold mb-4">Pro Tips for Better Results</h2>
            <p className="text-xl text-muted-foreground">Expert advice to help you create better images.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Lightbulb,
                title: "Be Specific",
                tips: [
                  "Use detailed descriptions",
                  "Specify lighting conditions",
                  "Include style references",
                  "Mention camera angles"
                ]
              },
              {
                icon: Settings,
                title: "Optimize Settings",
                tips: [
                  "Higher steps for detail",
                  "Use seed for consistency",
                  "Match aspect ratio to need",
                  "Balance quality vs speed"
                ]
              },
              {
                icon: Palette,
                title: "Style Mastery",
                tips: [
                  "Combine multiple styles",
                  "Use artistic references",
                  "Experiment with models",
                  "Save successful prompts"
                ]
              }
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.tips.map((tip, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (i * 0.2) + (j * 0.1) }}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <ChevronRight className="h-4 w-4 text-primary" />
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" className="scroll-mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Badge variant="outline" className="mb-2">Resources</Badge>
            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
            <p className="text-xl text-muted-foreground">Helpful resources to expand your knowledge.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <VideoPlaceholder title="Advanced Prompt Engineering Tutorial" />
            <VideoPlaceholder title="Creating Consistent Character Designs" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Documentation;