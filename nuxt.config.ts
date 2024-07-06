// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8000/api', // Add your base URL here
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  devtools: { enabled: true },
  modules: [(_options, nuxt) => {
    nuxt.hooks.hook('vite:extendConfig', (config) => {
      // @ts-expect-error
      config.plugins.push(vuetify({ autoImport: true }))
    })
  }, '@nuxtjs/tailwindcss'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  app: {
    head: {
      title: 'BOS App',
      meta: [
        {
          name: 'description', content: 'Jembods apps'
        }
      ],
      link: [
        { rel: 'stylesheet' }
      ]
    }
  }
})
