import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { AuthUI } from '@/integrations/supabase/components/AuthUI';
import LoadingScreen from '@/components/LoadingScreen';
import { Typewriter } from 'react-simple-typewriter';
import { cn } from '@/lib/utils';

const messages = [
  { 
    text: "Create stunning AI art with a single prompt", 
    image: "https://i.ibb.co.com/TgcCsdf/HDRDC2.webp"
  },
  { 
    text: "Transform your imagination into reality", 
    image: "https://i.ibb.co.com/84bxty7/2.png"
  },
  { 
    text: "Generate multiple styles with one click", 
    image: "https://i.ibb.co.com/k2YdjZK/images-example-7y3r4uk1q.jpg"
  },
  { 
    text: "Share and remix creations with the community", 
    image: "https://i.ibb.co.com/sbmM5mp/3d-style-2.jpg"
  },
  { 
    text: "Fine-tune your art with advanced controls", 
    image: "https://i.ibb.co.com/8PnDLkf/1.png"
  }
];

const TRANSITION_DURATION = 1000; // 1 second for fade transition
const DISPLAY_DURATION = 5000; // 5 seconds per image

const Login = () => {
  const { session, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (session) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [session, loading, navigate, location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }, DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const nextMessageIndex = (currentMessageIndex + 1) % messages.length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side with background image */}
      <div className="relative w-full md:w-3/5 aspect-square md:aspect-auto md:min-h-screen">
        {/* Background images with transition */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}>
          <img
            src={messages[currentMessageIndex].image}
            alt="Feature showcase"
            className="w-full h-full object-cover"
          />
        </div>
        <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isTransitioning ? "opacity-100" : "opacity-0"
        )}>
          <img
            src={messages[nextMessageIndex].image}
            alt="Next feature showcase"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right side - Auth UI */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 bg-background/95 backdrop-blur-sm md:bg-background md:backdrop-blur-none border-t md:border-t-0 md:border-l border-border">
        <div className="w-full max-w-[320px] space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Welcome to Ring
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 min-h-[3rem]">
              <Typewriter
                words={messages.map(msg => msg.text)}
                cursor
                cursorStyle="_"
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={2000}
                loop={true}
              />
            </p>
          </div>

          <div className="space-y-4">
            <AuthUI buttonText="Continue with Google" />
            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;