import React from 'react';
import ProfileAvatar from '../profile/ProfileAvatar';
import FollowButton from '../social/FollowButton';

const ImageCardUserInfo = ({ owner, image }) => {
  if (!owner) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ProfileAvatar user={{ user_metadata: { avatar_url: owner?.avatar_url } }} size="sm" />
        <span className="text-sm font-medium">{owner?.display_name}</span>
      </div>
      <FollowButton targetUserId={image.user_id} size="sm" variant="ghost" />
    </div>
  );
};

export default ImageCardUserInfo;