import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Wand2 } from "lucide-react";
import { Link } from 'react-router-dom';
import FollowButton from '../social/FollowButton';

const MobileImageActions = ({ session, onDownload, isOwner, onDiscard, onRemix, owner }) => {
  if (!session) return null;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2 justify-between">
        <Button variant="ghost" size="sm" className="flex-1" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        {isOwner && (
          <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={onDiscard}>
            <Trash2 className="mr-2 h-4 w-4" />
            Discard
          </Button>
        )}
        <Button variant="ghost" size="sm" className="flex-1" onClick={onRemix}>
          <Wand2 className="mr-2 h-4 w-4" />
          Remix
        </Button>
      </div>
      {!isOwner && owner && (
        <div className="flex justify-center">
          <FollowButton targetUserId={owner.id} variant="outline" />
        </div>
      )}
    </div>
  );
};

export default MobileImageActions;