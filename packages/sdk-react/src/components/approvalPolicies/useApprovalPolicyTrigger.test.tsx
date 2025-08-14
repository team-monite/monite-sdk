import { components } from '@/api';
import { approvalPoliciesListFixture } from '@/mocks/approvalPolicies/approvalPoliciesFixture';
import {
  individualId,
  organizationId,
} from '@/mocks/counterparts/counterpart.mocks.types';
import {
  entityUserByIdFixture,
  entityUser2,
} from '@/mocks/entityUsers/entityUserByIdFixture';
import { tagListFixture } from '@/mocks/tags';
import { renderHook } from '@testing-library/react';

import { OPERATOR_OPERATIONS } from './triggerUtils';
import {
  useApprovalPolicyTrigger,
  AmountTuple,
} from './useApprovalPolicyTrigger';

describe('useApprovalPolicyTrigger', () => {
  describe('trigger parsing based on format', () => {
    test('should parse triggers with named values that are lists', () => {
      const approvalPolicy = approvalPoliciesListFixture.data[2]; // "Has tags and approved by users from the list"

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers.tags).toEqual([
        tagListFixture[0].id,
        tagListFixture[2].id,
        tagListFixture[3].id,
      ]);
    });

    test('should parse triggers with named values that are strings or numbers', () => {
      const approvalPolicy: components['schemas']['ApprovalPolicyResource'] = {
        id: 'test-id',
        name: 'Test Policy',
        description: 'Test Description',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: 'user-1',
        updated_by: 'user-1',
        script: [],
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.tags.id',
              },
              right_operand: [tagListFixture[0].id, tagListFixture[1].id],
            },
          ],
        },
      };

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers.tags).toEqual([
        tagListFixture[0].id,
        tagListFixture[1].id,
      ]);
    });

    test('should handle mixed formats correctly', () => {
      const approvalPolicy: components['schemas']['ApprovalPolicyResource'] = {
        id: 'test-id',
        name: 'Test Policy',
        description: 'Test Description',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: 'user-1',
        updated_by: 'user-1',
        script: [],
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            {
              operator: 'in',
              left_operand: tagListFixture[0].id,
              right_operand: {
                name: 'invoice.tags.id',
              },
            },
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.tags.id',
              },
              right_operand: [tagListFixture[1].id, tagListFixture[2].id],
            },
          ],
        },
      };

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers.tags).toEqual([
        tagListFixture[0].id,
        tagListFixture[1].id,
        tagListFixture[2].id,
      ]);
    });

    test('should parse amount triggers correctly', () => {
      const approvalPolicy = approvalPoliciesListFixture.data[4]; // "For amount and approved by roles"

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers.amount).toEqual({
        currency: 'EUR',
        value: [
          ['>=', 30000],
          ['<=', '50000'],
        ],
      });
    });

    test('should parse counterpart_id triggers correctly', () => {
      const approvalPolicy = approvalPoliciesListFixture.data[3]; // "By counterparts and approved by users chain"

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers.counterpart_id).toEqual([
        organizationId,
        individualId,
      ]);
    });

    test('should parse was_created_by_user_id triggers correctly', () => {
      const approvalPolicy = approvalPoliciesListFixture.data[1]; // "Created by user and single user"

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers.was_created_by_user_id).toEqual([
        entityUserByIdFixture.id,
        entityUser2.id,
      ]);
    });

    test('should parse complex policy with all trigger types', () => {
      const approvalPolicy = approvalPoliciesListFixture.data[0]; // "Approval policy with all conditions and flows"

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers).toEqual({
        was_created_by_user_id: [entityUserByIdFixture.id, entityUser2.id],
        tags: [
          tagListFixture[0].id,
          tagListFixture[2].id,
          tagListFixture[3].id,
        ],
        counterpart_id: [organizationId, individualId],
        amount: {
          currency: 'EUR',
          value: [
            ['>=', 30000],
            ['<=', '50000'],
          ],
        },
      });
    });

    test('should handle invalid triggers gracefully', () => {
      const approvalPolicy: components['schemas']['ApprovalPolicyResource'] = {
        id: 'test-id',
        name: 'Test Policy',
        description: 'Test Description',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: 'user-1',
        updated_by: 'user-1',
        script: [],
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            {
              operator: 'in',
              left_operand: tagListFixture[0].id,
              right_operand: {
                name: 'invoice.tags.id',
              },
            },
            // Invalid trigger - missing required properties
            {
              operator: 'invalid',
              left_operand: 'invalid',
              right_operand: 'invalid',
            },
            // String trigger (should be skipped)
            'string-trigger',
          ],
        },
      };

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      // Should only parse the valid tag trigger
      expect(result.current.triggers.tags).toEqual([tagListFixture[0].id]);
    });

    test('should handle approval policy without trigger', () => {
      const approvalPolicy: components['schemas']['ApprovalPolicyResource'] = {
        id: 'test-id',
        name: 'Test Policy',
        description: 'Test Description',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: 'user-1',
        updated_by: 'user-1',
        script: [],
        priority: 1,
      };

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers).toEqual({});
    });

    test('should handle null approval policy', () => {
      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy: undefined })
      );

      expect(result.current.triggers).toEqual({});
    });

    test('should parse amount triggers with different operators correctly', () => {
      const approvalPolicy: components['schemas']['ApprovalPolicyResource'] = {
        id: 'test-id',
        name: 'Test Policy',
        description: 'Test Description',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: 'user-1',
        updated_by: 'user-1',
        script: [],
        // @ts-expect-error - `trigger` is not covered by the schema
        trigger: {
          all: [
            {
              operator: '>',
              left_operand: {
                name: 'invoice.amount',
              },
              right_operand: 1000,
            },
            {
              operator: '<=',
              left_operand: {
                name: 'invoice.amount',
              },
              right_operand: 5000,
            },
            {
              operator: 'in',
              left_operand: {
                name: 'invoice.currency',
              },
              right_operand: 'USD',
            },
          ],
        },
      };

      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy })
      );

      expect(result.current.triggers.amount).toEqual({
        currency: 'USD',
        value: [
          ['>', 1000],
          ['<=', 5000],
        ],
      });
    });
  });

  describe('trigger name and label functions', () => {
    test('should return correct trigger names', () => {
      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy: undefined })
      );

      expect(result.current.getTriggerName('amount')).toBe('Amount');
      expect(result.current.getTriggerName('counterpart_id')).toBe(
        'Counterparts'
      );
      expect(result.current.getTriggerName('was_created_by_user_id')).toBe(
        'Created by user'
      );
      expect(result.current.getTriggerName('tags')).toBe('Tags');
    });

    test('should return correct trigger labels', () => {
      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy: undefined })
      );

      expect(result.current.getTriggerLabel('amount')).toBe('Amount');
      expect(result.current.getTriggerLabel('counterpart_id')).toBe(
        'Counterparts'
      );
      expect(result.current.getTriggerLabel('was_created_by_user_id')).toBe(
        'Created by'
      );
      expect(result.current.getTriggerLabel('tags')).toBe('Has tags');
    });
  });

  describe('amount label formatting', () => {
    test('should format single amount condition correctly', () => {
      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy: undefined })
      );

      const amountValue: AmountTuple[] = [
        [OPERATOR_OPERATIONS.GREATER_THAN, 1000],
      ];
      const label = result.current.getAmountLabel(amountValue, 'USD');

      expect(label).toContain('Greater than');
      expect(label).toContain('1000');
    });

    test('should format range amount condition correctly', () => {
      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy: undefined })
      );

      const amountValue: AmountTuple[] = [
        [OPERATOR_OPERATIONS.GREATER_THAN_OR_EQUAL, 1000],
        [OPERATOR_OPERATIONS.LESS_THAN_OR_EQUAL, 5000],
      ];
      const label = result.current.getAmountLabel(amountValue, 'USD');

      expect(label).toContain('1000');
      expect(label).toContain('5000');
      expect(label).toContain('-');
    });

    test('should handle different operators correctly', () => {
      const { result } = renderHook(() =>
        useApprovalPolicyTrigger({ approvalPolicy: undefined })
      );

      const operators: Array<[string, string]> = [
        [OPERATOR_OPERATIONS.GREATER_THAN, 'Greater than'],
        [OPERATOR_OPERATIONS.GREATER_THAN_OR_EQUAL, 'Greater than or equal to'],
        [OPERATOR_OPERATIONS.LESS_THAN, 'Less than'],
        [OPERATOR_OPERATIONS.LESS_THAN_OR_EQUAL, 'Less than or equal to'],
        [OPERATOR_OPERATIONS.EQUALS, 'Equal to'],
      ];

      operators.forEach(([operator, expectedText]) => {
        const amountValue: AmountTuple[] = [[operator as any, 1000]];
        const label = result.current.getAmountLabel(amountValue, 'USD');
        expect(label).toContain(expectedText);
      });
    });
  });
});
