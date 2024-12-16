import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { AuthUI } from '@/integrations/supabase/components/AuthUI';
import LoadingScreen from '@/components/LoadingScreen';
import { Typewriter } from 'react-simple-typewriter';
import { cn } from "@/lib/utils";

const messages = [
  { 
    text: "Create stunning AI art with a single prompt", 
    image: "/showcase-1.png"
  },
  { 
    text: "Transform your imagination into reality", 
    image: "/showcase-2.png"
  },
  { 
    text: "Generate multiple styles with one click", 
    image: "/showcase-3.png"
  },
  { 
    text: "Share and remix creations with the community", 
    image: "/showcase-4.png"
  },
  { 
    text: "Fine-tune your art with advanced controls", 
    image: "/showcase-5.png"
  }
];

const Login = () => {
  const { session, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (session) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [session, loading, navigate, location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      setIsImageLoaded(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side - Showcase */}
      <div className="relative flex flex-col w-full md:w-1/2 bg-background/40 backdrop-blur-sm">
        <div className="flex flex-col h-full p-8 md:p-12">
          {/* Image Section */}
          <div className="flex-grow flex items-center justify-center mb-6 md:mb-10">
            <div className={cn(
              "w-full max-w-md aspect-square relative overflow-hidden",
              "rounded-2xl border border-border/20",
              "shadow-[0_0_0_1px] shadow-border/10",
              "transition-all duration-500"
            )}>
              <img
                src={messages[currentMessageIndex].image}
                alt="Feature showcase"
                className={cn(
                  "w-full h-full object-cover",
                  "transition-all duration-500",
                  isImageLoaded ? "opacity-100" : "opacity-0",
                  "scale-[1.02] hover:scale-[1.04]"
                )}
                onLoad={() => setIsImageLoaded(true)}
              />
              {/* Gradient overlay for image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/40" />
            </div>
          </div>
          
          {/* Text Section */}
          <div className="text-center space-y-3 md:space-y-4">
            <div className="min-h-[4rem] flex items-center justify-center px-4">
              <h4 className="text-lg md:text-xl font-semibold text-foreground/90">
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

        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        </div>
      </div>

      {/* Right side - Auth UI */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-[320px] relative">
          <div className="absolute inset-0 -m-4 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent blur-2xl" />
          <div className="relative">
            <AuthUI buttonText="Continue with Google" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;