import { ImageIcon, RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { FeedComic } from '@/lib/api/home'

export function FeedHeader({
  title,
  description,
  isFetching,
  onRefresh
}: {
  title: string
  description: string
  isFetching?: boolean
  onRefresh?: () => void
}) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onRefresh ? (
        <Button
          variant="outline"
          size="icon"
          disabled={isFetching}
          onClick={onRefresh}
          className="cursor-pointer"
        >
          <RefreshCwIcon className={isFetching ? 'animate-spin' : undefined} />
        </Button>
      ) : null}
    </div>
  )
}

export function ComicGrid({ items, ranked = false }: { items: FeedComic[]; ranked?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item, index) => (
        <ComicCard key={item.id} item={item} rank={ranked ? index + 1 : undefined} />
      ))}
    </div>
  )
}

function ComicCard({ item, rank }: { item: FeedComic; rank?: number }) {
  return (
    <div className="overflow-hidden rounded-md border border-border/70 bg-card text-card-foreground transition-colors hover:border-foreground/30">
      <ComicCoverPlaceholder title={item.title} rank={rank} />
      <div className="p-3">
        <div className="text-xs font-medium text-muted-foreground">JM {item.id}</div>
        <h2 className="text-sm leading-5 font-semibold">{item.title}</h2>
        <p className="text-xs text-muted-foreground">{item.author ? `${item.author}` : 'N/A'}</p>
      </div>
    </div>
  )
}

function ComicCoverPlaceholder({ title, rank }: { title: string; rank?: number }) {
  return (
    <div className="relative aspect-square bg-muted">
      <div className="flex h-full flex-col items-center justify-center gap-3 px-3 text-center text-xs text-muted-foreground">
        <ImageIcon className="size-6" />
        <span className="line-clamp-2">{title}</span>
      </div>
      {rank != null ? (
        <span className="absolute top-3 left-3 flex size-6 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-white shadow">
          {rank}
        </span>
      ) : null}
    </div>
  )
}

export function ComicGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="overflow-hidden rounded-md border border-border/60 bg-card">
          <div className="aspect-3/4 animate-pulse bg-muted" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </article>
      ))}
    </div>
  )
}

export function StatePanel({
  title,
  description,
  onRetry
}: {
  title: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border/70 bg-card/60 px-6 py-8 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          重试
        </Button>
      ) : null}
    </div>
  )
}
