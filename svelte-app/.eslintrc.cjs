module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
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
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'quote-props': ['error', 'as-needed'],
    'semi': ['error'],
    'semi-spacing': ['error'],
    'space-in-parens': ['error', 'never'],
    'spaced-comment': [
      'error',
      'always',
      {
        block: { balanced: true }
      }
    ],
	}
};
