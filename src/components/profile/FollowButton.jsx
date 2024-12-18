import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useFollows } from '@/hooks/useFollows';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const FollowButton = ({ userId, className, size = 'default' }) => {
  const { isFollowing, toggleFollow, isLoading } = useFollows(userId);

  const sizeClasses = {
    sm: "h-7 px-2.5 text-xs",
    default: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-base"
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    default: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Button
        variant={isFollowing ? "secondary" : "default"}
        className={cn(
          sizeClasses[size],
          "relative overflow-hidden",
          "transition-all duration-300",
          isFollowing && [
            "hover:bg-destructive/10",
            "hover:text-destructive",
            "hover:border-destructive/20"
          ],
          !isFollowing && [
            "hover:bg-primary/90",
            "active:bg-primary/80"
          ],
          "group",
          className
        )}
        onClick={() => toggleFollow()}
        disabled={isLoading}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFollowing ? "following" : "follow"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center"
          >
            {isFollowing ? (
              <UserMinus className={cn(
                iconSizes[size],
                "mr-2",
                "transition-all duration-300",
                "group-hover:scale-110",
                "group-hover:text-destructive"
              )} />
            ) : (
              <UserPlus className={cn(
                iconSizes[size],
                "mr-2",
                "transition-all duration-300",
                "group-hover:scale-110",
                "group-hover:text-primary-foreground"
              )} />
            )}
            <span className={cn(
              "font-medium",
              "transition-colors duration-300",
              isFollowing && "group-hover:text-destructive"
            )}>
              {isFollowing ? 'Following' : 'Follow'}
            </span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute inset-0",
                "flex items-center justify-center",
                "bg-background/80 backdrop-blur-[2px]",
                "transition-all duration-300"
              )}
            >
              <Loader2 className={cn(
                iconSizes[size],
                "animate-spin",
                "text-primary",
                "transition-colors duration-300"
              )} />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Hover effect for unfollow state */}
      {isFollowing && (
        <motion.div
          initial={false}
          animate={{ opacity: isFollowing ? 1 : 0 }}
          className={cn(
            "absolute top-full left-1/2 -translate-x-1/2",
            "mt-1 px-2 py-1 rounded-md",
            "bg-destructive/10 text-destructive",
            "text-xs font-medium",
            "opacity-0 group-hover:opacity-100",
            "pointer-events-none",
            "transition-all duration-300"
          )}
        >
          Unfollow
        </motion.div>
      )}
    </motion.div>
  );
};

export default FollowButton;