import React from 'react';
import { useFollowCounts } from '@/hooks/useFollowCounts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from 'lucide-react';

const StatItem = ({ label, value, icon: Icon, onClick }) => (
  <Button
    variant="ghost"
    className={cn(
      "flex flex-col items-center gap-1 p-3",
      "hover:bg-accent/10",
      "transition-all duration-300",
      "group"
    )}
    onClick={onClick}
  >
    <div className={cn(
      "flex items-center gap-2",
      "transition-all duration-300",
      "group-hover:scale-105"
    )}>
      <Icon className={cn(
        "w-4 h-4",
        "text-muted-foreground",
        "transition-colors duration-300",
        "group-hover:text-foreground"
      )} />
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className={cn(
          "text-xl font-bold",
          "transition-colors duration-300",
          "group-hover:text-foreground"
        )}
      >
        {value}
      </motion.span>
    </div>
    <span className={cn(
      "text-xs font-medium",
      "text-muted-foreground",
      "transition-colors duration-300",
      "group-hover:text-foreground"
    )}>
      {label}
    </span>
  </Button>
);

const LoadingSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={cn(
      "flex gap-4 justify-center md:justify-start",
      "transition-all duration-300"
    )}
  >
    {[0, 1].map((i) => (
      <div key={i} className="flex flex-col items-center gap-1 p-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-8 h-6 rounded-md" />
        </div>
        <Skeleton className="w-16 h-4 rounded-md" />
      </div>
    ))}
  </motion.div>
);

const FollowStats = ({ userId, onFollowersClick, onFollowingClick }) => {
  const { followersCount, followingCount, isLoading } = useFollowCounts(userId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 justify-center md:justify-start",
        "transition-all duration-300"
      )}
    >
      <AnimatePresence mode="wait">
        <StatItem
          label="Followers"
          value={followersCount}
          icon={Users}
          onClick={onFollowersClick}
        />
        <StatItem
          label="Following"
          value={followingCount}
          icon={UserPlus}
          onClick={onFollowingClick}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default FollowStats;