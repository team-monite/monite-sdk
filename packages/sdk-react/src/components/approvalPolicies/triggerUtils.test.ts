import {
  formatFieldName,
  extractFieldName,
  getTriggerKeyAndValue,
  NAMED_VALUES,
  OPERATOR_OPERATIONS,
  isValidTriggerKey,
  isValidOperation,
  NamedValue,
} from './triggerUtils';

describe('triggerUtils', () => {
  describe('formatFieldName', () => {
    test('should format field names correctly', () => {
      expect(formatFieldName('was_created_by_user_id')).toBe(
        'invoice.was_created_by_user_id'
      );
      expect(formatFieldName('counterpart_id')).toBe('invoice.counterpart_id');
      expect(formatFieldName('tags.id')).toBe('invoice.tags.id');
      expect(formatFieldName('amount')).toBe('invoice.amount');
      expect(formatFieldName('currency')).toBe('invoice.currency');
    });
  });

  describe('extractFieldName', () => {
    test('should extract field names correctly', () => {
      expect(extractFieldName('invoice.was_created_by_user_id')).toBe(
        'was_created_by_user_id'
      );
      expect(extractFieldName('invoice.counterpart_id')).toBe('counterpart_id');
      expect(extractFieldName('invoice.tags.id')).toBe('tags.id');
      expect(extractFieldName('invoice.amount')).toBe('amount');
      expect(extractFieldName('invoice.currency')).toBe('currency');
    });

    test('should handle field names without invoice prefix', () => {
      expect(extractFieldName('was_created_by_user_id')).toBe(
        'was_created_by_user_id'
      );
      expect(extractFieldName('tags.id')).toBe('tags.id');
    });
  });

  describe('getTriggerKeyAndValue', () => {
    test('should extract key and value from named values that are strings or numbers', () => {
      const trigger = {
        operator: 'in',
        left_operand: { name: 'invoice.was_created_by_user_id' as NamedValue },
        right_operand: ['user1', 'user2'],
      };

      const result = getTriggerKeyAndValue(trigger);
      expect(result.key).toBe('was_created_by_user_id');
      expect(result.value).toEqual(['user1', 'user2']);
    });

    test('should extract key and value from named values that are lists', () => {
      const trigger = {
        operator: 'in',
        left_operand: 'tag1',
        right_operand: { name: 'invoice.tags.id' as NamedValue },
      };

      const result = getTriggerKeyAndValue(trigger);
      expect(result.key).toBe('tags.id');
      expect(result.value).toBe('tag1');
    });

    test('should handle amount triggers correctly', () => {
      const trigger = {
        operator: '>',
        left_operand: { name: 'invoice.amount' as NamedValue },
        right_operand: 1000,
      };

      const result = getTriggerKeyAndValue(trigger);
      expect(result.key).toBe('amount');
      expect(result.value).toBe(1000);
    });

    test('should handle currency triggers correctly', () => {
      const trigger = {
        operator: 'in',
        left_operand: { name: 'invoice.currency' as NamedValue },
        right_operand: 'USD',
      };

      const result = getTriggerKeyAndValue(trigger);
      expect(result.key).toBe('currency');
      expect(result.value).toBe('USD');
    });

    test('should return null for invalid format', () => {
      const trigger = {
        operator: 'invalid',
        left_operand: 'invalid',
        right_operand: 'invalid',
      } as any;

      const result = getTriggerKeyAndValue(trigger);
      expect(result.key).toBe(null);
      expect(result.value).toBe(null);
    });

    test('should handle triggers with missing properties', () => {
      const trigger = {
        operator: 'in',
        left_operand: null,
        right_operand: null,
      } as any;

      const result = getTriggerKeyAndValue(trigger);
      expect(result.key).toBe(null);
      expect(result.value).toBe(null);
    });
  });

  describe('isValidTriggerKey', () => {
    test('should validate trigger keys correctly', () => {
      expect(isValidTriggerKey('was_created_by_user_id')).toBe(true);
      expect(isValidTriggerKey('counterpart_id')).toBe(true);
      expect(isValidTriggerKey('tags.id')).toBe(true);
      expect(isValidTriggerKey('amount')).toBe(true);
      expect(isValidTriggerKey('currency')).toBe(true);

      expect(isValidTriggerKey('invalid')).toBe(false);
      expect(isValidTriggerKey('')).toBe(false);
      expect(isValidTriggerKey('tags')).toBe(false); // Should be 'tags.id'
    });
  });

  describe('isValidOperation', () => {
    test('should validate operations correctly', () => {
      expect(isValidOperation('in')).toBe(true);
      expect(isValidOperation('==')).toBe(true);
      expect(isValidOperation('>')).toBe(true);
      expect(isValidOperation('<')).toBe(true);
      expect(isValidOperation('>=')).toBe(true);
      expect(isValidOperation('<=')).toBe(true);
      expect(isValidOperation('range')).toBe(true);

      expect(isValidOperation('invalid')).toBe(false);
      expect(isValidOperation('')).toBe(false);
      expect(isValidOperation('equals')).toBe(false);
    });
  });

  describe('constants', () => {
    test('should have correct field names', () => {
      expect(NAMED_VALUES.WAS_CREATED_BY_USER_ID).toBe(
        'was_created_by_user_id'
      );
      expect(NAMED_VALUES.COUNTERPART_ID).toBe('counterpart_id');
      expect(NAMED_VALUES.TAGS).toBe('tags.id');
      expect(NAMED_VALUES.AMOUNT).toBe('amount');
      expect(NAMED_VALUES.CURRENCY).toBe('currency');
    });

    test('should have correct operators', () => {
      expect(OPERATOR_OPERATIONS.IN).toBe('in');
      expect(OPERATOR_OPERATIONS.EQUALS).toBe('==');
      expect(OPERATOR_OPERATIONS.GREATER_THAN).toBe('>');
      expect(OPERATOR_OPERATIONS.LESS_THAN).toBe('<');
      expect(OPERATOR_OPERATIONS.GREATER_THAN_OR_EQUAL).toBe('>=');
      expect(OPERATOR_OPERATIONS.LESS_THAN_OR_EQUAL).toBe('<=');
      expect(OPERATOR_OPERATIONS.RANGE).toBe('range');
    });

    test('should have consistent NamedValue type', () => {
      const allValues = Object.values(NAMED_VALUES);
      allValues.forEach((value) => {
        expect(isValidTriggerKey(value)).toBe(true);
      });
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle empty strings in formatFieldName', () => {
      expect(formatFieldName('')).toBe('invoice.');
    });

    test('should handle empty strings in extractFieldName', () => {
      expect(extractFieldName('')).toBe('');
      expect(extractFieldName('invoice.')).toBe('');
    });

    test('should handle triggers with undefined operands', () => {
      const trigger = {
        operator: 'in',
        left_operand: undefined,
        right_operand: undefined,
      } as any;

      const result = getTriggerKeyAndValue(trigger);
      expect(result.key).toBe(null);
      expect(result.value).toBe(null);
    });

    test('should handle triggers with null operands', () => {
      const trigger = {
        operator: 'in',
        left_operand: null,
        right_operand: null,
      } as any;

      const result = getTriggerKeyAndValue(trigger);
      expect(result.key).toBe(null);
      expect(result.value).toBe(null);
    });
  });
});
