import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="prose prose-invert max-w-none">
          <h1>Welcome to Our Image Generation Platform</h1>
          
          <h2>Getting Started</h2>
          <p>Our platform allows you to generate amazing images using AI. Here's how to get started:</p>
          
          <h3>1. Creating Your First Image</h3>
          <ul>
            <li>Click the "+" button in the navigation bar</li>
            <li>Enter your prompt describing the image you want</li>
            <li>Choose your preferred style and model</li>
            <li>Click "Generate" to create your image</li>
          </ul>

          <h3>2. Managing Your Images</h3>
          <ul>
            <li>View all your generated images in "My Images"</li>
            <li>Download, share, or delete your images</li>
            <li>Get inspired by other users' creations in the "Inspiration" tab</li>
          </ul>

          <h3>3. Credits System</h3>
          <p>Each image generation costs credits. You receive daily free credits, and can earn bonus credits through various activities.</p>

          <h2>Pro Features</h2>
          <ul>
            <li>Access to premium models and styles</li>
            <li>Higher quality image generation</li>
            <li>Custom aspect ratios</li>
            <li>Priority generation queue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Documentation;