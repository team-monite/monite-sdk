import { receivableListFixture } from '@/mocks/receivables';
import { createRenderWithClient } from '@/utils/test-utils';
import {
  ActionEnum,
  PermissionEnum,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';
import { renderHook, waitFor } from '@testing-library/react';

import {
  filterInvoiceActionMenuAllowedItems,
  InvoicesTableRowAction,
  useInvoiceRowActionMenuCell,
} from './useInvoiceRowActionMenuCell';

describe('useInvoiceRowActionMenuCell', () => {
  test('returns default action menu items', async () => {
    const { result } = renderHook(
      () =>
        useInvoiceRowActionMenuCell({
          onRowActionClick: jest.fn(),
        }),
      {
        wrapper: createRenderWithClient(),
      }
    );

    const menuActionList = await waitFor(() => {
      if (result.current?.type !== 'actions')
        throw new Error('Invalid cell type');

      const actionList = result.current?.getActions({
        row: receivableListFixture.invoice[0],
        id: '1',
        columns: [result.current],
      });

      expect(actionList).not.toHaveLength(0);

      return actionList;
    });

    expect(
      menuActionList?.find((column) => column.props.label === 'View')
    ).toBeDefined();
    expect(
      menuActionList?.find((column) => column.props.label === 'Edit')
    ).toBeDefined();
  });

  test('returns custom action menu items', async () => {
    const { result } = renderHook(
      () =>
        useInvoiceRowActionMenuCell({
          rowActions: {
            [ReceivablesStatusEnum.DRAFT]: ['view'],
          },
          onRowActionClick: jest.fn(),
        }),
      {
        wrapper: createRenderWithClient(),
      }
    );

    const menuActionList = await waitFor(() => {
      if (result.current?.type !== 'actions')
        throw new Error('Invalid cell type');

      const actionList = result.current?.getActions({
        row: receivableListFixture.invoice[0],
        id: '1',
        columns: [result.current],
      });
      expect(actionList).not.toHaveLength(0);
      return actionList;
    });

    expect(
      menuActionList.find((column) => column.props.label === 'View')
    ).toBeDefined();
    expect(
      menuActionList.find((column) => column.props.label === 'Edit')
    ).not.toBeDefined();
  });

  describe('isInvoiceMenuActionAllowed(...)', () => {
    const menuItems = Object.keys({
      view: true,
      edit: true,
      issue: true,
      delete: true,
      cancel: true,
      send: true,
      pay: true,
      copyPaymentLink: true,
      markUncollectible: true,
      overduePayment: true,
      partiallyPay: true,
      recurrent: true,
    } satisfies {
      [key in InvoicesTableRowAction]: true;
    }) as InvoicesTableRowAction[];

    const fullPermissions = [
      {
        action_name: ActionEnum.CREATE,
        permission: PermissionEnum.ALLOWED,
      },
      {
        action_name: ActionEnum.READ,
        permission: PermissionEnum.ALLOWED,
      },
      {
        action_name: ActionEnum.UPDATE,
        permission: PermissionEnum.ALLOWED,
      },
      {
        action_name: ActionEnum.DELETE,
        permission: PermissionEnum.ALLOWED,
      },
    ];

    test('allows each menu item if has permissions', () => {
      expect(
        filterInvoiceActionMenuAllowedItems(
          fullPermissions,
          menuItems,
          {
            ...receivableListFixture.invoice[0],
            status: ReceivablesStatusEnum.DRAFT,
            entity_user_id: 'user_id_1',
          },
          'user_id_1'
        )
      ).toEqual(menuItems);
    });

    test('disallows each menu item if has permissions', () => {
      expect(
        filterInvoiceActionMenuAllowedItems(
          [
            {
              action_name: ActionEnum.CREATE,
              permission: PermissionEnum.NOT_ALLOWED,
            },
            {
              action_name: ActionEnum.READ,
              permission: PermissionEnum.NOT_ALLOWED,
            },
            {
              action_name: ActionEnum.UPDATE,
              permission: PermissionEnum.NOT_ALLOWED,
            },
            {
              action_name: ActionEnum.DELETE,
              permission: PermissionEnum.NOT_ALLOWED,
            },
          ],
          menuItems,
          {
            ...receivableListFixture.invoice[0],
            status: ReceivablesStatusEnum.DRAFT,
            entity_user_id: 'user_id_1',
          },
          'user_id_1'
        )
      ).toEqual([]);
    });

    test('allows each menu item if invoice belongs to a entity user', () => {
      expect(
        filterInvoiceActionMenuAllowedItems(
          [
            {
              action_name: ActionEnum.CREATE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.READ,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.UPDATE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.DELETE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
          ],
          menuItems,
          {
            ...receivableListFixture.invoice[0],
            status: ReceivablesStatusEnum.DRAFT,
            entity_user_id: 'user_id_1',
          },
          'user_id_1'
        )
      ).toEqual(menuItems);
    });

    test('disallows each menu item if invoice not belongs to a entity user', () => {
      expect(
        filterInvoiceActionMenuAllowedItems(
          [
            {
              action_name: ActionEnum.CREATE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.READ,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.UPDATE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
            {
              action_name: ActionEnum.DELETE,
              permission: PermissionEnum.ALLOWED_FOR_OWN,
            },
          ],
          menuItems,
          {
            ...receivableListFixture.invoice[0],
            status: ReceivablesStatusEnum.DRAFT,
            entity_user_id: 'user_id_1',
          },
          'user_id_2'
        )
      ).toEqual([]);
    });

    test('filters out unsupported menu items', () => {
      expect(
        filterInvoiceActionMenuAllowedItems(
          fullPermissions,
          // @ts-expect-error - testing invalid value
          [...menuItems, 'customAction'],
          {
            ...receivableListFixture.invoice[0],
            status: ReceivablesStatusEnum.DRAFT,
            entity_user_id: 'user_id_1',
          },
          'user_id_1'
        )
      ).toEqual(menuItems);
    });
  });
});
