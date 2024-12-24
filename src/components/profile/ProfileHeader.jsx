import React from 'react';
import { Upload } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import DisplayNameEditor from './DisplayNameEditor';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const ProfileHeader = ({ 
  user, 
  isPro, 
  displayName, 
  isEditing, 
  setIsEditing, 
  setDisplayName, 
  onUpdate, 
  onAvatarEdit,
  onAvatarUpload
}) => {
  const { data: profile } = useQuery({
    queryKey: ['profileAvatar', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id
  });

  return (
    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
      <div className="relative cursor-pointer" onClick={onAvatarEdit}>
        <ProfileAvatar 
          user={{
            ...user,
            avatar_url: profile?.avatar_url
          }}
          isPro={isPro} 
          size="lg" 
          onEditClick={onAvatarEdit}
          showEditOnHover={true}
        />
      </div>
      <div className="text-center space-y-1 w-full px-2 sm:px-4">
        <DisplayNameEditor
          isEditing={isEditing}
          displayName={displayName}
          setDisplayName={setDisplayName}
          onEdit={() => setIsEditing(true)}
          onUpdate={onUpdate}
          size="lg"
        />
        <p className="text-sm text-muted-foreground">{user.email}</p>
        {isPro && <p className="text-sm text-primary">Pro User</p>}
      </div>
    </div>
  );
};

export default ProfileHeader;