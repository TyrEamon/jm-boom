import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { ComicGrid, ComicGridSkeleton, FeedHeader, StatePanel } from '@/components/comic-feed'
import type { FeedComic } from '@/lib/api/home'
import { getHomeFeed } from '@/lib/api/home'

export const Route = createFileRoute('/_app/')({
  component: HomePage
})

function HomePage() {
  const homeFeed = useQuery({
    queryKey: ['jm-home-feed'],
    queryFn: () => getHomeFeed()
  })
  const sections = homeFeed.data?.sections ?? []

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-5 py-8 pb-28 sm:pl-24 sm:pr-8">
        {homeFeed.isLoading ? (
          <ComicGridSkeleton />
        ) : homeFeed.isError ? (
          <StatePanel
            title="信息流加载失败"
            description={homeFeed.error.message}
            onRetry={() => homeFeed.refetch()}
          />
        ) : sections.length === 0 ? (
          <StatePanel title="暂无信息流内容" description="当前接口没有返回可展示的分组。" />
        ) : (
          sections.map(section => (
            <FeedSection
              key={section.id}
              title={section.title}
              description={section.slug}
              items={section.items}
              isRefreshing={homeFeed.isFetching}
              onRefresh={() => homeFeed.refetch()}
            />
          ))
        )}
      </div>
    </main>
  )
}

function FeedSection({
  title,
  description,
  items,
  isRefreshing,
  onRefresh
}: {
  title: string
  description?: string
  items: FeedComic[]
  isRefreshing?: boolean
  onRefresh?: () => void
}) {
  return (
    <section className="space-y-6">
      <FeedHeader
        title={title}
        description={description || '精选漫画作品。'}
        isFetching={isRefreshing}
        onRefresh={onRefresh}
      />
      {items.length === 0 ? (
        <StatePanel title="暂无内容" description="当前分组没有返回可展示的漫画。" />
      ) : (
        <ComicGrid items={items} />
      )}
    </section>
  )
}
