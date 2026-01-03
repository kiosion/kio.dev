// @ts-check

import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import sortPlugin from 'eslint-plugin-simple-import-sort';
import sveltePlugin from 'eslint-plugin-svelte';
import unusedImports from 'eslint-plugin-unused-imports';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.svelte']
      }
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': sortPlugin,
      'unused-imports': unusedImports
    },
    rules: {
      // original overrides
      '@typescript-eslint/no-unused-expressions': [0],
      // this rule is just wrong too often.
      '@typescript-eslint/no-redundant-type-constituents': [0],
      // same with this one, apparently 'Element' and 'HTMLElement' are identical, ffs.
      '@typescript-eslint/no-unnecessary-type-assertion': [0],
      '@typescript-eslint/no-unsafe-assignment': [0],
      '@typescript-eslint/no-floating-promises': [0],
      '@typescript-eslint/only-throw-error': [0],
      '@typescript-eslint/unbound-method': [0],
      '@typescript-eslint/no-unsafe-call': [0],
      '@typescript-eslint/no-unsafe-argument': [0],
      '@typescript-eslint/no-unsafe-return': [0],
      '@typescript-eslint/no-unsafe-member-access': [0],
      '@typescript-eslint/no-unsafe-arguments': [0],
      '@typescript-eslint/prefer-namespace-keyword': [0],
      '@typescript-eslint/no-namespace': [0],
      '@typescript-eslint/restrict-template-expressions': [0],
      '@typescript-eslint/no-unused-vars': [0],
      '@typescript-eslint/no-misused-promises': [0],
      '@typescript-eslint/no-base-to-string': [0],
      '@typescript-eslint/restrict-plus-operands': [0],
      '@typescript-eslint/ban-ts-comment': [
        2,
        {
          'ts-expect-error': 'allow-with-description'
        }
      ],

      'prettier/prettier': [2],

      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': 'error',
      'block-scoped-var': 'error',
      'block-spacing': 'error',
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'never'],
      'comma-spacing': 'error',
      'comma-style': 'error',
      curly: 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'func-call-spacing': ['error', 'never'],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'linebreak-style': 'error',
      'no-confusing-arrow': 'off',
      'no-duplicate-imports': 'off',
      'no-trailing-spaces': 'error',
      'no-var': 'error',
      'no-eval': 'error',
      'no-extra-bind': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-loop-func': 'error',
      'no-multi-spaces': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': 'error',
      'no-setter-return': 'error',
      'no-script-url': 'error',
      'no-unused-vars': 'off',

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*', '!./$types'],
              message: "Only use relative imports from './$types'."
            }
          ]
        }
      ],

      'object-shorthand': 'error',
      'one-var-declaration-per-line': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      quotes: ['error', 'single', { avoidEscape: true }],
      'quote-props': ['error', 'as-needed'],
      semi: ['error', 'always'],
      'semi-spacing': 'error',
      'space-in-parens': ['error', 'never'],
      'spaced-comment': ['error', 'always', { block: { balanced: true } }],

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^svelte(/)?'],
            ['^svelte-'],
            ['^\\$(?!components)(/)?'],
            ['^\\$components(/)?'],
            ['^[^.].*'],
            ['^\\.'],
            ['\\u0000$']
          ]
        }
      ],
      'simple-import-sort/exports': 'error',

      'unused-imports/no-unused-imports': [1],
      'unused-imports/no-unused-vars': [
        2,
        {
          vars: 'all',
          varsIgnorePattern: '^_*?',
          args: 'after-used',
          argsIgnorePattern: '^_*?'
        }
      ]
    }
  },

  // Svelte override
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },
    plugins: {
      svelte: sveltePlugin
    },
    rules: {
      'no-undef': [0],
      'svelte/missing-declaration': [0],
      // 'local-rules/no-bare-strings': [2],
      'svelte/no-dupe-use-directives': [2],
      'svelte/no-dupe-on-directives': [2],
      'svelte/infinite-reactive-loop': [1],
      'svelte/no-store-async': [2],
      'svelte/block-lang': [
        2,
        {
          enforceScriptPresent: false,
          enforceStylePresent: false,
          script: ['ts'],
          style: ['scss']
        }
      ],
      'svelte/no-at-debug-tags': [2],
      'svelte/no-ignored-unsubscribe': [2],
      'svelte/no-immutable-reactive-statements': [2],
      'svelte/no-useless-mustaches': [2],
      'svelte/require-optimized-style-attribute': [2],
      'svelte/no-trailing-spaces': [2],
      'svelte/no-spaces-around-equal-signs-in-attribute': [2],
      'svelte/prefer-class-directive': [2],
      'svelte/valid-each-key': [2],
      'svelte/require-store-reactive-access': [2],
      'svelte/button-has-type': [2],
      'svelte/no-reactive-functions': [2],
      'svelte/no-target-blank': [2],
      'svelte/valid-prop-names-in-kit-pages': [2],
      'svelte/require-store-callbacks-use-set-param': [2],
      'svelte/no-reactive-reassign': [2],
      'svelte/no-dom-manipulating': [2],
      'svelte/no-reactive-literals': [2],
      'svelte/prefer-destructured-store-props': [1]
    }
  },

  // Test file override
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      'no-restricted-imports': 'off'
    }
  }
);
