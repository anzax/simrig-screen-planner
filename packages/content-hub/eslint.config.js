import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import preactPlugin from 'eslint-plugin-preact'
import astroPlugin from 'eslint-plugin-astro'
import astroParser from 'astro-eslint-parser'

import path from 'path'
import { fileURLToPath } from 'url'

// ESM does not provide __dirname by default,
// so we derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  // 1) Ignore build outputs and node_modules
  { ignores: ['dist/**', 'node_modules/**'] },

  // 2) base JS rules
  js.configs.recommended,

  // 3) TypeScript and JavaScript files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

    languageOptions: {
      globals: { console: 'readonly' },
      parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      preact: preactPlugin,
    },
    rules: {
      // all @typescript-eslint/recommended rules
      ...ts.configs.recommended.rules,

      // your overrides
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'off',
    },
    settings: {
      react: {
        pragma: 'h',
        version: 'detect',
      },
    },
  },

  // 4) Astro files
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        // TypeScript options
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      astro: astroPlugin,
    },
    rules: {
      ...astroPlugin.configs.recommended.rules,
    },
  },

  // 5) Test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {},
  },

  // 6) Prettier (turns off conflicting rules)
  prettier,
]
