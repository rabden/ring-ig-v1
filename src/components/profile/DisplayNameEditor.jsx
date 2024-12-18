import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DisplayNameEditor = ({ 
  isEditing, 
  displayName, 
  setDisplayName, 
  onEdit, 
  onUpdate, 
  onCancel,
  size = 'md',
  error
}) => {
  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onUpdate();
    } else if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  return (
    <motion.div 
      layout
      className={cn(
        "flex items-center justify-center gap-2",
        "relative group",
        "transition-all duration-200"
      )}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "h-9 px-3",
                  textSizeClasses[size],
                  "font-semibold text-center",
                  "bg-background/50",
                  "border border-border/50",
                  "focus:ring-2 focus:ring-primary/20",
                  "placeholder:text-muted-foreground/50",
                  error && "border-destructive focus:ring-destructive/20",
                  "transition-all duration-200"
                )}
                placeholder="Enter display name"
                autoFocus
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "absolute -bottom-6 left-0 right-0",
                    "text-xs text-destructive text-center",
                    "transition-colors duration-200"
                  )}
                >
                  {error}
                </motion.p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onUpdate}
                className={cn(
                  "h-9 w-9",
                  "hover:bg-primary/10",
                  "active:scale-95",
                  "transition-all duration-200"
                )}
              >
                <Check className={cn(
                  "h-4 w-4",
                  "text-primary",
                  "transition-colors duration-200"
                )} />
              </Button>
              {onCancel && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancel}
                  className={cn(
                    "h-9 w-9",
                    "hover:bg-destructive/10",
                    "active:scale-95",
                    "transition-all duration-200"
                  )}
                >
                  <X className={cn(
                    "h-4 w-4",
                    "text-destructive",
                    "transition-colors duration-200"
                  )} />
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex items-center gap-2",
              "group/name",
              "transition-all duration-200"
            )}
          >
            <h3 className={cn(
              textSizeClasses[size],
              "font-semibold",
              "transition-colors duration-200"
            )}>
              {displayName}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className={cn(
                "h-9 w-9",
                "opacity-0 group-hover/name:opacity-100",
                "hover:bg-accent/20",
                "active:scale-95",
                "transition-all duration-200"
              )}
            >
              <Edit className={cn(
                "h-4 w-4",
                "text-muted-foreground",
                "transition-colors duration-200"
              )} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DisplayNameEditor;