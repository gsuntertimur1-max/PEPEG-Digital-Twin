import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
export default [
  { ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  { files: ['**/*.{js,jsx}'], languageOptions: { globals: { ...globals.browser, ...globals.node }, parserOptions: { ecmaFeatures: { jsx: true } } }, plugins: { react }, rules: { ...react.configs.recommended.rules, 'react/react-in-jsx-scope': 'off', 'react/prop-types': 'off', 'react/no-unknown-property': 'off', 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }] }, settings: { react: { version: 'detect' } } }
];
