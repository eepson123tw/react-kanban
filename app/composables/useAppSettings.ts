import type { AppConfigInput } from 'nuxt/schema'

export function useAppSettings() {
  const { sidebar: _sidebar } = useAppConfig() as unknown as AppConfigInput

  const sidebar = useCookie('app-settings', {
    default: () => ({
      collapsible: 'icon',
      side: 'left',
      variant: 'sidebar',
    }) as AppConfigInput['sidebar'],
  })

  return {
    sidebar,
  }
}
