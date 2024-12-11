import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Wand2,
  Image,
  Settings,
  Sparkles,
  Share2,
  Lock,
  Palette,
  Sliders,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">Documentation</h1>
            <p className="text-muted-foreground mt-2">
              Everything you need to know about using our AI image generation platform
            </p>
          </div>

          <Tabs defaultValue="getting-started" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Usage</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wand2 className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Quick Start Guide</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">1. Enter Your Prompt</h3>
                    <p className="text-muted-foreground">
                      Start by entering a detailed description of the image you want to create. 
                      The more specific your prompt, the better the results.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">2. Choose Your Settings</h3>
                    <p className="text-muted-foreground">
                      Select your preferred model, image size, and quality settings. Each model has its own strengths
                      for different types of images.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">3. Generate & Save</h3>
                    <p className="text-muted-foreground">
                      Click generate and wait for your image. You can save your favorites to your gallery
                      or share them with the community.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Pro Tips</h2>
                </div>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Use descriptive adjectives for more precise results</li>
                  <li>Experiment with different models for varying artistic styles</li>
                  <li>Save your favorite prompts for future use</li>
                  <li>Check the community gallery for inspiration</li>
                  <li>Use aspect ratio controls for perfect dimensions</li>
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Image className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Multiple Models</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Access various AI models optimized for different styles and purposes.
                    Each model has unique characteristics for specific types of images.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Advanced Controls</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Fine-tune your generations with settings like seed values,
                    quality levels, and aspect ratios.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Share2 className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Community Features</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Share your creations, follow other creators, and get inspired
                    by the community gallery.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Privacy Controls</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Choose to keep your generations private or share them with the
                    community. You're in control of your content.
                  </p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Advanced Techniques</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Prompt Engineering</h3>
                    <p className="text-muted-foreground">
                      Learn how to craft effective prompts using style modifiers,
                      artistic references, and technical specifications.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Seed Management</h3>
                    <p className="text-muted-foreground">
                      Use seed values to recreate specific variations or explore
                      similar images with controlled randomness.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Quality Settings</h3>
                    <p className="text-muted-foreground">
                      Understand how different quality settings affect your generations
                      and credit usage to optimize your workflow.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">How do credits work?</h3>
                    <p className="text-muted-foreground">
                      Credits are used for generating images. Different quality settings and
                      models use different amounts of credits. Pro users get additional
                      credits and features.
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">What are the image size limits?</h3>
                    <p className="text-muted-foreground">
                      Image sizes vary by model but generally range from 512x512 to
                      1024x1024 pixels. Some models support custom aspect ratios.
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Can I edit my generations?</h3>
                    <p className="text-muted-foreground">
                      Yes, you can remix existing images by adjusting the prompt,
                      settings, or using them as a starting point for new generations.
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">What about image rights?</h3>
                    <p className="text-muted-foreground">
                      You own the rights to the images you generate. However, be mindful
                      of using copyrighted content in your prompts.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Documentation;