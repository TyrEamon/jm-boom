import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon, HomeIcon, ShieldAlertIcon } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent
})

function RootLayout() {
  return (
    <>
      <Outlet />
      <NsfwStartupDialog />
    </>
  )
}

function NsfwStartupDialog() {
  const [open, setOpen] = useState(true)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <ShieldAlertIcon className="size-8 text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>NSFW 内容警告</AlertDialogTitle>
          <AlertDialogDescription>
            本应用可能展示不适合未成年人或公共场合浏览的成人向内容。请确认你已达到当地法定年龄，并在私密、安全的环境中使用。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setOpen(false)}>我已了解</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function notFoundComponent() {
  const router = useRouter()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="font-mono text-8xl font-bold text-primary">404</div>
              <h1 className="text-2xl font-bold">Page Not Found</h1>
              <p className="text-sm text-muted-foreground">
                Sorry, the page you're looking for doesn't exist or has been removed
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => router.history.back()}>
                <ArrowLeftIcon className="size-4" />
                Go Back
              </Button>
              <Button className="flex-1" onClick={() => router.navigate({ to: '/' })}>
                <HomeIcon className="size-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
