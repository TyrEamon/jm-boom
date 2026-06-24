import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: AppRoute
})

function AppRoute() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
