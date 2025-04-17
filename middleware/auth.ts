export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Check authentication status
  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    return navigateTo(`/sign-in?redirect=${to.fullPath}`)
  }
})
