import React from 'react';
import SignInDialog from '@/components/SignInDialog';

const AuthOverlay = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Welcome to RING IG</h3>
        <p className="text-muted-foreground mb-8">Sign in to start generating images</p>
        <SignInDialog />
      </div>
    </div>
  );
};

export default AuthOverlay;