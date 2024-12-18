import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function SkeletonImageCard() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-square w-full animate-pulse rounded-t-md bg-black/30 backdrop-blur-sm" />
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 animate-pulse rounded bg-black/30 backdrop-blur-sm" />
          <div className="h-3 w-16 animate-pulse rounded bg-black/30 backdrop-blur-sm" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded-full bg-black/30 backdrop-blur-sm" />
      </CardFooter>
    </Card>
  )
}