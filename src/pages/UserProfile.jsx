import React, { useState, useRef } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useProUser } from '@/hooks/useProUser';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { handleAvatarUpload } from '@/utils/profileUtils';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import { ArrowLeft, Camera, LogOut, Upload, X, Save, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import LoadingScreen from '@/components/LoadingScreen';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfile = () => {
  const { session, loading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [tempDisplayName, setTempDisplayName] = useState('');
  const { data: isPro } = useProUser(session?.user?.id);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const cropperRef = useRef(null);
  const inputRef = useRef(null);

  React.useEffect(() => {
    if (session?.user) {
      const name = session.user?.user_metadata?.display_name || session.user?.email?.split('@')[0] || '';
      setDisplayName(name);
      setTempDisplayName(name);
    }
  }, [session]);

  const { data: userStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['userStats', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const [followersResult, followingResult, likesResult, profileResult] = await Promise.all([
          supabase
            .from('user_follows')
            .select('*', { count: 'exact' })
            .eq('following_id', session.user.id),
          supabase
            .from('user_follows')
            .select('*', { count: 'exact' })
            .eq('follower_id', session.user.id),
          supabase
            .from('user_image_likes')
            .select('*', { count: 'exact' })
            .eq('created_by', session.user.id),
          supabase
            .from('profiles')
            .select('credit_count, bonus_credits, followers_count, following_count')
            .eq('id', session.user.id)
            .single()
        ]);

        return {
          followers: profileResult.data?.followers_count || 0,
          following: profileResult.data?.following_count || 0,
          likes: likesResult.count || 0,
          credits: profileResult.data?.credit_count || 0,
          bonusCredits: profileResult.data?.bonus_credits || 0
        };
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
          followers: 0,
          following: 0,
          likes: 0,
          credits: 0,
          bonusCredits: 0
        };
      }
    },
    enabled: !!session?.user?.id
  });

  const handleDisplayNameUpdate = async () => {
    if (tempDisplayName.trim() === displayName.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: tempDisplayName }
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ display_name: tempDisplayName })
        .eq('id', session.user.id);

      setDisplayName(tempDisplayName);
      toast.success("Display name updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries(['user']);
    } catch (error) {
      toast.error("Failed to update display name");
      console.error('Error updating display name:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setShowCropDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async () => {
    try {
      if (!cropperRef.current) return;

      const canvas = cropperRef.current.getCanvas();
      if (!canvas) return;

      const blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 1);
      });

      const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      
      const newAvatarUrl = await handleAvatarUpload(croppedFile, session.user.id);
      if (newAvatarUrl) {
        queryClient.invalidateQueries(['user']);
        toast.success("Profile picture updated successfully");
        setShowCropDialog(false);
        setUploadedImage(null);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error("Failed to update profile picture");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    navigate('/');
    return null;
  }

  const MAX_CREDITS = 50;
  const creditsProgress = ((userStats?.credits || 0) / MAX_CREDITS) * 100;

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-background">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden border-2">
        <CardHeader className="border-b bg-muted/50">
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {isStatsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    <div 
                      onClick={() => setShowFullImage(true)}
                      className="cursor-pointer rounded-full overflow-hidden"
                    >
                      <ProfileAvatar 
                        user={session.user} 
                        isPro={isPro} 
                        size="xl" 
                        className="w-48 h-48 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2"
                      onClick={() => document.getElementById('avatar-input').click()}
                    >
                      <Upload className="h-5 w-5" />
                      Upload New
                    </Button>
                  </motion.div>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Display Name */}
                <div className="text-center w-full max-w-sm space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          <Input
                            ref={inputRef}
                            value={tempDisplayName}
                            onChange={(e) => setTempDisplayName(e.target.value)}
                            className="text-xl font-medium text-center h-11"
                            placeholder="Enter display name"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <Button 
                              size="sm"
                              onClick={handleDisplayNameUpdate}
                              className="h-11"
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setTempDisplayName(displayName);
                                setIsEditing(false);
                              }}
                              className="h-11"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-xl font-medium">{displayName}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setIsEditing(true);
                              setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                            className="h-9 w-9"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
              </div>

              <Separator />

              {/* Credits Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Credits</Label>
                  <span className="text-lg font-medium">
                    {userStats?.credits || 0} 
                    <span className="text-muted-foreground font-normal"> / {MAX_CREDITS}</span>
                    {userStats?.bonusCredits > 0 && (
                      <span className="text-green-500 ml-1">+{userStats.bonusCredits}</span>
                    )}
                  </span>
                </div>
                <Progress value={creditsProgress} className="h-3" />
              </div>

              <Separator />

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="text-center p-4 rounded-lg bg-muted/50"
                >
                  <span className="text-2xl font-semibold block">{userStats?.followers || 0}</span>
                  <span className="text-muted-foreground text-sm">Followers</span>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="text-center p-4 rounded-lg bg-muted/50"
                >
                  <span className="text-2xl font-semibold block">{userStats?.following || 0}</span>
                  <span className="text-muted-foreground text-sm">Following</span>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="text-center p-4 rounded-lg bg-muted/50"
                >
                  <span className="text-2xl font-semibold block">{userStats?.likes || 0}</span>
                  <span className="text-muted-foreground text-sm">Likes</span>
                </motion.div>
              </div>

              <Separator />

              {/* Sign Out Button */}
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Full Image Dialog */}
      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="max-w-screen-lg p-0 overflow-hidden">
          <DialogHeader className="absolute top-2 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={() => setShowFullImage(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="aspect-square">
            <ProfileAvatar 
              user={session.user} 
              isPro={isPro} 
              size="xl" 
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Cropper
                ref={cropperRef}
                src={uploadedImage}
                className="h-full"
                stencilProps={{
                  aspectRatio: 1,
                  grid: true
                }}
                defaultSize={{
                  width: 80,
                  height: 80,
                }}
                stencilSize={{
                  width: 250,
                  height: 250,
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowCropDialog(false);
                  setUploadedImage(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCropComplete}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile; 