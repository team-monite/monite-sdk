const message =
  'The `t` macro must be called with an instance of `I18n` as its argument.';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce the `t` macro to be called with an instance of `I18n` as its argument. [Valid: t(i18n)`Hello`, Invalid: t`Hello`]',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      default: '{{ message }}',
    },
    schema: [],
  },
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (
          node.tag.type === 'CallExpression' &&
          node.tag.callee.type === 'Identifier' &&
          node.tag.callee.name === 't'
        ) {
          if (node.tag.arguments.length) return;

          return void context.report({
            node,
            messageId: 'default',
            data: { message },
          });
        } else if (node.tag.type === 'Identifier' && node.tag.name === 't') {
          return void context.report({
            node,
            messageId: 'default',
            data: { message },
          });
        }
      },
    };
  },
};
