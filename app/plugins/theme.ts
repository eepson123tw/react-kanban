import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const theme = useState('theme', () => 'light')

  // Load theme from localStorage on client-side
  if (process.client) {
    const storedTheme = localStorage.getItem('vite-ui-theme')
    if (storedTheme) {
      theme.value = storedTheme
    }
  }

  // Make theme available to the app
  nuxtApp.provide('theme', {
    current: theme,
    setTheme: (newTheme) => {
      theme.value = newTheme
      if (process.client) {
        localStorage.setItem('vite-ui-theme', newTheme)
      }
    },
  })
})
