import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LikeButton({ isLiked, onClick, className }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("group", className)}
      onClick={onClick}>
      <Heart
        className={cn(
          "h-5 w-5 transition-colors duration-200",
          isLiked ? "fill-red-500 text-red-500" : "text-white/50 group-hover:text-white"
        )}
      />
    </Button>
  )
}