import React from 'react';
import SignInDialog from '@/components/SignInDialog';

const AuthOverlay = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Sign in to generate images</h3>
        <SignInDialog />
      </div>
    </div>
  );
};

export default AuthOverlay;