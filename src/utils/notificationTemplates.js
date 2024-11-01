export const NOTIFICATION_TEMPLATES = {
  IMAGE_LIKED: {
    type: 'IMAGE_LIKED',
    getMessage: (metadata) => ({
      title: 'New Like',
      message: `${metadata.likerName} liked your image`,
      image: metadata.imageUrl,
      avatar: metadata.likerAvatar,
    }),
  },
  // Add more templates as needed
};

export const createNotification = async (userId, templateType, metadata) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      template_type: templateType,
      metadata,
    }]);
  
  if (error) throw error;
  return data;
};