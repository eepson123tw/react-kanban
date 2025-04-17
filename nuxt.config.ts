// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  routeRules: {
    // Pre-render
    '/404.html': { prerender: true },
    // Redirects
    '/': { prerender: true },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/icon',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },
  css: [
    '~/assets/css/tailwind.css',
  ],
  sourcemap: true,
  future: {
    compatibilityVersion: 4,
  },
  app: {
    pageTransition: false,
    layoutTransition: false,
  },
  imports: {
    dirs: [
      './app/lib',
    ],
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
})
