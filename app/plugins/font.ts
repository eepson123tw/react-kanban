import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // Font configuration similar to original
  const fontFamily = useState('fontFamily', () => 'default')

  nuxtApp.provide('font', {
    family: fontFamily,
    setFont: (font: string) => {
      fontFamily.value = font
    },
  })
})
