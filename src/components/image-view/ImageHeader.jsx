import React from 'react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../profile/ProfileAvatar';
import FollowButton from '../social/FollowButton';
import ImagePrivacyToggle from './ImagePrivacyToggle';
import LikeButton from '../LikeButton';

const ImageHeader = ({ owner, image, isOwner, userLikes, toggleLike, likeCount }) => {
  return (
    <div className="flex items-center justify-between">
      <Link to={`/profile/${owner?.display_name}`} className="flex items-center gap-2 hover:opacity-80">
        <ProfileAvatar user={{ user_metadata: { avatar_url: owner?.avatar_url } }} size="sm" />
        <span className="text-sm font-medium">{owner?.display_name}</span>
      </Link>
      <div className="flex items-center gap-2">
        {!isOwner && owner && <FollowButton targetUserId={owner.id} />}
        <ImagePrivacyToggle image={image} isOwner={isOwner} />
        <div className="flex items-center gap-1">
          <LikeButton 
            isLiked={userLikes?.includes(image.id)} 
            onToggle={() => toggleLike(image.id)} 
          />
          <span className="text-xs text-muted-foreground">{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageHeader;