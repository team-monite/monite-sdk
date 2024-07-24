import type { TSESTree } from '@typescript-eslint/utils';
import { findVariable } from '@typescript-eslint/utils/dist/ast-utils';
import type {
  RuleRecommendation,
  RuleModule,
} from '@typescript-eslint/utils/dist/ts-eslint/Rule';

const ruleModule: RuleModule<string, Options> = {
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensures that Components have `container` property specified. This is required for proper functioning of the component when used with Shadow DOM.',
      recommended: 'error' as RuleRecommendation,
    },
    schema: [
      {
        type: 'object',
        properties: {
          slotPropsPopperContainerPropertyMissing: {
            description:
              'List of components that have to match to "<Comp slotProps={{ popper: { container } }} />"',
            type: 'array',
            items: {
              type: 'object',
              required: ['component', 'import'],
              properties: {
                component: {
                  type: 'string',
                  description: 'Component name',
                },
                import: {
                  type: 'string',
                  description: 'Import name',
                },
              },
            },
          },
          slotPropsDialogContainerPropertyMissing: {
            description:
              'List of components that have to match to "<Comp slotProps={{ dialog: { container } }} />"',
            type: 'array',
            items: {
              type: 'object',
              required: ['component', 'import'],
              properties: {
                component: {
                  type: 'string',
                  description: 'Component name',
                },
                import: {
                  type: 'string',
                  description: 'Import name',
                },
              },
            },
          },
          containerPropertyMissing: {
            description:
              'List of components that have to match to "<Comp container={} />"',
            type: 'array',
            items: {
              type: 'object',
              required: ['component', 'import'],
              properties: {
                component: {
                  type: 'string',
                  description: 'Component name',
                },
                import: {
                  type: 'string',
                  description: 'Import name',
                },
              },
            },
          },
          menuPropsContainerPropertyMissing: {
            description:
              'List of components that have to match to "<Comp MenuProps={{ container }} />"',
            type: 'array',
            items: {
              type: 'object',
              required: ['component', 'import'],
              properties: {
                component: {
                  type: 'string',
                  description: 'Component name',
                },
                import: {
                  type: 'string',
                  description: 'Import name',
                },
              },
            },
          },
          selectPropsMenuPropsContainerPropertyMissing: {
            description:
              'List of components that have to match to "<Comp SelectProps={{ MenuProps: { container } }} />"',
            type: 'array',
            items: {
              type: 'object',
              required: ['component', 'import'],
              properties: {
                component: {
                  type: 'string',
                  description: 'Component name',
                },
                import: {
                  type: 'string',
                  description: 'Import name',
                },
                requiredPropertyList: {
                  type: 'array',
                  description:
                    'List of properties to which the rule will be applied.',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      slotPropsPopperContainerPropertyMissing:
        'Component {{component}} must have `slotProps={{ popper: { container } }}` property specified.',
      slotPropsDialogContainerPropertyMissing:
        'Component {{component}} must have `slotProps={{ dialog: { container } }}` property specified.',
      containerPropertyMissing:
        'Component {{component}} must have `container` property with the specified.',
      menuPropsContainerPropertyMissing:
        'Component {{component}} must have `MenuProps={{ container }}` property specified.',
      selectPropsMenuPropsContainerPropertyMissing:
        'Component {{component}} must have `SelectProps={{ MenuProps: { container } }}` property specified.',
    },
  },
  create(context) {
    const componentsByRule: Record<string, Option[]> = {
      // <Comp slotProps={{ popper: { container } }} />
      slotPropsPopperContainerPropertyMissing: [
        { component: 'DatePicker', import: '@mui/x-date-pickers' },
        { component: 'Autocomplete', import: '@mui/material' },
      ],

      // <Comp slotProps={{ dialog: { container } }} />
      slotPropsDialogContainerPropertyMissing: [
        { component: 'DatePicker', import: '@mui/x-date-pickers' },
      ],

      // <Comp MenuProps={{ container }} />
      menuPropsContainerPropertyMissing: [
        { component: 'Select', import: '@mui/material' },
      ],

      // <Comp SelectProps={{ MenuProps: { container } }} />
      selectPropsMenuPropsContainerPropertyMissing: [
        {
          component: 'TextField',
          import: '@mui/material',
          requiredPropertyList: ['select'],
        },
        { component: 'TablePagination', import: '@mui/material' },
      ],

      // <Comp container={} />
      containerPropertyMissing: [
        { component: 'Menu', import: '@mui/material' },
        { component: 'Dialog', import: '@mui/material' },
        { component: 'Modal', import: '@mui/material' },
        { component: 'Popper', import: '@mui/material' },
        { component: 'Portal', import: '@mui/material' },
        { component: 'Unstable_Popup', import: '@mui/material' },
        { component: 'Popup', import: '@mui/material' },
      ],
    };

    context.options.map((option) => {
      for (const ruleName in componentsByRule) {
        if (option[ruleName as keyof typeof option]) {
          componentsByRule[ruleName] = [
            ...componentsByRule[ruleName],
            ...option[ruleName as keyof typeof option],
          ];
        }
      }
    });

    const muiImportedComponents: Record<string, string> = {};

    const importsToComponents = Object.values(componentsByRule)
      .flat()
      .reduce((acc, curr) => {
        if (!acc[curr.import]) acc[curr.import] = [];
        acc[curr.import].push(curr.component);
        return acc;
      }, {} as Record<string, string[]>);

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (
          typeof importSource !== 'string' ||
          !(importSource in importsToComponents)
        )
          return;

        node.specifiers.forEach((specifier) => {
          if ('imported' in specifier && specifier.local) {
            if (
              importsToComponents[importSource].includes(
                specifier.imported.name
              )
            )
              muiImportedComponents[specifier.local.name] =
                specifier.imported.name;
          }
        });
      },

      JSXElement(node: TSESTree.JSXElement) {
        const jsxOpeningElementNode = node.openingElement;
        const componentName = getIdentifierName(jsxOpeningElementNode.name);

        if (!muiImportedComponents[componentName]) return;

        const spreadAttribute = jsxOpeningElementNode.attributes.find(
          (attribute): attribute is TSESTree.JSXSpreadAttribute =>
            attribute.type === 'JSXSpreadAttribute'
        );

        if (spreadAttribute) {
          let spreadVariableName: string | null = null;

          if (spreadAttribute.argument.type === 'Identifier') {
            spreadVariableName = spreadAttribute.argument.name;
          } else if (
            spreadAttribute.argument.type === 'MemberExpression' &&
            spreadAttribute.argument.property.type === 'Identifier'
          ) {
            spreadVariableName = spreadAttribute.argument.property.name;
          }

          if (
            spreadVariableName === 'menuProps' ||
            spreadVariableName === 'restProps'
          ) {
            return;
          }
        }

        const slotPropsPopperContainerPropertyMissingComponentItem =
          componentsByRule.slotPropsPopperContainerPropertyMissing.find(
            ({ component }) =>
              component === muiImportedComponents[componentName]
          );

        if (slotPropsPopperContainerPropertyMissingComponentItem) {
          const slotPropsAttribute = jsxOpeningElementNode.attributes.find(
            (attribute) =>
              attribute.type === 'JSXAttribute' &&
              attribute.name.name === 'slotProps' // finds jsx props `<Comp slotProps={} />`
          );

          if (
            !slotPropsAttribute ||
            !('value' in slotPropsAttribute) ||
            slotPropsAttribute.value.type !== 'JSXExpressionContainer'
          ) {
            return context.report({
              node: node,
              messageId: 'slotPropsPopperContainerPropertyMissing',
              data: { component: componentName },
            });
          }

          const slotPropsExpression = slotPropsAttribute.value.expression;
          if (
            slotPropsExpression.type !== 'ObjectExpression' ||
            !slotPropsExpression.properties.some(
              (prop) =>
                prop.type === 'Property' &&
                prop.key.type === 'Identifier' &&
                prop.key.name === 'popper' && // finds `<Comp slotProps={{ popper }} />`
                prop.value.type === 'ObjectExpression' &&
                prop.value.properties.some(
                  (innerProp) =>
                    innerProp.type === 'Property' &&
                    innerProp.key.type === 'Identifier' &&
                    innerProp.key.name === 'container' // finds `<Comp slotProps={{ popper: { container } }} />`
                )
            )
          ) {
            return context.report({
              node,
              messageId: 'slotPropsPopperContainerPropertyMissing',
              data: { component: componentName },
            });
          }
        }

        const slotPropsDialogContainerPropertyMissingComponentItem =
          componentsByRule.slotPropsDialogContainerPropertyMissing.find(
            ({ component }) =>
              component === muiImportedComponents[componentName]
          );

        if (slotPropsDialogContainerPropertyMissingComponentItem) {
          const slotPropsAttribute = jsxOpeningElementNode.attributes.find(
            (attribute) =>
              attribute.type === 'JSXAttribute' &&
              attribute.name.name === 'slotProps' // finds jsx props `<Comp slotProps={} />`
          );

          if (
            !slotPropsAttribute ||
            !('value' in slotPropsAttribute) ||
            slotPropsAttribute.value.type !== 'JSXExpressionContainer'
          ) {
            return context.report({
              node: node,
              messageId: 'slotPropsDialogContainerPropertyMissing',
              data: { component: componentName },
            });
          }

          const slotPropsExpression = slotPropsAttribute.value.expression;
          if (
            slotPropsExpression.type !== 'ObjectExpression' ||
            !slotPropsExpression.properties.some(
              (prop) =>
                prop.type === 'Property' &&
                prop.key.type === 'Identifier' &&
                prop.key.name === 'dialog' && // finds `<Comp slotProps={{ dialog }} />`
                prop.value.type === 'ObjectExpression' &&
                prop.value.properties.some(
                  (innerProp) =>
                    innerProp.type === 'Property' &&
                    innerProp.key.type === 'Identifier' &&
                    innerProp.key.name === 'container' // finds `<Comp slotProps={{ dialog: { container } }} />`
                )
            )
          ) {
            return context.report({
              node,
              messageId: 'slotPropsDialogContainerPropertyMissing',
              data: { component: componentName },
            });
          }
        }

        const selectPropsMenuPropsContainerPropertyMissingComponentItem =
          componentsByRule.selectPropsMenuPropsContainerPropertyMissing.find(
            ({ component }) =>
              component === muiImportedComponents[componentName]
          );

        if (selectPropsMenuPropsContainerPropertyMissingComponentItem) {
          if (
            selectPropsMenuPropsContainerPropertyMissingComponentItem
              .requiredPropertyList?.length
          ) {
            if (
              !jsxOpeningElementNode.attributes.some(
                (attribute) =>
                  attribute.type === 'JSXAttribute' &&
                  selectPropsMenuPropsContainerPropertyMissingComponentItem.requiredPropertyList.includes(
                    getIdentifierName(attribute.name)
                  )
              )
            )
              return;
          }

          const selectPropsAttribute = jsxOpeningElementNode.attributes.find(
            (attribute) =>
              attribute.type === 'JSXAttribute' &&
              attribute.name.name === 'SelectProps' // finds jsx props `<Comp SelectProps={} />`
          );

          if (
            !selectPropsAttribute ||
            !('value' in selectPropsAttribute) ||
            selectPropsAttribute.value.type !== 'JSXExpressionContainer'
          ) {
            return context.report({
              node,
              messageId: 'selectPropsMenuPropsContainerPropertyMissing',
              data: { component: componentName },
            });
          }

          const slotPropsExpression = selectPropsAttribute.value.expression;
          if (
            slotPropsExpression.type !== 'ObjectExpression' ||
            !slotPropsExpression.properties.some(
              (prop) =>
                prop.type === 'Property' &&
                prop.key.type === 'Identifier' &&
                prop.key.name === 'MenuProps' && // finds `<Comp SelectProps={{ MenuProps }} />`
                prop.value.type === 'ObjectExpression' &&
                prop.value.properties.some(
                  (innerProp) =>
                    innerProp.type === 'Property' &&
                    innerProp.key.type === 'Identifier' &&
                    innerProp.key.name === 'container' // finds `<Comp SelectProps={{ MenuProps: { container } }} />`
                )
            )
          ) {
            return context.report({
              node,
              messageId: 'selectPropsMenuPropsContainerPropertyMissing',
              data: { component: componentName },
            });
          }
        }

        const menuPropsContainerPropertyMissingComponentItem =
          componentsByRule.menuPropsContainerPropertyMissing.find(
            ({ component }) =>
              component === muiImportedComponents[componentName]
          );

        if (menuPropsContainerPropertyMissingComponentItem) {
          const menuPropsAttribute = jsxOpeningElementNode.attributes.find(
            (attribute) =>
              attribute.type === 'JSXAttribute' &&
              attribute.name.name === 'MenuProps' // finds jsx props `<Comp MenuProps={}/>`
          );

          if (
            !menuPropsAttribute ||
            !('value' in menuPropsAttribute) ||
            menuPropsAttribute.value.type !== 'JSXExpressionContainer'
          ) {
            return context.report({
              node,
              messageId: 'menuPropsContainerPropertyMissing',
              data: { component: componentName },
            });
          }

          const menuPropsExpression = menuPropsAttribute.value.expression;
          if (
            menuPropsExpression.type !== 'ObjectExpression' ||
            !menuPropsExpression.properties.some(
              (prop) =>
                prop.type === 'Property' &&
                prop.key.type === 'Identifier' &&
                prop.key.name === 'container' // finds `<Comp MenuProps={{ container }} />`
            )
          ) {
            return context.report({
              node,
              messageId: 'menuPropsContainerPropertyMissing',
              data: { component: componentName },
            });
          }
        }

        const containerPropertyMissingComponentItem =
          componentsByRule.containerPropertyMissing.find(
            ({ component }) =>
              component === muiImportedComponents[componentName]
          );

        if (containerPropertyMissingComponentItem) {
          const containerPropsAttribute = jsxOpeningElementNode.attributes.find(
            (attribute) =>
              attribute.type === 'JSXAttribute' &&
              attribute.name.name === 'container' // finds jsx props `<Comp container={} />`
          );

          if (!containerPropsAttribute) {
            return context.report({
              node,
              messageId: 'containerPropertyMissing',
              data: { component: componentName },
            });
          }
        }
      },
    };
  },
};

function getIdentifierName(
  jsxTagNameExpression: TSESTree.JSXTagNameExpression
) {
  return (
    jsxTagNameExpression.type === 'JSXIdentifier' && jsxTagNameExpression.name
  );
}

type Option = {
  component: string;
  import: string;
  requiredPropertyList?: string[];
};

type Options = Record<
  | 'slotPropsPopperContainerPropertyMissing'
  | 'slotPropsDialogContainerPropertyMissing'
  | 'containerPropertyMissing'
  | 'menuPropsContainerPropertyMissing'
  | 'selectPropsMenuPropsContainerPropertyMissing',
  Option[]
>[];

export = ruleModule;
