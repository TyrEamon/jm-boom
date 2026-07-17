import { ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/stores/settings-store'

export type ComicCoverRatio = 'portrait' | 'square'

export type ComicCoverProps = {
  id?: string
  title: string
  image: string
  className?: string
  ratio?: ComicCoverRatio
  showIdBadge?: boolean
}

const COVER_RATIO_CLASS: Record<ComicCoverRatio, string> = {
  portrait: 'aspect-3/4',
  square: 'aspect-square'
}

export function ComicCover({
  id,
  image,
  className,
  ratio = 'portrait',
  showIdBadge = false
}: ComicCoverProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const hideCovers = useSettingsStore(state => state.hideCovers)
  const shouldShowImage = !hideCovers && image.length > 0 && !hasImageError

  useEffect(() => {
    setHasImageError(false)
  }, [image])

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted',
        COVER_RATIO_CLASS[ratio],
        className
      )}
    >
      {shouldShowImage ? (
        <img
          src={image}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <CoverPlaceholder />
      )}
      {showIdBadge && id ? (
        <div className="absolute top-1.5 left-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-full border bg-background/55 px-1.5 py-0.5 text-[10px] backdrop-blur sm:top-2 sm:left-2 sm:px-2 sm:py-1">
          JM {id}
        </div>
      ) : null}
    </div>
  )
}

function CoverPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <ImageIcon className="size-6" />
    </div>
  )
}
