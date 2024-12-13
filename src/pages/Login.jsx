import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Typewriter } from 'react-simple-typewriter';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';

const messages = [
  { 
    text: "Create stunning AI art with a single prompt", 
    image: "/placeholder.svg"
  },
  { 
    text: "Transform your imagination into reality", 
    image: "/placeholder.svg"
  },
  { 
    text: "Generate multiple styles with one click", 
    image: "/placeholder.svg"
  },
  { 
    text: "Share and remix creations with the community", 
    image: "/placeholder.svg"
  },
  { 
    text: "Fine-tune your art with advanced controls", 
    image: "/placeholder.svg"
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
      <div className="hidden md:flex flex-col w-1/2 bg-[#0A2A36] text-white relative">
        <div className="flex flex-col h-full p-12">
          {/* Image Section */}
          <div className="flex-grow flex items-center justify-center mb-8">
            <div className="w-full max-w-md aspect-square relative overflow-hidden rounded-lg">
              <img
                src={messages[currentMessageIndex].image}
                alt="Feature showcase"
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Gradient overlay for image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A2A36]/30" />
            </div>
          </div>
          
          {/* Text Section */}
          <div className="text-center space-y-4">
            <div className="min-h-[4rem] flex items-center justify-center">
              <h4 className="text-xl font-semibold">
                <Typewriter
                  words={messages.map(msg => msg.text)}
                  cursor
                  cursorStyle="_"
                  typeSpeed={50}
                  deleteSpeed={30}
                  delaySpeed={3000}
                  loop={true}
                />
              </h4>
            </div>
          </div>
        </div>
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