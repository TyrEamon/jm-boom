import { createFileRoute } from '@tanstack/react-router'
import { HeartIcon } from 'lucide-react'

export const Route = createFileRoute('/_app/favorites')({
  component: FavoritesPage
})

function FavoritesPage() {
  return (
    <section className="mx-auto flex min-h-svh w-full max-w-4xl items-center px-6 py-16 sm:px-10">
      <div className="w-full rounded-[2rem] border border-dashed border-border bg-card/70 p-8 shadow-sm">
        <div className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-muted">
          <HeartIcon className="size-6 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Favorites</h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          This is a placeholder for saved items. We can wire real collection data into this route
          next.
        </p>
      </div>
    </section>
  )
}
