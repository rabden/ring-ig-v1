import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Typewriter } from 'react-simple-typewriter';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';

const messages = [
  { 
    text: "Create stunning AI art with Ring.1", 
    image: "/assets/showcase/1.jpg"
  },
  { 
    text: "Transform your ideas into reality", 
    image: "/assets/showcase/2.jpg"
  },
  { 
    text: "Join our creative community", 
    image: "/assets/showcase/3.jpg"
  },
  { 
    text: "Professional quality, instant results", 
    image: "/assets/showcase/4.jpg"
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
          <div className="flex-grow flex items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-12">
                Ring.1
              </h1>
              <div className="h-16">
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