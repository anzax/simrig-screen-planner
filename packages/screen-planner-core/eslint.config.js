import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import preactPlugin from 'eslint-plugin-preact'

import path from 'path'
import { fileURLToPath } from 'url'

// ESM does not provide __dirname by default,
// so we derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  // 1) base JS rules
  js.configs.recommended,

  // 2) TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],

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
      // "preact/no-unknown-property": "error",  // removed: not available in eslint-plugin-preact v0.x
      'no-undef': 'off',
    },
    settings: {
      react: {
        pragma: 'h',
        version: 'detect',
      },
    },
  },

  // 3) Jest test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    languageOptions: { globals: { describe: 'readonly', it: 'readonly', expect: 'readonly' } },
    rules: {},
  },

  // 4) Prettier (turns off conflicting rules)
  prettier,
]
