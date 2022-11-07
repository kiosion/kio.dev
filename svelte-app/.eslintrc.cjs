module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  env: {
    browser: true,
    node: true,
    es2017: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  plugins: ['svelte3', 'prettier', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unsafe-assignment': ['off'],
    '@typescript-eslint/no-unsafe-return': ['off'],
    '@typescript-eslint/no-unsafe-call': ['off'],
    '@typescript-eslint/no-unsafe-member-access': ['off'],
    '@typescript-eslint/restrict-template-expressions': ['off'],
    'prettier/prettier': ['error'],
    'array-bracket-spacing': ['error', 'never'],
    'arrow-spacing': ['error'],
    'block-scoped-var': ['error'],
    'block-spacing': ['error'],
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'never'],
    'comma-spacing': ['error'],
    'comma-style': ['error'],
    'curly': ['error'],
    'dot-notation': ['error'],
    'eqeqeq': ['error'],
    'func-call-spacing': ['error', 'never'],
    'key-spacing': ['error'],
    'keyword-spacing': ['error'],
    'linebreak-style': ['error'],
    'no-confusing-arrow': ['error'],
    'no-duplicate-imports': ['error'],
    'no-trailing-spaces': ['error'],
    'no-var': ['error'],
    'no-eval': ['error'],
    'no-extra-bind': ['error'],
    'no-implicit-globals': ['error'],
    'no-implied-eval': ['error'],
    'no-loop-func': ['error'],
    'no-multi-spaces': ['error'],
    'no-prototype-builtins': ['error'],
    'no-redeclare': ['error'],
    'no-setter-return': ['error'],
    'no-script-url': ['error'],
    'object-shorthand': ['error'],
    'one-var-declaration-per-line': ['error'],
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'quote-props': ['error', 'as-needed'],
    'semi': ['error', 'always'],
    'semi-spacing': ['error'],
    'space-in-parens': ['error', 'never'],
    'spaced-comment': [
      'error',
      'always',
      {
        'block': { 'balanced': true }
      }
    ]
  },
  overrides: [
    { 
      files: [
        '*.svelte'
      ], 
      processor: 'svelte3/svelte3'
    }
  ],
  settings: {
    'svelte3/typescript': () => require('typescript')
  },
  ignorePatterns: [
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
    '**/yarn.lock'
  ]
};
