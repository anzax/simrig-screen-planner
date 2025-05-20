// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import preact from '@astrojs/preact'
import { fileURLToPath, URL } from 'url'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@simrigbuild/screen-planner-core': fileURLToPath(
          new URL('../screen-planner-core/src/index.ts', import.meta.url)
        ),
      },
    },
  },

  integrations: [preact()],
})
