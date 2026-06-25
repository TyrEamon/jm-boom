import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarDaysIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ComicGrid, ComicGridSkeleton, FeedHeader, StatePanel } from '@/components/comic-feed'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getWeekRecommendations, type WeekCategory, type WeekType } from '@/lib/api/home'

export const Route = createFileRoute('/_app/weekly')({
  component: WeeklyPage
})

function WeeklyPage() {
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [typeId, setTypeId] = useState<string | null>(null)
  const [categories, setCategories] = useState<WeekCategory[]>([])
  const [types, setTypes] = useState<WeekType[]>([])

  const weekly = useQuery({
    queryKey: ['jm-week-recommendations', categoryId, typeId],
    queryFn: () =>
      getWeekRecommendations({
        categoryId,
        typeId
      })
  })

  useEffect(() => {
    if (weekly.data == null) {
      return
    }

    setCategories(weekly.data.categories)
    setTypes(weekly.data.types)
  }, [weekly.data])

  const selectedCategoryId =
    categoryId ?? weekly.data?.selectedCategoryId ?? categories[0]?.id ?? ''
  const selectedTypeId = typeId ?? weekly.data?.selectedTypeId ?? types[0]?.id ?? ''
  const shouldShowItemsSkeleton = weekly.isFetching

  return (
    <div className="flex flex-col gap-4 p-[96px_32px_16px_96px]">
      <FeedHeader
        title="每周推荐"
        description="为你精选的本周热门作品"
        isFetching={weekly.isFetching}
        onRefresh={() => weekly.refetch()}
      />

      <div className="mb-4 flex justify-between">
        {types.length > 0 ? (
          <Tabs value={selectedTypeId} onValueChange={value => setTypeId(value)}>
            <TabsList>
              {types.map(type => (
                <TabsTrigger key={type.id} value={type.id} className="min-w-16">
                  {type.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
        )}

        {categories.length > 0 ? (
          <Select value={selectedCategoryId} onValueChange={value => setCategoryId(value)}>
            <SelectTrigger>
              <CalendarDaysIcon className="size-4 text-muted-foreground" />
              <SelectValue placeholder="选择期数" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <div className="h-9 w-full animate-pulse rounded-md bg-muted lg:w-[320px]" />
        )}
      </div>

      <section>
        {weekly.isError ? (
          <StatePanel
            title="每周推荐加载失败"
            description={weekly.error.message}
            onRetry={() => weekly.refetch()}
          />
        ) : shouldShowItemsSkeleton ? (
          <ComicGridSkeleton />
        ) : weekly.data == null || weekly.data.items.length === 0 ? (
          <StatePanel title="暂无每周推荐" description="当前筛选条件下没有内容。" />
        ) : (
          <ComicGrid items={weekly.data.items} ranked />
        )}
      </section>
    </div>
  )
}
