import { useAuthStore } from '~/stores/authStore'
import { handleServerError } from '~/utils/handle-server-error'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (error) => {
    // Handle global errors
    if (error.statusCode === 401) {
      const authStore = useAuthStore()
      authStore.auth.reset()
      const route = useRoute()
      navigateTo(`/sign-in?redirect=${route.fullPath}`)
    }

    if (error.statusCode === 500) {
      navigateTo('/500')
    }
  })

  // Handle API errors
  nuxtApp.vueApp.config.errorHandler = (error) => {
    handleServerError(error)
  }
})
