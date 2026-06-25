import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type FloatingNavItem = {
  id: string
  icon: LucideIcon
  label: string
  to: '/' | '/weekly' | '/favorites' | '/me'
}

type FloatingNavProps = {
  items: FloatingNavItem[]
  activeId?: string
  className?: string
}

export function FloatingNav({ items, activeId, className }: FloatingNavProps) {
  const currentId = activeId ?? items[0]?.id

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border/70 bg-background/90 p-1.5 backdrop-blur',
        className
      )}
    >
      <div className="flex items-center gap-1.5 sm:flex-col">
        {items.map(item => {
          const isActive = item.id === currentId

          return (
            <Link
              key={item.id}
              to={item.to}
              className={cn(
                buttonVariants({
                  variant: isActive ? 'default' : 'ghost',
                  size: 'icon'
                }),
                'rounded-full border border-transparent'
              )}
            >
              <item.icon className="size-4" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
