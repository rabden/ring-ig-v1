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
import { ArrowLeft, Camera, LogOut, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import LoadingScreen from '@/components/LoadingScreen';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const UserProfile = () => {
  const { session, loading, logout } = useSupabaseAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const { data: isPro } = useProUser(session?.user?.id);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 1 });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const imageRef = useRef(null);

  // Set display name when user data is available
  React.useEffect(() => {
    if (session?.user) {
      setDisplayName(session.user?.user_metadata?.display_name || session.user?.email?.split('@')[0] || '');
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

        if (profileResult.error) {
          console.error('Profile fetch error:', profileResult.error);
          return {
            followers: followersResult.count || 0,
            following: followingResult.count || 0,
            likes: likesResult.count || 0,
            credits: 0,
            bonusCredits: 0
          };
        }
        
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

  const handleDisplayNameUpdate = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        const { error } = await supabase.auth.updateUser({
          data: { display_name: displayName }
        });

        if (error) throw error;

        await supabase
          .from('profiles')
          .update({ display_name: displayName })
          .eq('id', session.user.id);

        toast.success("Display name updated successfully");
        setIsEditing(false);
        queryClient.invalidateQueries(['user']);
      } catch (error) {
        toast.error("Failed to update display name");
        console.error('Error updating display name:', error);
      }
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

  const getCroppedImg = async () => {
    try {
      const canvas = document.createElement('canvas');
      const image = imageRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.width; // Keep 1:1 aspect ratio
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.width * scaleY,
        0,
        0,
        crop.width,
        crop.width
      );

      // Convert the canvas to a Blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 1);
      });

      // Create a File from the Blob
      const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      
      const newAvatarUrl = await handleAvatarUpload(croppedFile, session.user.id);
      if (newAvatarUrl) {
        queryClient.invalidateQueries(['user']);
        toast.success("Profile picture updated successfully");
        setShowCropDialog(false);
        setUploadedImage(null);
        setCroppedImageUrl(null);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error("Failed to update profile picture");
    }
  };

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect if not authenticated
  if (!session) {
    navigate('/');
    return null;
  }

  const MAX_CREDITS = 50;
  const creditsProgress = ((userStats?.credits || 0) / MAX_CREDITS) * 100;

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isStatsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div 
                    onClick={() => setShowFullImage(true)}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <ProfileAvatar 
                      user={session.user} 
                      isPro={isPro} 
                      size="xl" 
                      className="w-32 h-32"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                    onClick={() => document.getElementById('avatar-input').click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="text-center w-full max-w-sm">
                  <Textarea
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={handleDisplayNameUpdate}
                    className="text-xl font-medium text-center resize-none"
                    rows={1}
                    placeholder="Enter display name"
                  />
                  <p className="text-muted-foreground mt-1">{session.user.email}</p>
                </div>
              </div>

              <Separator />

              {/* Credits Section */}
              <div className="space-y-2">
                <Label>Credits</Label>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Credits</span>
                  <span>
                    {userStats?.credits || 0} 
                    <span className="text-muted-foreground"> / {MAX_CREDITS}</span>
                    {userStats?.bonusCredits > 0 && (
                      <span className="text-green-500 ml-1">+{userStats.bonusCredits}</span>
                    )}
                  </span>
                </div>
                <Progress value={creditsProgress} className="h-2" />
              </div>

              <Separator />

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-center">
                  <span className="text-2xl font-semibold block">{userStats?.followers || 0}</span>
                  <span className="text-muted-foreground text-sm">Followers</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-semibold block">{userStats?.following || 0}</span>
                  <span className="text-muted-foreground text-sm">Following</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-semibold block">{userStats?.likes || 0}</span>
                  <span className="text-muted-foreground text-sm">Likes</span>
                </div>
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
                  className="text-destructive hover:bg-destructive/10"
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
        <DialogContent className="max-w-screen-lg">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setShowFullImage(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <ProfileAvatar 
              user={session.user} 
              isPro={isPro} 
              size="xl" 
              className="w-full h-full aspect-square"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-screen-lg">
          <div className="space-y-4">
            <div className="relative">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imageRef}
                  src={uploadedImage}
                  alt="Crop"
                  style={{ maxWidth: '100%' }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => {
                setShowCropDialog(false);
                setUploadedImage(null);
              }}>
                Cancel
              </Button>
              <Button onClick={getCroppedImg}>
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