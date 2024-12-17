import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { AuthUI } from '@/integrations/supabase/components/AuthUI';
import LoadingScreen from '@/components/LoadingScreen';
import { Typewriter } from 'react-simple-typewriter';

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

const Login = () => {
  const { session, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    console.log('Auth state changed:', { session, loading });
    if (session) {
      const from = location.state?.from?.pathname || '/';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [session, loading, navigate, location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side - Showcase */}
      <div className="flex flex-col w-full md:w-1/2 bg-background text-white relative">
        <div className="flex flex-col h-full p-8 md:p-12">
          {/* Image Section */}
          <div className="flex-grow flex items-center justify-center mb-4 md:mb-8">
            <div className="w-full max-w-md aspect-square relative overflow-hidden rounded-lg">
              <img
                src={messages[currentMessageIndex].image}
                alt="Feature showcase"
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Gradient overlay for image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30" />
            </div>
          </div>
          
          {/* Text Section */}
          <div className="text-center space-y-2 md:space-y-4">
            <div className="min-h-[4rem] flex items-center justify-center">
              <h4 className="text-lg md:text-xl font-semibold">
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
        <div className="w-full max-w-[300px]">
          <AuthUI buttonText="Continue with Google" />
        </div>
      </div>
    </div>
  );
};

export default Login;