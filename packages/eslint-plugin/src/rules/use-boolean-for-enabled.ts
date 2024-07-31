import type { TSESTree } from '@typescript-eslint/utils';
import type {
  RuleModule,
  RuleContext,
} from '@typescript-eslint/utils/dist/ts-eslint/Rule';

const rule: RuleModule<string> = {
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforces the use of `Boolean()` instead of `!!` for the `enabled` property.',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      useBoolean: "Use 'Boolean()' instead of '!!' for the `enabled` property.",
    },
  },
  create(context: RuleContext<string, []>) {
    return {
      Property(node: TSESTree.Property) {
        if (node.key.type === 'Identifier' && node.key.name === 'enabled') {
          const value = node.value;

          if (
            value.type === 'UnaryExpression' &&
            value.operator === '!' &&
            value.argument.type === 'UnaryExpression' &&
            value.argument.operator === '!'
          ) {
            const innerExpression = value.argument.argument;

            context.report({
              node,
              messageId: 'useBoolean',
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                const argText = sourceCode.getText(innerExpression);
                return fixer.replaceText(value, `Boolean(${argText})`);
              },
            });
          }
        }
      },
    };
  },
};

export = rule;
