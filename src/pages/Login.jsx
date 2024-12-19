import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { AuthUI } from '@/integrations/supabase/components/AuthUI';
import LoadingScreen from '@/components/LoadingScreen';
import { Typewriter } from 'react-simple-typewriter';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  { 
    text: "Create stunning AI art with a single prompt", 
    image: "https://i.ibb.co.com/TgcCsdf/HDRDC2.webp"
  },
  { 
    text: "Transform your imagination into reality", 
    image: "https://i.ibb.co.com/88P57s7/ID2.png"
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

const DISPLAY_DURATION = 5000;

const Login = () => {
  const { session, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [session, loading, navigate, location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
      setIsImageLoading(true);
    }, DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background/95 backdrop-blur-sm relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(var(--primary-rgb),0.15),transparent_50%)] animate-mesh pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--primary-rgb),0.15),transparent_50%)] animate-mesh pointer-events-none" />

      {/* Left side with background image */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full md:w-3/5 md:min-h-screen relative rounded-none md:rounded-r-[32px] overflow-hidden"
      >
        <div className="relative w-full pb-[100%] md:pb-0 md:h-full">
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/90",
                  "md:bg-gradient-to-r md:from-background/0 md:via-background/0 md:to-background/90",
                  "z-10"
                )} />
                <img
                  src={messages[currentIndex].image}
                  alt="Feature showcase"
                  onLoad={() => setIsImageLoading(false)}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500",
                    isImageLoading ? "scale-105 blur-sm" : "scale-100 blur-0"
                  )}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Right side - Auth UI */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        className="w-full md:w-2/5 flex items-center justify-center p-8 md:p-12 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/0 to-background/20" />
        <div className="w-full max-w-[360px] space-y-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="space-y-4 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight bg-gradient-to-r from-primary via-primary/80 to-foreground bg-clip-text text-transparent">
              Welcome to Ring
            </h1>
            <p className="text-base md:text-xl text-foreground/70 min-h-[3rem] font-normal">
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
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="space-y-4"
          >
            <AuthUI buttonText="Continue with Google" />
            <p className="text-center text-sm text-muted-foreground/60">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;