import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ScreenPlannerCore',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['preact', '@preact/signals'],
      output: {
        globals: {
          preact: 'preact',
          '@preact/signals': 'signals',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
