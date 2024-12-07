import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Typewriter } from 'react-simple-typewriter';
import { SupabaseAuthUI } from '@/integrations/supabase/auth';

const messages = [
  { text: "You ask, Lovable builds beautiful images.", image: "/assets/showcase/1.jpg" },
  { text: "Create stunning AI art with just a prompt.", image: "/assets/showcase/2.jpg" },
  { text: "Join our creative community today.", image: "/assets/showcase/3.jpg" },
  { text: "Transform your ideas into visual masterpieces.", image: "/assets/showcase/4.jpg" }
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
      {/* Left side - Typewriter and Images */}
      <div className="hidden md:flex flex-col w-1/2 bg-[#0A2A36] text-white p-12 relative">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-8">Your fullstack product engineer.</h1>
            <div className="h-24"> {/* Fixed height for typewriter text */}
              <Typewriter
                words={[messages[currentMessageIndex].text]}
                cursor
                cursorStyle="_"
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={3000}
              />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-lg">Made with love in Stockholm.</p>
          </div>
        </div>
        {/* Background image with transition */}
        <div 
          className="absolute inset-0 opacity-10 transition-opacity duration-1000 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${messages[currentMessageIndex].image})`,
            zIndex: 0 
          }}
        />
      </div>

      {/* Right side - Auth UI */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <SupabaseAuthUI />
        </div>
      </div>
    </div>
  );
};

export default Login; 