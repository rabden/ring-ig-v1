import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../profile/ProfileAvatar';
import FollowButton from '../profile/FollowButton';
import ImagePrivacyToggle from './ImagePrivacyToggle';
import LikeButton from '../LikeButton';
import { useProUser } from '@/hooks/useProUser';

const ImageOwnerHeader = ({ owner, image, isOwner, userLikes, toggleLike, likeCount }) => {
  const navigate = useNavigate();
  const { data: isPro } = useProUser(image.user_id);

  const handleProfileClick = () => {
    navigate(`/profile/${image.user_id}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleProfileClick}
      >
        <ProfileAvatar 
          user={{ user_metadata: { avatar_url: owner?.avatar_url } }} 
          size="sm"
          isPro={isPro}
        />
        <span className="text-sm font-medium">{owner?.display_name}</span>
      </div>
      <div className="flex items-center gap-2">
        {!isOwner && (
          <FollowButton userId={image.user_id} />
        )}
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

export default ImageOwnerHeader;