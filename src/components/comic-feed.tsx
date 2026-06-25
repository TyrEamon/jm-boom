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
    <div className="space-y-4 border-b border-border/40 pb-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {onRefresh ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={isFetching}
            onClick={onRefresh}
            aria-label="刷新"
          >
            <RefreshCwIcon className={isFetching ? 'animate-spin' : undefined} />
          </Button>
        ) : null}
      </div>
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
    <article className="overflow-hidden rounded-md border border-border/70 bg-card text-card-foreground shadow-sm transition-colors hover:border-foreground/30">
      <ComicCoverPlaceholder title={item.title} rank={rank} />

      <div className="space-y-1.5 p-3">
        <div className="text-xs font-medium text-muted-foreground">JM{item.id}</div>
        <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5">{item.title}</h2>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {item.author ? `作者: ${item.author}` : '暂无作者'}
        </p>
      </div>
    </article>
  )
}

function ComicCoverPlaceholder({ title, rank }: { title: string; rank?: number }) {
  return (
    <div className="relative aspect-[3/4] bg-muted">
      <div className="flex h-full flex-col items-center justify-center gap-3 px-3 text-center text-xs text-muted-foreground">
        <ImageIcon className="size-6" />
        <span className="line-clamp-2">{title}</span>
      </div>
      {rank != null ? (
        <span className="absolute left-3 top-3 flex size-6 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-white shadow">
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
        <article
          key={index}
          className="overflow-hidden rounded-md border border-border/60 bg-card"
        >
          <div className="aspect-[3/4] animate-pulse bg-muted" />
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
