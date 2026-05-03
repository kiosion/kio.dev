const allowedSpecialChars = [
  '&nbsp;',
  '&bull;',
  '•',
  '#',
  '&',
  '...',
  '[',
  ']',
  '(',
  ')',
  ':',
  ';',
  '/'
];

const htmlEntityRegex = /^&[a-zA-Z]+;$/;

module.exports = {
  'no-bare-strings': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow bare strings in Svelte component templates',
        category: 'Best Practices'
      },
      fixable: 'code',
      schema: []
    },
    create(context) {
      const elementStack = [];

      return {
        SvelteElement(node) {
          if (node.name && node.name.name) {
            elementStack.push(node.name.name);
          } else {
            elementStack.push(null);
          }
        },
        'SvelteElement:exit'() {
          elementStack.pop();
        },
        SvelteText(node) {
          const text = node.value;

          if (!/\S/.test(text)) {
            return;
          }

          if (elementStack.includes('script') || elementStack.includes('style')) {
            return;
          }

          const trimmedText = text.trim();

          if (trimmedText.length === 1 || !/[\w]/.test(trimmedText)) {
            return;
          }

          if (allowedSpecialChars.includes(trimmedText)) {
            return;
          }

          if (htmlEntityRegex.test(trimmedText)) {
            return;
          }

          const parent = node.parent;

          if (
            parent.type === 'SvelteMustacheTag' &&
            parent.expression.type === 'CallExpression' &&
            parent.expression.callee.name === '$t'
          ) {
            return;
          }

          if (parent.type === 'SvelteAttribute' || parent.type === 'SvelteStyleElement') {
            return;
          }

          context.report({
            node,
            message: 'Bare strings are not allowed in templates. Use $t(...) instead.',
            fix(fixer) {
              const escapedText = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
              const replacement = `{$t('${escapedText}')}`;
              return fixer.replaceText(node, replacement);
            }
          });
        }
      };
    }
  }
};
