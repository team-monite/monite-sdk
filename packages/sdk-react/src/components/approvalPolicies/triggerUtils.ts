/**
 * Shared utilities for approval policy trigger parsing and building
 */

export const NAMED_VALUES = {
  WAS_CREATED_BY_USER_ID: 'was_created_by_user_id',
  COUNTERPART_ID: 'counterpart_id',
  TAGS: 'tags.id',
  AMOUNT: 'amount',
  CURRENCY: 'currency',
} as const;

export type NamedValue = (typeof NAMED_VALUES)[keyof typeof NAMED_VALUES];

export const isValidTriggerKey = (key: string): key is NamedValue => {
  return Object.values(NAMED_VALUES).includes(key as NamedValue);
};

export const OPERATOR_OPERATIONS = {
  IN: 'in',
  EQUALS: '==',
  GREATER_THAN: '>',
  LESS_THAN: '<',
  GREATER_THAN_OR_EQUAL: '>=',
  LESS_THAN_OR_EQUAL: '<=',
  RANGE: 'range',
} as const;

export type OperatorOperation =
  (typeof OPERATOR_OPERATIONS)[keyof typeof OPERATOR_OPERATIONS];

export const isValidOperation = (
  operation: string
): operation is OperatorOperation =>
  Object.values(OPERATOR_OPERATIONS).includes(operation as OperatorOperation);

/**
 * Operator to check the named value against a value (single or list)
 * Format: named in [value1, value2]
 * Example: was_created_by_user_id in [user1, user2]
 * Used for: counterpart_id, was_created_by_user_id, amount, currency
 */
interface OperatorNamedValueOnValue {
  operator: string;
  left_operand: { name: NamedValue };
  right_operand: string | string[] | number;
}

/**
 * Operator to check a single value against a named value
 * Format: value in named[]
 * Example: tag1 in tags.id
 * Used for tags
 */
interface OperatorValueOnNamedValueList {
  operator: string;
  left_operand: string;
  right_operand: { name: NamedValue };
}

export type OperatorTrigger =
  | OperatorNamedValueOnValue
  | OperatorValueOnNamedValueList;

export interface ApprovalPolicyTriggers {
  all: Array<OperatorTrigger | string>;
}

/**
 * Formats a field name for use in trigger operands
 * @param fieldName - The field name (e.g., 'was_created_by_user_id')
 * @returns The formatted field name (e.g., 'invoice.was_created_by_user_id')
 */
export const formatFieldName = (fieldName: string): string => {
  return `invoice.${fieldName}`;
};

/**
 * Extracts the field name from a formatted field name
 * @param formattedFieldName - The formatted field name (e.g., 'invoice.was_created_by_user_id')
 * @returns The extracted field name (e.g., 'was_created_by_user_id')
 */
export const extractFieldName = (formattedFieldName: string): string => {
  return formattedFieldName.replace('invoice.', '');
};

/**
 * Checks if a trigger has named values that are lists
 *
 * For lists, the name is on the right_operand and values are on the left_operand
 *
 * Example:
 * {
 *   operator: 'in',
 *   left_operand: 'tag1',
 *   right_operand: { name: 'invoice.tags.id' }
 * }
 * @param trigger - The trigger object to check
 * @returns True if the trigger has named values that are lists
 */
const isNamedValuesList = (
  trigger: OperatorTrigger
): trigger is OperatorValueOnNamedValueList => {
  return (
    trigger.operator === OPERATOR_OPERATIONS.IN &&
    typeof trigger.left_operand === 'string' &&
    typeof trigger.right_operand === 'object' &&
    trigger.right_operand &&
    'name' in trigger.right_operand
  );
};

/**
 * Checks if a trigger has named values that are strings or numbers
 *
 * For strings/numbers, the name is on the left_operand and values are on the right_operand
 *
 * Example:
 * {
 *   operator: 'in',
 *   left_operand: { name: 'invoice.was_created_by_user_id' },
 *   right_operand: ['user1']
 * }
 * @param trigger - The trigger object to check
 * @returns True if the trigger has named values that are strings or numbers
 */
const isNamedValuesStringOrNumber = (
  trigger: OperatorTrigger
): trigger is OperatorNamedValueOnValue => {
  return (
    Boolean(trigger.left_operand) &&
    typeof trigger.left_operand === 'object' &&
    'name' in trigger.left_operand
  );
};

/**
 * Gets the field name and value from a trigger, regardless of format
 * @param trigger - The trigger object
 * @returns The field name and value or null if not found
 */
export const getTriggerKeyAndValue = (
  trigger: OperatorTrigger
): { key: string | null; value: string | string[] | number | null } => {
  if (isNamedValuesList(trigger)) {
    return {
      key: extractFieldName(trigger.right_operand.name),
      value: trigger.left_operand,
    };
  }

  if (isNamedValuesStringOrNumber(trigger)) {
    return {
      key: extractFieldName(trigger.left_operand?.name),
      value: trigger.right_operand,
    };
  }

  return {
    key: null,
    value: null,
  };
};
