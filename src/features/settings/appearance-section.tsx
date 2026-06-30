import { MonitorCogIcon, MoonIcon, SunIcon } from 'lucide-react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SettingRow, SettingsSection } from './shared'

const THEME_OPTIONS = [
  { value: 'system', label: '跟随系统', icon: MonitorCogIcon },
  { value: 'light', label: '日间模式', icon: SunIcon },
  { value: 'dark', label: '夜间模式', icon: MoonIcon }
]

export function AppearanceSection({
  theme,
  onThemeChange
}: {
  theme: string
  onThemeChange: (theme: string) => void
}) {
  return (
    <SettingsSection icon={<MonitorCogIcon className="size-4" />} title="外观">
      <SettingRow title="主题" description="控制应用的明暗色主题">
        <Tabs value={theme} onValueChange={onThemeChange}>
          <TabsList>
            {THEME_OPTIONS.map(option => (
              <TabsTrigger key={option.value} value={option.value}>
                <option.icon className="size-4" />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </SettingRow>
    </SettingsSection>
  )
}
