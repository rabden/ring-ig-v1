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
    image: "https://i.ibb.co.com/TgcCsdf/HDRDC2.webp",
    color: "from-blue-500/20 to-purple-500/20"
  },
  { 
    text: "Transform your imagination into reality", 
    image: "https://i.ibb.co.com/88P57s7/ID2.png",
    color: "from-emerald-500/20 to-cyan-500/20"
  },
  { 
    text: "Generate multiple styles with one click", 
    image: "https://i.ibb.co.com/k2YdjZK/images-example-7y3r4uk1q.jpg",
    color: "from-amber-500/20 to-orange-500/20"
  },
  { 
    text: "Share and remix creations with the community", 
    image: "https://i.ibb.co.com/sbmM5mp/3d-style-2.jpg",
    color: "from-pink-500/20 to-rose-500/20"
  },
  { 
    text: "Fine-tune your art with advanced controls", 
    image: "https://i.ibb.co.com/8PnDLkf/1.png",
    color: "from-violet-500/20 to-indigo-500/20"
  }
];

const DISPLAY_DURATION = 5000; // 5 seconds per image

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

  const nextIndex = (currentIndex + 1) % messages.length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "min-h-screen flex flex-col md:flex-row",
        "bg-background",
        "transition-colors duration-300"
      )}
    >
      {/* Left side with background image */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full md:w-3/5 md:min-h-screen"
      >
        <div className={cn(
          "relative w-full pb-[100%] md:pb-0 md:h-full",
          "overflow-hidden rounded-none md:rounded-r-3xl",
          "shadow-2xl",
          "transition-all duration-300"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className={cn(
                "absolute inset-0 z-10",
                "bg-gradient-to-br",
                messages[currentIndex].color,
                "mix-blend-overlay",
                "transition-opacity duration-500"
              )} />
              <img
                src={messages[currentIndex].image}
                alt="Feature showcase"
                className={cn(
                  "w-full h-full object-cover",
                  "transition-transform duration-[2000ms]",
                  "hover:scale-105"
                )}
                onLoad={() => setIsImageLoading(false)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right side - Auth UI */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "w-full md:w-2/5",
          "flex items-center justify-center",
          "p-8 md:p-12",
          "bg-background/95 backdrop-blur-sm",
          "md:bg-background md:backdrop-blur-none",
          "border-t md:border-t-0 md:border-l border-border",
          "transition-all duration-300"
        )}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-[360px] space-y-8 md:space-y-10"
        >
          <div className="space-y-4 md:space-y-6 text-center">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={cn(
                "text-2xl md:text-4xl font-bold",
                "bg-gradient-to-r from-primary to-primary/80",
                "bg-clip-text text-transparent",
                "transition-colors duration-300"
              )}
            >
              Welcome to Ring
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={cn(
                "text-base md:text-xl",
                "text-foreground/90",
                "min-h-[2.5rem] md:min-h-[3rem]",
                "transition-colors duration-300"
              )}
            >
              <Typewriter
                words={messages.map(msg => msg.text)}
                cursor
                cursorStyle="_"
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={2000}
                loop={true}
              />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-4 md:space-y-6"
          >
            <AuthUI buttonText="Continue with Google" />
            <p className={cn(
              "text-center text-xs md:text-sm",
              "text-muted-foreground/80",
              "transition-colors duration-300"
            )}>
              By continuing, you agree to our{' '}
              <a 
                href="/terms" 
                className={cn(
                  "text-primary hover:text-primary/80",
                  "underline-offset-4 hover:underline",
                  "transition-colors duration-200"
                )}
              >
                Terms of Service
              </a>
              {' '}and{' '}
              <a 
                href="/privacy" 
                className={cn(
                  "text-primary hover:text-primary/80",
                  "underline-offset-4 hover:underline",
                  "transition-colors duration-200"
                )}
              >
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;