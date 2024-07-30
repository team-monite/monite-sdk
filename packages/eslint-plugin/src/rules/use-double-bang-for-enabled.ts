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
        'Enforces the use of `!!` instead of `Boolean()` for the `enabled` property when converting values to boolean.',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      useDoubleBang:
        "Use '!!' instead of 'Boolean()' for the `enabled` property.",
    },
  },
  create(context: RuleContext<string, []>) {
    return {
      Property(node: TSESTree.Property) {
        // Check if the property name is 'enabled'
        if (node.key.type === 'Identifier' && node.key.name === 'enabled') {
          // Check if the value is a call to Boolean
          const value = node.value;
          if (
            value.type === 'CallExpression' &&
            value.callee.type === 'Identifier' &&
            value.callee.name === 'Boolean'
          ) {
            context.report({
              node,
              messageId: 'useDoubleBang',
              fix(fixer) {
                // Fix by replacing `Boolean(something)` with `!!something`
                const sourceCode = context.getSourceCode();
                const argText = sourceCode.getText(value.arguments[0]);
                return fixer.replaceText(value, `!!${argText}`);
              },
            });
          }
        }
      },
    };
  },
};

export = rule;
