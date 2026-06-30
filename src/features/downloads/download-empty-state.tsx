import { ClockIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

export function DownloadEmptyState({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
        <ClockIcon className="size-10" />
        <div className="text-sm">{label}</div>
      </CardContent>
    </Card>
  )
}
