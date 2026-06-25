import { invoke } from '@tauri-apps/api/core'

export type FeedComic = {
  id: string
  title: string
  author: string
  description: string
  image: string
  tags: string[]
  updatedAt?: number | null
}

export type HomeFeedSection = {
  id: string
  title: string
  slug: string
  type: string
  filterValue: string
  items: FeedComic[]
}

export type HomeFeedResult = {
  endpoint: string
  sections: HomeFeedSection[]
}

export type WeekCategory = {
  id: string
  time: string
  title: string
  label: string
}

export type WeekType = {
  id: string
  title: string
}

export type WeekRecommendationsParams = {
  page?: number
  categoryId?: string | null
  typeId?: string | null
  endpoint?: string | null
}

export type WeekRecommendationsResult = {
  endpoint: string
  page: number
  total: number
  categories: WeekCategory[]
  types: WeekType[]
  selectedCategoryId?: string | null
  selectedTypeId?: string | null
  items: FeedComic[]
}

export async function getHomeFeed(endpoint: string | null = null): Promise<HomeFeedResult> {
  ensureTauriRuntime()

  return invoke<HomeFeedResult>('get_home_feed', { endpoint })
}

export async function getWeekRecommendations({
  page = 1,
  categoryId = null,
  typeId = null,
  endpoint = null
}: WeekRecommendationsParams = {}): Promise<WeekRecommendationsResult> {
  ensureTauriRuntime()

  return invoke<WeekRecommendationsResult>('get_week_recommendations', {
    page,
    categoryId,
    typeId,
    endpoint
  })
}

function ensureTauriRuntime() {
  if (!('__TAURI_INTERNALS__' in window)) {
    throw new Error('This content needs the Tauri desktop runtime.')
  }
}
