import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import DisplayNameEditor from './DisplayNameEditor';
import FollowStats from '../social/FollowStats';

const ProfileHeader = ({ 
  user, 
  isPro, 
  isEditing, 
  displayName, 
  setDisplayName, 
  onEdit, 
  onUpdate, 
  onEditClick, 
  showEditOnHover 
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <ProfileAvatar 
        user={user} 
        isPro={isPro} 
        size="md" 
        onEditClick={onEditClick}
        showEditOnHover={showEditOnHover}
      />
      <div className="text-center space-y-2">
        <DisplayNameEditor
          isEditing={isEditing}
          displayName={displayName}
          setDisplayName={setDisplayName}
          onEdit={onEdit}
          onUpdate={onUpdate}
          size="md"
        />
        <p className="text-sm text-muted-foreground">{user.email}</p>
        {isPro && <p className="text-sm text-primary">Pro User</p>}
        {user && <FollowStats userId={user.id} />}
      </div>
    </div>
  );
};

export default ProfileHeader;