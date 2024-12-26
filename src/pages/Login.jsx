import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { AuthUI } from '@/integrations/supabase/components/AuthUI';
import LoadingScreen from '@/components/LoadingScreen';
import { Typewriter } from 'react-simple-typewriter';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MeshGradient } from '@/components/ui/mesh-gradient';

const texts = [
  "Create stunning AI art with a single prompt",
  "Transform your imagination into reality",
  "Generate multiple styles with one click",
  "Share and remix creations with the community",
  "Fine-tune your art with advanced controls",
  "Explore endless creative possibilities",
  "Join a community of AI artists"
];

const images = [
  "https://i.ibb.co.com/TgcCsdf/HDRDC2.webp",
  "https://i.ibb.co.com/hc3dWxr/images-example-zgfn69jth.jpg",
  "https://i.ibb.co.com/rs5g7Xz/3.png",
  "https://i.ibb.co.com/8PnDLkf/1.png",
  "https://i.ibb.co.com/88P57s7/ID2.png",
  "https://i.ibb.co.com/gjrM8R5/out-0-1.webp",
  "https://i.ibb.co.com/DkdtLrG/Comfy-UI-00047.png",
  "https://i.ibb.co.com/NNWjs4d/A3.png",
  "https://i.ibb.co.com/nkxPsYG/images-2.jpg"
];

const DISPLAY_DURATION = 6000;

const TypewriterWrapper = () => {
  return (
    <Typewriter
      words={texts}
      loop={true}
      cursor={true}
      cursorStyle="|"
      typeSpeed={50}
      deleteSpeed={30}
      delaySpeed={2000}
    />
  );
};

const Login = () => {
  const { session, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [session, loading, navigate, location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsImageLoading(true);
    }, DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background backdrop-blur-sm relative overflow-hidden">
      {/* Left side with background image */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-[50vh] md:h-auto md:w-3/5 relative overflow-hidden"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={images[currentImageIndex]}
                  alt="Feature showcase"
                  onLoad={() => setIsImageLoading(false)}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500",
                    isImageLoading ? "opacity-0" : "opacity-100"
                  )}
                  style={{ 
                    imageRendering: "high-quality",
                    WebkitImageSmoothing: "high"
                  }}
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
        className="w-full h-[50vh] md:h-auto md:w-3/5 flex items-center justify-center p-2 relative"
      >
        <MeshGradient 
          intensity="medium" 
          speed="slow" 
          size={400}
          className="z-0"
          className2="bg-background/5 backdrop-blur-[1px]"
        />
        <div className="w-full space-y-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="space-y-2 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl md:text-3xl font-medium tracking-tight">
                Welcome to
              </h1>
              <div className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Ring Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-3xl md:text-3xl font-medium tracking-tight">
                  ing
                </span>
              </div>
            </div>
            <p className="text-base md:text-lg text-foreground/70 min-h-[2rem] font-normal">
              <TypewriterWrapper />
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