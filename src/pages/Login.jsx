import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Typewriter } from 'react-simple-typewriter';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';

const messages = [
  { 
    text: "Create stunning AI art with Ring.1", 
    image: "/assets/showcase/1.jpg",
    description: "Experience the power of advanced AI image generation"
  },
  { 
    text: "Transform your ideas into reality", 
    image: "/assets/showcase/2.jpg",
    description: "Turn your imagination into beautiful visuals"
  },
  { 
    text: "Join our creative community", 
    image: "/assets/showcase/3.jpg",
    description: "Share, inspire, and connect with fellow creators"
  },
  { 
    text: "Professional quality, instant results", 
    image: "/assets/showcase/4.jpg",
    description: "Generate high-resolution images in seconds"
  }
];

const Login = () => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Showcase */}
      <div className="hidden md:flex flex-col w-1/2 bg-[#0A2A36] text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex-grow">
            {/* Logo and Brand */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Ring.1
              </h1>
              <p className="text-lg text-gray-300 mt-2">
                AI Image Generation Platform
              </p>
            </div>

            {/* Typewriter Section */}
            <div className="space-y-6">
              <div className="h-16"> {/* Fixed height for typewriter text */}
                <h2 className="text-3xl font-semibold">
                  <Typewriter
                    words={[messages[currentMessageIndex].text]}
                    cursor
                    cursorStyle="_"
                    typeSpeed={50}
                    deleteSpeed={30}
                    delaySpeed={3000}
                  />
                </h2>
              </div>
              <p className="text-gray-300 text-lg">
                {messages[currentMessageIndex].description}
              </p>
            </div>

            {/* Features List */}
            <div className="mt-12">
              <ul className="space-y-4">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced AI Models
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  High-Resolution Output
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Fast Generation Speed
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${messages[currentMessageIndex].image})`,
            opacity: 0.1
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A36] via-[#0A2A36]/95 to-[#0A2A36]/90" />
      </div>

      {/* Right side - Auth UI */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <SupabaseAuthUI />
        </div>
      </div>
    </div>
  );
};

export default Login; 