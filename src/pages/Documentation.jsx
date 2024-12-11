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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Model Info */}
      <motion.div
        key={currentModel?.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <Badge variant="outline" className="mb-2">Model</Badge>
          <h3 className="text-2xl font-bold mb-2">{currentModel?.name}</h3>
          <p className="text-muted-foreground">{currentModel?.description}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {currentModel?.category}
            </Badge>
            {currentModel?.isPremium && (
              <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-purple-500">
                Premium
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Settings className="h-4 w-4" />
              <span>Steps: {currentModel?.inferenceSteps.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Default: {currentModel?.defaultStep} steps</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Model Image */}
      <motion.div
        key={`image-${currentModel?.id}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-square rounded-lg overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <img
          src={`/model-examples/${currentModel?.id}.jpg`}
          alt={currentModel?.name}
          className="w-full h-full object-cover"
        />
      </motion.div>
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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowMobileNav(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setShowMobileNav(!showMobileNav)}
      >
        {showMobileNav ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Navigation Sidebar */}
      <AnimatePresence>
        {(showMobileNav || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`fixed left-0 top-0 bottom-0 w-64 bg-background border-r z-40 
              ${showMobileNav ? 'block' : 'hidden md:block'}`}
          >
            <ScrollArea className="h-full py-8 px-4">
              <div className="space-y-4">
                {sections.map(({ id, title, icon: Icon }) => (
                  <Button
                    key={id}
                    variant={activeSection === id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => scrollToSection(id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-primary/5 border-b">
          <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24">
            <Link to="/" className="inline-block mb-8">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to App
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <Badge className="mb-4" variant="secondary">Documentation</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Amazing AI Art</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Learn how to use our powerful AI image generation platform to bring your creative vision to life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => scrollToSection('getting-started')}>
                  Quick Start Guide
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline">Watch Tutorial</Button>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-24 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 right-48 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
        </div>

        {/* Main Content Sections */}
        <div className="container max-w-6xl mx-auto px-4 py-16">
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

          {/* Features Section */}
          <section id="features" className="mb-24 scroll-mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <Badge variant="outline" className="mb-2">Features</Badge>
              <h2 className="text-3xl font-bold mb-4">Powerful Creation Tools</h2>
              <p className="text-xl text-muted-foreground">Everything you need to create stunning AI-generated artwork.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Wand2}
                title="Multiple AI Models"
                description="Choose from various specialized models, each optimized for different artistic styles and purposes."
              />
              <FeatureCard
                icon={Settings}
                title="Advanced Controls"
                description="Fine-tune your generations with precise controls over size, quality, and style variations."
              />
              <FeatureCard
                icon={Sparkles}
                title="Prompt Enhancement"
                description="AI-powered prompt improvement helps you get better results from your descriptions."
              />
              <FeatureCard
                icon={Share2}
                title="Community Features"
                description="Share your creations, follow other artists, and get inspired by the community gallery."
              />
              <FeatureCard
                icon={Lock}
                title="Privacy Controls"
                description="Keep your generations private or share them with the world. You're in control."
              />
              <FeatureCard
                icon={Zap}
                title="Fast Generation"
                description="Get results quickly with our optimized infrastructure and efficient processing."
              />
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

          {/* Model Showcase Section */}
          <section id="models" className="mb-24 scroll-mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <Badge variant="outline" className="mb-2">Models</Badge>
              <h2 className="text-3xl font-bold mb-4">Powerful AI Models</h2>
              <p className="text-xl text-muted-foreground">
                Choose from our suite of specialized models, each optimized for different use cases.
              </p>
            </motion.div>

            <ModelShowcase />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;