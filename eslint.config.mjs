//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginReact from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    './server/**',
    './commitlint.config.js',
    './prettier.config.js',
  ]),
  ...tanstackConfig,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs['jsx-runtime'].rules,
    },
    settings: {
      react: {
        version: 'detect', // You can add this if you get a warning about the React version when you lint
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
])
