import svelteEslintParser from 'svelte-eslint-parser';

import js from '@eslint/js';
// @ts-expect-error Missing types
import prettierConfig from 'eslint-config-prettier';
// @ts-expect-error Missing types
import importLint from 'eslint-plugin-import';
// @ts-expect-error Missing types
import localRulesLint from 'eslint-plugin-local-rules';
import prettierLint from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default ts.config([
  js.configs.recommended,
  ts.configs.recommendedTypeChecked,
  prettierConfig,
  svelte.configs['flat/recommended'],
  {
    files: [
      '**/*.ts',
      '**/*.js',
      '**/*.svelte',
      './src/routes/[[lang=lang]]/.well-known/[path]/+server.ts'
    ],

    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.svelte'],
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        browser: true,
        node: true,
        es2017: true
      }
    },
    plugins: {
      prettier: prettierLint,
      svelte,
      import: importLint,
      '@typescript-eslint': ts.plugin,
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'no-undef': 0,
      'no-unused-vars': 0,
      'no-constant-condition': 0,

      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/no-misused-promises': 1,
      '@typescript-eslint/no-floating-promises': 1,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/no-unsafe-argument': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/prefer-namespace-keyword': 0,
      '@typescript-eslint/no-namespace': 0,
      '@typescript-eslint/restrict-template-expressions': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/unbound-method': 0,
      // SK error objs or redirects may be thrown
      '@typescript-eslint/only-throw-error': 0,
      '@typescript-eslint/no-unused-vars': [
        2,
        { varsIgnorePattern: '^_*', argsIgnorePattern: '^_*' }
      ],
      '@typescript-eslint/ban-ts-comment': [
        2,
        {
          'ts-expect-error': 'allow-with-description'
        }
      ],
      'array-bracket-spacing': [2, 'never'],
      'arrow-spacing': 2,
      'block-scoped-var': 2,
      'block-spacing': 2,
      'brace-style': [2, '1tbs'],
      'comma-dangle': [2, 'never'],
      'comma-spacing': 2,
      'comma-style': 2,
      curly: 2,
      'dot-notation': 2,
      eqeqeq: 2,
      'func-call-spacing': ['error', 'never'],
      'import/no-duplicates': 2,
      'import/no-unresolved': 0,
      'import/default': 0,
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0,
      'key-spacing': 2,
      'keyword-spacing': 2,
      'linebreak-style': 2,
      'no-confusing-arrow': 0,
      'no-duplicate-imports': 0,
      'no-trailing-spaces': 2,
      'no-var': 2,
      'no-eval': 2,
      'no-extra-bind': 2,
      'no-implicit-globals': 2,
      'no-implied-eval': 2,
      'no-loop-func': 2,
      'no-multi-spaces': 2,
      'no-prototype-builtins': 2,
      'no-redeclare': 2,
      'no-setter-return': 2,
      'no-script-url': 2,
      'no-restricted-imports': [
        2,
        {
          patterns: [
            {
              group: ['./*', '../*', '!./$types'],
              message: "Only use relative imports from './$types'."
            }
          ]
        }
      ],
      'object-shorthand': 2,
      'one-var-declaration-per-line': 2,
      'prettier/prettier': 2,
      'arrow-body-style': 0,
      'prefer-arrow-callback': 0,
      quotes: [2, 'single', { avoidEscape: true }],
      'quote-props': [2, 'as-needed'],
      semi: [2, 'always'],
      'semi-spacing': 2,
      'simple-import-sort/imports': [
        2,
        {
          groups: [
            // Side effect imports
            ['^\u0000(?!.*\u0000$)'],
            // Svelte internal imports
            ['^svelte(/)?(?!.*\u0000$)'],
            // Svelte-related deps
            ['^svelte-(?!.*\u0000$)'],
            // Non-component path-aliased '$' imports
            ['^\\$(?!components)(/)?(?!.*\u0000$)'],
            // Component imports
            ['^\\$components(/)?(?!.*\u0000$)'],
            // Absolute imports
            ['^[^.](?!.*\u0000$)'],
            // Relative imports
            ['^\\.(?!.*\u0000$)'],
            // Type imports
            ['\u0000$']
          ]
        }
      ],
      'simple-import-sort/exports': 2,
      'space-in-parens': [2, 'never'],
      'spaced-comment': [
        2,
        'always',
        {
          block: { balanced: true }
        }
      ],
      'svelte/valid-compile': 0,
      'svelte/no-dupe-use-directives': 2,
      'svelte/no-dupe-on-directives': 2,
      'svelte/infinite-reactive-loop': 1,
      'svelte/no-store-async': 2,
      'svelte/block-lang': [
        2,
        {
          enforceScriptPresent: false,
          enforceStylePresent: false,
          script: ['ts'],
          style: ['scss']
        }
      ],
      'svelte/comment-directive': 2,
      'svelte/no-at-html-tags': 2,
      'svelte/no-dupe-else-if-blocks': 2,
      'svelte/no-dupe-style-properties': 2,
      'svelte/no-dynamic-slot-name': 2,
      'svelte/no-inner-declarations': 2,
      'svelte/no-not-function-handler': 2,
      'svelte/no-object-in-text-mustaches': 2,
      'svelte/no-shorthand-style-property-overrides': 2,
      'svelte/no-unknown-style-directive-property': 2,
      'svelte/no-unused-svelte-ignore': 2,
      'svelte/system': 2,
      'svelte/no-at-debug-tags': 2,
      'svelte/no-ignored-unsubscribe': 2,
      'svelte/no-immutable-reactive-statements': 2,
      'svelte/no-useless-mustaches': 2,
      'svelte/require-optimized-style-attribute': 2,
      'svelte/no-trailing-spaces': 2,
      'svelte/no-spaces-around-equal-signs-in-attribute': 2,
      'svelte/prefer-class-directive': 2,
      'svelte/valid-each-key': 2,
      'svelte/require-store-reactive-access': 2,
      'svelte/button-has-type': 2,
      'svelte/no-reactive-functions': 2,
      'svelte/no-target-blank': 2,
      'svelte/valid-prop-names-in-kit-pages': 2,
      'svelte/require-store-callbacks-use-set-param': 2,
      'svelte/no-reactive-reassign': 2,
      'svelte/no-dom-manipulating': 2,
      'svelte/no-reactive-literals': 2,
      'svelte/prefer-destructured-store-props': 2
    },
    settings: {
      'svelte3/typescript': true
    },
    ignores: [
      '**/.DS_Store',
      '**/*.cjs',
      '**/node_modules',
      '**/dist',
      '**/build',
      '**/.svelte-kit/**',
      '**/package',
      '**/.env',
      '**/.env.*',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/*.nvmrc'
    ]
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteEslintParser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      'local-rules': localRulesLint
    },
    rules: {
      // SK error objs or redirects may be thrown
      '@typescript-eslint/only-throw-error': 0,

      'svelte/no-at-html-tags': 1,
      'svelte/prefer-destructured-store-props': 1,

      'local-rules/no-bare-strings': 2
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 0
    }
  }
]);
