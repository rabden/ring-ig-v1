import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { AuthUI } from '@/integrations/supabase/components/AuthUI';
import LoadingScreen from '@/components/LoadingScreen';
import { Typewriter } from 'react-simple-typewriter';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

const DISPLAY_DURATION = 5000;
const TYPE_DELAY = 2000;

const TypewriterWrapper = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 300); // Short delay for smooth transition
    }, TYPE_DELAY + 2000); // Wait for typing + 2 seconds display

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={currentTextIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Typewriter
            words={[texts[currentTextIndex]]}
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={0}
            delaySpeed={0}
            loop={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
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
    <div className="min-h-screen flex flex-col md:flex-row bg-background/95 backdrop-blur-sm relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(var(--primary-rgb),0.15),transparent_50%)] animate-mesh pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--primary-rgb),0.15),transparent_50%)] animate-mesh pointer-events-none" />

      {/* Left side with background image */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full md:w-3/5 md:min-h-screen relative overflow-hidden group"
      >
        <div className="relative w-full pb-[100%] md:pb-0 md:h-full">
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 reflection-wrapper"
              >
                {/* Main Image */}
                <div className="relative w-full h-full">
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
                      WebkitImageSmoothing: "high",
                      imageSmoothing: "high"
                    }}
                  />
                  
                  {/* Reflection Container */}
                  <div className={cn(
                    "absolute w-full md:w-1/3 h-1/3 md:h-full",
                    "bottom-0 md:right-0",
                    "overflow-hidden",
                    "opacity-30 group-hover:opacity-40 transition-opacity duration-300"
                  )}>
                    {/* Reflection Image */}
                    <img
                      src={images[currentImageIndex]}
                      alt=""
                      className={cn(
                        "w-full h-full object-cover",
                        "scale-y-[-1] md:scale-x-[-1] md:scale-y-100",
                        "transform-gpu",
                        "opacity-50"
                      )}
                      style={{
                        maskImage: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))",
                        WebkitMaskImage: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))"
                      }}
                    />
                  </div>
                </div>
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