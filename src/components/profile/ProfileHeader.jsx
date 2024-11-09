import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import DisplayNameEditor from './DisplayNameEditor';

const ProfileHeader = ({ 
  user, 
  isPro, 
  displayName, 
  isEditing, 
  setIsEditing, 
  setDisplayName, 
  onUpdate, 
  onAvatarEdit 
}) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <ProfileAvatar 
        user={user} 
        isPro={isPro} 
        size="lg" 
        onEditClick={onAvatarEdit}
        showEditOnHover={true}
      />
      <div className="text-center space-y-1">
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