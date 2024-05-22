import { receivableListFixture } from '@/mocks/receivables';
import {
  ActionEnum,
  PermissionEnum,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';

import {
  filterInvoiceActionMenuAllowedItems,
  InvoicesTableRowAction,
} from './useInvoiceRowActionMenuCell';

describe('isInvoiceMenuActionAllowed', () => {
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

  const permissions = [
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
        permissions,
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

  test('filters out unsupported menu items', () => {
    expect(
      filterInvoiceActionMenuAllowedItems(
        permissions,
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
