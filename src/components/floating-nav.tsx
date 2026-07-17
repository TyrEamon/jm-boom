import { Link } from '@tanstack/react-router'
import { MoreHorizontalIcon, type LucideIcon } from 'lucide-react'
import { Fragment, type MouseEvent } from 'react'

import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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

const MOBILE_PRIMARY_ITEM_IDS = new Set(['home', 'weekly', 'ranking', 'search'])

export function FloatingNav({ items, activeId, onItemClick }: FloatingNavProps) {
  if (items.length === 0) return null

  return (
    <>
      <MobileNav items={items} activeId={activeId} onItemClick={onItemClick} />
      <DesktopNav items={items} activeId={activeId} onItemClick={onItemClick} />
    </>
  )
}

function MobileNav({ items, activeId, onItemClick }: FloatingNavProps) {
  const primaryItems = items.filter(item => MOBILE_PRIMARY_ITEM_IDS.has(item.id)).slice(0, 4)
  const overflowItems = items.filter(item => !primaryItems.some(primary => primary.id === item.id))
  const isOverflowActive = overflowItems.some(item => item.id === activeId)

  return (
    <nav className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto rounded-full border border-border/70 bg-background/90 p-1 shadow-lg backdrop-blur md:hidden">
      <ul className="grid grid-cols-5 items-center gap-1">
        {primaryItems.map(item => (
          <li key={item.id} className="min-w-0">
            <NavItem item={item} isActive={item.id === activeId} onItemClick={onItemClick} mobile />
          </li>
        ))}
        <li className="min-w-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: isOverflowActive ? 'default' : 'ghost', size: 'icon' }),
                'h-11 w-full rounded-full'
              )}
              aria-label="更多导航"
            >
              <MoreHorizontalIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              sideOffset={10}
              className="w-52 border border-border/70 bg-popover/95 backdrop-blur"
            >
              {overflowItems.map(item => (
                <DropdownMenuItem key={item.id} asChild className="cursor-pointer">
                  <Link
                    to={item.to}
                    onClick={event => onItemClick(item, event)}
                    className="flex w-full items-center gap-2"
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  )
}

function DesktopNav({ items, activeId, onItemClick }: FloatingNavProps) {
  return (
    <nav className="fixed top-1/2 left-6 z-50 hidden -translate-y-1/2 rounded-full border border-border/70 p-1 backdrop-blur md:block">
      <ul className="flex flex-col items-center gap-1">
        {items.map(item => (
          <Fragment key={item.id}>
            {item.separatorBefore ? (
              <li aria-hidden="true" className="my-1 h-px w-6 bg-border/70" />
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
  mobile?: boolean
}

function NavItem({ item, isActive, onItemClick, mobile = false }: NavItemProps) {
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
            mobile ? 'h-11 w-full rounded-full' : 'shrink-0'
          )}
          aria-label={item.label}
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
