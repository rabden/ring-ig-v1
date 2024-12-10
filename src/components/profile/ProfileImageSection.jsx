import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

const ProfileImageSection = ({ user, isPro, onImageUpload, onShowFullImage }) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div 
              onClick={onShowFullImage}
              className="cursor-pointer hover:opacity-90 transition-opacity relative group"
            >
              <ProfileAvatar 
                user={user} 
                isPro={isPro} 
                size="xl" 
                className="w-32 h-32"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              onClick={() => document.getElementById('avatar-input').click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageUpload}
            />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {user?.user_metadata?.display_name || user?.email?.split('@')[0]}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            {isPro && (
              <span className="inline-block mt-2 text-sm bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 text-transparent bg-clip-text font-medium">
                Pro User
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageSection;