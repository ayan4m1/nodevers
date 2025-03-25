import globals from 'globals';
import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import-x';
import { config, configs } from 'typescript-eslint';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default config(
  eslint.configs.recommended,
  ...configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/jsx-uses-react': 0,
      'react/react-in-jsx-scope': 0
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import-x/resolver': {
        node: {
          paths: ['./src/']
        }
      }
    }
  },
  {
    files: ['webpack.config.ts'],
    languageOptions: {
      globals: globals.node
    }
  },
  prettierPlugin
);
