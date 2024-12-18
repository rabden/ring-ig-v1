import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TruncatablePrompt({ prompt, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = prompt.length > maxLength

  if (!shouldTruncate) {
    return <p className="text-sm text-white/70">{prompt}</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-white/70">
        {isExpanded ? prompt : `${prompt.slice(0, maxLength)}...`}
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="w-fit px-0 text-white/50 hover:text-white"
        onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Show less" : "Show more"}
      </Button>
    </div>
  )
}