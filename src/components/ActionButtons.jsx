import React from 'react'
import { Button } from "@/components/ui/button"

const ActionButtons = ({ activeView, setActiveView }) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={activeView === 'myImages' ? 'default' : 'outline'}
        onClick={() => setActiveView('myImages')}
        className="text-sm"
      >
        My Images
      </Button>
      <Button
        variant={activeView === 'inspiration' ? 'default' : 'outline'}
        onClick={() => setActiveView('inspiration')}
        className="text-sm"
      >
        Inspiration
      </Button>
    </div>
  )
}

export default ActionButtons