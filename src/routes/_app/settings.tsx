import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type UseQueryResult
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2Icon,
  Trash2Icon,
  EyeIcon,
  EyeOffIcon,
  FolderOpenIcon,
  GaugeIcon,
  HardDriveIcon,
  ImageIcon,
  LoaderCircleIcon,
  MonitorCogIcon,
  MoonIcon,
  NetworkIcon,
  RotateCcwIcon,
  RefreshCwIcon,
  SunIcon,
  XCircleIcon
} from 'lucide-react'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getRemoteSetting } from '@/lib/api/setting'
import {
  clearReaderCache,
  getReaderCacheStats,
  openReaderCacheDir,
  type ReaderCacheStatsResult
} from '@/lib/api/reader'
import { cn } from '@/lib/utils'
import {
  API_ENDPOINTS,
  IMAGE_SHUNTS,
  PREFETCH_COUNTS,
  READER_CACHE_LIMITS_MB,
  useSettingsStore
} from '@/stores/settings-store'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage
})

const THEME_OPTIONS = [
  { value: 'system', label: '跟随系统', icon: MonitorCogIcon },
  { value: 'light', label: '日间模式', icon: SunIcon },
  { value: 'dark', label: '夜间模式', icon: MoonIcon }
]

function SettingsPage() {
  const queryClient = useQueryClient()
  const { theme = 'system', setTheme } = useTheme()
  const api = useSettingsStore(state => state.api)
  const shunt = useSettingsStore(state => state.shunt)
  const prefetchCount = useSettingsStore(state => state.prefetchCount)
  const readerCacheLimitMb = useSettingsStore(state => state.readerCacheLimitMb)
  const cacheLimitBytes = readerCacheLimitMb * 1024 * 1024
  const hideCovers = useSettingsStore(state => state.hideCovers)
  const setApi = useSettingsStore(state => state.setApi)
  const setShunt = useSettingsStore(state => state.setShunt)
  const setPrefetchCount = useSettingsStore(state => state.setPrefetchCount)
  const setReaderCacheLimitMb = useSettingsStore(state => state.setReaderCacheLimitMb)
  const setHideCovers = useSettingsStore(state => state.setHideCovers)
  const reset = useSettingsStore(state => state.reset)
  const endpointHealthQueries = useEndpointHealthQueries()
  const readerCacheStats = useQuery({
    queryKey: ['reader-cache-stats', cacheLimitBytes],
    queryFn: () => getReaderCacheStats(cacheLimitBytes),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false
  })
  const clearCache = useMutation({
    mutationFn: () => clearReaderCache(cacheLimitBytes),
    onSuccess: data => {
      toast.success('阅读缓存已清理')
      queryClient.setQueryData(['reader-cache-stats', cacheLimitBytes], data)
    },
    onError: error => {
      toast.error(error instanceof Error ? error.message : String(error))
    }
  })
  const openCacheDir = useMutation({
    mutationFn: openReaderCacheDir,
    onError: error => {
      toast.error(error instanceof Error ? error.message : String(error))
    }
  })

  function resetSettings() {
    reset()
    setTheme('system')
    toast.success('设置已恢复默认')
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl space-y-8 p-[96px_32px_32px_96px]">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">设置</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              调整接口、阅读加载和内容显示偏好。
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetSettings}>
            <RotateCcwIcon className="size-4" />
            恢复默认
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">偏好设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <section className="space-y-5">
              <SectionTitle icon={<MonitorCogIcon className="size-4" />} title="外观" />
              <SettingRow title="主题" description="控制应用的明暗色模式。">
                <Tabs value={theme} onValueChange={setTheme}>
                  <TabsList>
                    {THEME_OPTIONS.map(option => (
                      <TabsTrigger
                        key={option.value}
                        value={option.value}
                        className="size-8 px-0"
                        title={option.label}
                        aria-label={option.label}
                      >
                        <option.icon className="size-4" />
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </SettingRow>
            </section>

            <Separator />

            <section className="space-y-5">
              <SectionTitle icon={<NetworkIcon className="size-4" />} title="网络" />
              <SettingRow title="API 接口" description="切换请求使用的 JM 接口域名。">
                <div className="flex items-center gap-2">
                  <Select value={api} onValueChange={setApi}>
                    <SelectTrigger className="w-[260px]">
                      <SelectValue>
                        <EndpointDisplay
                          endpoint={api}
                          health={endpointHealthQueries[API_ENDPOINTS.indexOf(api)]}
                          compact
                        />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="min-w-[260px]">
                      <SelectGroup>
                        {API_ENDPOINTS.map((endpoint, index) => (
                          <SelectItem
                            key={endpoint}
                            value={endpoint}
                            textValue={formatEndpoint(endpoint)}
                            className="py-2.5"
                          >
                            <EndpointDisplay
                              endpoint={endpoint}
                              health={endpointHealthQueries[index]}
                            />
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="重新测试 API 接口"
                    title="重新测试 API 接口"
                    disabled={endpointHealthQueries.some(query => query.isFetching)}
                    onClick={() => {
                      endpointHealthQueries.forEach(query => {
                        void query.refetch()
                      })
                    }}
                  >
                    <RefreshCwIcon
                      className={cn(
                        'size-4',
                        endpointHealthQueries.some(query => query.isFetching) && 'animate-spin'
                      )}
                    />
                  </Button>
                </div>
              </SettingRow>

              <SettingRow title="图片线路" description="影响阅读页图片来源线路。">
                <Select value={shunt} onValueChange={setShunt}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {IMAGE_SHUNTS.map(option => (
                        <SelectItem key={option} value={option}>
                          线路 {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SettingRow>
            </section>

            <Separator />

            <section className="space-y-5">
              <SectionTitle icon={<GaugeIcon className="size-4" />} title="阅读" />
              <SettingRow title="图片预载数量" description="当前页前后提前准备的图片数量。">
                <Select
                  value={String(prefetchCount)}
                  onValueChange={value => setPrefetchCount(Number(value))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PREFETCH_COUNTS.map(option => (
                        <SelectItem key={option} value={String(option)}>
                          {option === 0 ? '关闭' : `预载 ${option} 张`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SettingRow>
            </section>

            <Separator />

            <section className="space-y-5">
              <SectionTitle icon={<HardDriveIcon className="size-4" />} title="缓存" />
              <SettingRow title="当前缓存大小" description="已解码阅读图片当前占用的磁盘空间。">
                <CacheSize stats={readerCacheStats} />
              </SettingRow>
              <SettingRow title="缓存大小设置" description="超过上限后会自动清理较旧的阅读图片缓存。">
                <Select
                  value={String(readerCacheLimitMb)}
                  onValueChange={value => setReaderCacheLimitMb(Number(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {READER_CACHE_LIMITS_MB.map(limit => (
                        <SelectItem key={limit} value={String(limit)}>
                          {formatCacheLimit(limit)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow title="缓存路径" description="阅读缓存固定保存在应用缓存目录中。">
                <div className="flex items-center gap-2">
                  <Input
                    disabled
                    value={
                      readerCacheStats.isLoading
                        ? '正在读取路径'
                        : readerCacheStats.isError
                          ? '读取失败'
                          : (readerCacheStats.data?.cacheDir ?? '')
                    }
                    title={readerCacheStats.data?.cacheDir ?? ''}
                    className="w-[360px]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="打开缓存目录"
                    title="打开缓存目录"
                    disabled={openCacheDir.isPending}
                    onClick={() => openCacheDir.mutate()}
                  >
                    {openCacheDir.isPending ? (
                      <LoaderCircleIcon className="size-4 animate-spin" />
                    ) : (
                      <FolderOpenIcon className="size-4" />
                    )}
                  </Button>
                </div>
              </SettingRow>
              <SettingRow title="清理缓存" description="删除已解码的阅读图片缓存，不影响登录状态和设置。">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={clearCache.isPending || readerCacheStats.data?.totalBytes === 0}
                  onClick={() => clearCache.mutate()}
                >
                  {clearCache.isPending ? (
                    <LoaderCircleIcon className="size-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-4" />
                  )}
                  清理缓存
                </Button>
              </SettingRow>
            </section>

            <Separator />

            <section className="space-y-5">
              <SectionTitle icon={<ImageIcon className="size-4" />} title="内容显示" />
              <SettingRow title="封面隐私模式" description="控制首页、周榜等列表是否遮挡封面。">
                <Tabs
                  value={hideCovers ? 'hidden' : 'visible'}
                  onValueChange={value => setHideCovers(value === 'hidden')}
                >
                  <TabsList>
                    <TabsTrigger
                      value="hidden"
                      className="size-8 px-0"
                      title="隐藏封面"
                      aria-label="隐藏封面"
                    >
                      <EyeOffIcon className="size-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="visible"
                      className="size-8 px-0"
                      title="显示封面"
                      aria-label="显示封面"
                    >
                      <EyeIcon className="size-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </SettingRow>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function useEndpointHealthQueries() {
  return useQueries({
    queries: API_ENDPOINTS.map(endpoint => ({
      queryKey: ['jm-endpoint-health', endpoint],
      queryFn: () => measureEndpointLatency(endpoint),
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false
    }))
  })
}

async function measureEndpointLatency(endpoint: string) {
  const startedAt = performance.now()

  await getRemoteSetting({ endpoint })

  return Math.round(performance.now() - startedAt)
}

function EndpointDisplay({
  endpoint,
  health,
  compact = false
}: {
  endpoint: string
  health: ReturnType<typeof useEndpointHealthQueries>[number]
  compact?: boolean
}) {
  return (
    <span className="flex w-full min-w-0 items-center justify-between gap-2">
      <span className="truncate">{formatEndpoint(endpoint)}</span>
      <EndpointHealthBadge health={health} compact={compact} />
    </span>
  )
}

function EndpointHealthBadge({
  health,
  compact = false
}: {
  health: ReturnType<typeof useEndpointHealthQueries>[number]
  compact?: boolean
}) {
  if (health.isPending || health.isFetching) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <LoaderCircleIcon className="size-3 animate-spin" />
        {compact ? null : '探测中'}
      </span>
    )
  }

  if (health.isError) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-destructive">
        <XCircleIcon className="size-3" />
        {compact ? '失败' : '不可用'}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 text-xs',
        latencyTone(health.data ?? 0)
      )}
    >
      <CheckCircle2Icon className="size-3" />
      {health.data} ms
    </span>
  )
}

function latencyTone(latencyMs: number) {
  if (latencyMs <= 500) {
    return 'text-emerald-600 dark:text-emerald-400'
  }

  if (latencyMs <= 1500) {
    return 'text-amber-600 dark:text-amber-400'
  }

  return 'text-orange-600 dark:text-orange-400'
}

function CacheSize({ stats }: { stats: UseQueryResult<ReaderCacheStatsResult, Error> }) {
  if (stats.isLoading) {
    return <span className="text-sm text-muted-foreground">正在计算</span>
  }

  if (stats.isError) {
    return <span className="text-sm text-destructive">读取失败</span>
  }

  if (!stats.data) {
    return <span className="text-sm text-muted-foreground">0 B</span>
  }

  return (
    <div className="text-right">
      <div className="text-sm font-medium">{formatBytes(stats.data.totalBytes)}</div>
      <div className="mt-1 text-xs text-muted-foreground">{stats.data.fileCount} 个文件</div>
    </div>
  )
}

function formatCacheLimit(limitMb: number) {
  return limitMb >= 1024 ? `${limitMb / 1024} GB` : `${limitMb} MB`
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <span className="text-muted-foreground">{icon}</span>
      {title}
    </div>
  )
}

function SettingRow({
  title,
  description,
  children
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0 space-y-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs leading-5 text-muted-foreground">{description}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function formatEndpoint(endpoint: string) {
  return endpoint.replace(/^https?:\/\//, '')
}
