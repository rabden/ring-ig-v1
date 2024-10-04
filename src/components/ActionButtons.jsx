import React from 'react'
import { Button } from "@/components/ui/button"

const ActionButtons = ({ activeView, setActiveView }) => {
  return (
    <>
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
    </>
  )
}

export default ActionButtons