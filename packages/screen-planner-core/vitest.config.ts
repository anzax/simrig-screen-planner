import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
      all: true,
      include: ['src'],
      exclude: ['**/types.ts', '**/components/**'],
    },
  },
})
