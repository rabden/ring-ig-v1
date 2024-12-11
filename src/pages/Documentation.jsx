import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Key
} from "lucide-react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group hover:-translate-y-1 transition-all duration-300">
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
  </div>
);

const VideoPlaceholder = ({ title }) => (
  <div className="relative aspect-video rounded-lg bg-muted/30 overflow-hidden group cursor-pointer hover:bg-muted/40 transition-colors">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Play className="h-8 w-8 text-primary" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
      <p className="text-sm font-medium">{title}</p>
    </div>
  </div>
);

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary/5 border-b">
        <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24">
          <Link to="/" className="inline-block mb-8">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>

          <div className="max-w-2xl">
            <Badge className="mb-4" variant="secondary">Documentation</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Amazing AI Art</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn how to use our powerful AI image generation platform to bring your creative vision to life.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg">
                Quick Start Guide
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline">Watch Tutorial</Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-48 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Getting Started Section */}
        <section className="mb-24">
          <div className="mb-12">
            <Badge variant="outline" className="mb-2">Getting Started</Badge>
            <h2 className="text-3xl font-bold mb-4">Start Creating in Minutes</h2>
            <p className="text-xl text-muted-foreground">Follow our simple guide to begin generating amazing AI art.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <VideoPlaceholder title="Quick Start Tutorial" />
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Enter Your Prompt</h3>
                  <p className="text-muted-foreground">
                    Describe your desired image in detail. The more specific you are,
                    the better the results will be.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Choose Your Settings</h3>
                  <p className="text-muted-foreground">
                    Select your preferred model and adjust settings like size, quality,
                    and style to match your vision.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Generate & Share</h3>
                  <p className="text-muted-foreground">
                    Click generate and watch your idea come to life. Save your favorites
                    and share them with the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-24">
          <div className="mb-12">
            <Badge variant="outline" className="mb-2">Features</Badge>
            <h2 className="text-3xl font-bold mb-4">Powerful Creation Tools</h2>
            <p className="text-xl text-muted-foreground">Everything you need to create stunning AI-generated artwork.</p>
          </div>

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
        <section className="mb-24">
          <div className="mb-12">
            <Badge variant="outline" className="mb-2">Advanced Techniques</Badge>
            <h2 className="text-3xl font-bold mb-4">Master AI Art Creation</h2>
            <p className="text-xl text-muted-foreground">Take your generations to the next level with advanced techniques.</p>
          </div>

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
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Basic Prompt</p>
                  <p className="text-muted-foreground">"A mountain landscape"</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Enhanced Prompt</p>
                  <p className="text-muted-foreground">
                    "A majestic mountain landscape at sunset, dramatic lighting, snow-capped peaks,
                    volumetric clouds, ultra detailed, 8k resolution"
                  </p>
                </div>
              </div>
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
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-sm"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Tips & Tricks */}
        <section className="mb-24">
          <div className="mb-12">
            <Badge variant="outline" className="mb-2">Tips & Tricks</Badge>
            <h2 className="text-3xl font-bold mb-4">Pro Tips for Better Results</h2>
            <p className="text-xl text-muted-foreground">Expert advice to help you create better images.</p>
          </div>

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
              <Card key={i} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, j) => (
                    <li key={j} className="flex items-center gap-2 text-muted-foreground">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <div className="mb-12">
            <Badge variant="outline" className="mb-2">Resources</Badge>
            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
            <p className="text-xl text-muted-foreground">Helpful resources to expand your knowledge.</p>
          </div>

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