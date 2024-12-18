import React from 'react';
import { Upload, Crown } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import DisplayNameEditor from './DisplayNameEditor';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center",
        "space-y-6 sm:space-y-8",
        "transition-all duration-300"
      )}
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="relative cursor-pointer group"
        onClick={onAvatarEdit}
      >
        <div className={cn(
          "transition-all duration-300",
          "group-hover:shadow-lg",
          "rounded-full"
        )}>
          <ProfileAvatar 
            user={user} 
            isPro={isPro} 
            size="lg" 
            onEditClick={null}
            showEditOnHover={false}
          />
        </div>

        {/* Upload Button */}
        <motion.label 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute -bottom-2 -right-2 cursor-pointer z-10",
            "transition-all duration-300"
          )} 
          onClick={e => e.stopPropagation()}
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={onAvatarUpload} 
            className="hidden" 
          />
          <div className={cn(
            "flex items-center justify-center",
            "w-9 h-9 rounded-full",
            "bg-background/90 backdrop-blur-sm",
            "hover:bg-background",
            "shadow-lg hover:shadow-xl",
            "border border-border/50",
            "transition-all duration-300"
          )}>
            <Upload className={cn(
              "w-4 h-4",
              "text-foreground/70",
              "transition-all duration-300",
              "group-hover:text-foreground",
              "group-hover:scale-110"
            )} />
          </div>
        </motion.label>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "text-center space-y-4 w-full",
          "px-4 sm:px-6",
          "transition-all duration-300"
        )}
      >
        <DisplayNameEditor
          isEditing={isEditing}
          displayName={displayName}
          setDisplayName={setDisplayName}
          onEdit={() => setIsEditing(true)}
          onUpdate={onUpdate}
          onCancel={() => setIsEditing(false)}
          size="lg"
        />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <p className={cn(
            "text-sm",
            "text-muted-foreground/80",
            "transition-colors duration-300"
          )}>
            {user.email}
          </p>

          <AnimatePresence>
            {isPro && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge 
                  variant="premium" 
                  className={cn(
                    "gap-1 px-3 py-1",
                    "bg-gradient-to-r from-amber-500/20 to-amber-600/20",
                    "hover:from-amber-500/30 hover:to-amber-600/30",
                    "text-amber-600 dark:text-amber-400",
                    "border-amber-500/20",
                    "transition-all duration-300"
                  )}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span className="font-medium">Pro User</span>
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileHeader;