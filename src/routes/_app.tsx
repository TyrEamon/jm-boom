import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { CalendarDaysIcon, HeartIcon, HouseIcon, UserRoundIcon } from 'lucide-react'

import { FloatingNav, type FloatingNavItem } from '@/components/floating-nav'

export const Route = createFileRoute('/_app')({
  component: AppRoute
})

function AppRoute() {
  const pathname = useRouterState({
    select: state => state.location.pathname
  })

  const items: FloatingNavItem[] = [
    { id: 'home', icon: HouseIcon, label: 'Home', to: '/' },
    { id: 'weekly', icon: CalendarDaysIcon, label: 'Weekly', to: '/weekly' },
    { id: 'favorites', icon: HeartIcon, label: 'Favorites', to: '/favorites' },
    { id: 'me', icon: UserRoundIcon, label: 'Me', to: '/me' }
  ]

  const activeId = pathname.startsWith('/favorites')
    ? 'favorites'
    : pathname.startsWith('/me')
      ? 'me'
      : pathname.startsWith('/weekly')
        ? 'weekly'
        : 'home'

  return (
    <div className="relative h-screen">
      <FloatingNav
        items={items}
        activeId={activeId}
        className="sm:top-1/2 sm:bottom-auto sm:left-6 sm:translate-x-0 sm:-translate-y-1/2"
      />
      <Outlet />
    </div>
  )
}
