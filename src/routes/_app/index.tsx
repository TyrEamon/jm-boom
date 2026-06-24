import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { createFileRoute } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'

export const Route = createFileRoute('/_app/')({
  component: HomePage
})

function HomePage() {
  return (
    <div className="flex h-full items-center justify-center">
      <InputGroup className="max-w-md">
        <InputGroupInput placeholder="支持关键字 / JMID 搜索" />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
