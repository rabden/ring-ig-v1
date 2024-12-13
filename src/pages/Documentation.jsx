import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Welcome to Our Image Generation Platform</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to our AI-powered image generation platform! This guide will help you understand
                how to make the most of our features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">Image Generation</h3>
                  <p className="text-muted-foreground">
                    Create unique images using our advanced AI models. Choose from different styles
                    and quality settings to get the perfect result.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Multiple Models</h3>
                  <p className="text-muted-foreground">
                    Access various AI models optimized for different types of image generation,
                    from quick sketches to highly detailed artwork.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Credit System</h3>
                  <p className="text-muted-foreground">
                    Your account comes with credits that refresh periodically. Different quality
                    settings use different amounts of credits.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Tips for Better Results</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Be specific in your prompts for better results</li>
                <li>Experiment with different styles to find what works best</li>
                <li>Use the aspect ratio controls to get the right image dimensions</li>
                <li>Save your favorite generations to your gallery</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Documentation;