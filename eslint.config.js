import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import { reactRefresh } from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [js.configs.recommended, reactHooks.configs.flat['recommended-latest'], reactRefresh.configs.vite()],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', ignoreRestSiblings: true }],
    },
  },
  {
    // Playwright fixtures call `use()`, which is not React's hook.
    files: ['tests/**'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
]);
