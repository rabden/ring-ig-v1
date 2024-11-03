import React from 'react'
import { Button } from "@/components/ui/button"
import GeneratingImagesDropdown from './GeneratingImagesDropdown'
import { Flame } from "lucide-react"

const ActionButtons = ({ activeView, setActiveView, generatingImages, showTopFilter, setShowTopFilter }) => {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <Button
        variant={activeView === 'myImages' ? 'default' : 'outline'}
        onClick={() => {
          setActiveView('myImages');
          setShowTopFilter(false);
        }}
        className="text-xs px-2 py-1 h-8"
      >
        My Images
      </Button>
      <Button
        variant={activeView === 'inspiration' ? 'default' : 'outline'}
        onClick={() => setActiveView('inspiration')}
        className="text-xs px-2 py-1 h-8"
      >
        Inspiration
      </Button>
      {activeView === 'inspiration' && (
        <Button
          variant={showTopFilter ? 'default' : 'outline'}
          onClick={() => setShowTopFilter(!showTopFilter)}
          className="text-xs px-2 py-1 h-8"
          size="sm"
        >
          <Flame className="h-4 w-4 mr-1" />
          Top
        </Button>
      )}
      <GeneratingImagesDropdown generatingImages={generatingImages} />
    </div>
  )
}

export default ActionButtons