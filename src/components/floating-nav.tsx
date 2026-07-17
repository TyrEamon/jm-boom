import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { Fragment, type MouseEvent } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { FileRoutesByTo } from '@/routeTree.gen'
import { cn } from '@/lib/utils'

type FloatingNavTo = keyof FileRoutesByTo

export type FloatingNavItem = {
  id: string
  icon: LucideIcon
  label: string
  to: FloatingNavTo
  separatorBefore?: boolean
}

type FloatingNavProps = {
  items: FloatingNavItem[]
  activeId: string | undefined
  onItemClick: (item: FloatingNavItem, event: MouseEvent<HTMLAnchorElement>) => void
}

export function FloatingNav({ items, activeId, onItemClick }: FloatingNavProps) {
  if (items.length === 0) return null

  return (
    <nav className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-[calc(100vw-1.5rem)] overflow-x-auto rounded-full border border-border/70 bg-background/80 p-1 shadow-lg backdrop-blur md:top-1/2 md:right-auto md:bottom-auto md:left-6 md:mx-0 md:w-auto md:max-w-none md:-translate-y-1/2 md:shadow-none [&::-webkit-scrollbar]:hidden">
      <ul className="flex items-center gap-1 md:flex-col">
        {items.map(item => (
          <Fragment key={item.id}>
            {item.separatorBefore ? (
              <li aria-hidden="true" className="mx-1 h-6 w-px bg-border/70 md:my-1 md:h-px md:w-6" />
            ) : null}
            <NavItem item={item} isActive={item.id === activeId} onItemClick={onItemClick} />
          </Fragment>
        ))}
      </ul>
    </nav>
  )
}

type NavItemProps = {
  item: FloatingNavItem
  isActive: boolean
  onItemClick: (item: FloatingNavItem, event: MouseEvent<HTMLAnchorElement>) => void
}

function NavItem({ item, isActive, onItemClick }: NavItemProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onItemClick(item, event)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={item.to}
          onClick={handleClick}
          className={cn(
            buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'icon' }),
            'shrink-0'
          )}
        >
          <item.icon className="size-4" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="hidden md:inline-flex">
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}
