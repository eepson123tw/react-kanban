import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: {
      // Your auth state
      reset: () => {
        // Reset auth state
      },
    },
  }),
  actions: {
    // Auth actions
  },
})
