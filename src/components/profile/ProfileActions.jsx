import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ProfileActions = ({ onLogout }) => {
  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={onLogout}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Log out
    </Button>
  );
};

export default ProfileActions;