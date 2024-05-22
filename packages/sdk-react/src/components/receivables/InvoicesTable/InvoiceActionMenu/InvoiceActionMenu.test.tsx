import React from 'react';

import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
import {
  checkPermissionQueriesLoaded,
  renderWithClient,
  testQueryClient,
} from '@/utils/test-utils';
import {
  ActionEnum,
  PermissionEnum,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import {
  InvoiceActionMenu,
  InvoiceActionMenuItemValue,
  filterInvoiceActionMenuAllowedItems,
} from './InvoiceActionMenu';

describe('InvoiceActionMenu', () => {
  test('opens action menu if button clicked', async () => {
    const onClick = jest.fn();

    renderWithClient(
      <InvoiceActionMenu
        invoice={{
          id: '1',
          status: ReceivablesStatusEnum.DRAFT,
        }}
        onClick={onClick}
      />
    );

    fireEvent.click(await screen.findByLabelText('Action menu'));

    fireEvent.click(await screen.findByRole('menuitem', { name: 'View' }));
    expect(onClick.mock.calls).toEqual([['1', 'view']]);
  });

  test('renders the button if action object is empty', async () => {
    const onClick = jest.fn();

    renderWithClient(
      <InvoiceActionMenu
        actions={{}}
        invoice={{
          id: '1',
          status: ReceivablesStatusEnum.DRAFT,
        }}
        onClick={onClick}
      />
    );

    expect(await screen.findByLabelText('Action menu')).toBeInTheDocument();
  });

  test('not renders the button if action array is empty', async () => {
    const onClick = jest.fn();

    renderWithClient(
      <InvoiceActionMenu
        actions={{
          [ReceivablesStatusEnum.DRAFT]: [],
        }}
        invoice={{
          id: '1',
          status: ReceivablesStatusEnum.DRAFT,
        }}
        onClick={onClick}
      />
    );

    await waitFor(() => checkPermissionQueriesLoaded(testQueryClient));
    // todo::how to handle the case when the button is not rendered⬇︎ but don't want to use ➡︎ checkPermissionQueriesLoaded(...)
    expect(screen.queryByLabelText('Action menu')).not.toBeInTheDocument();
  });

  test('renders specific action list if property specified', async () => {
    const onClick = jest.fn();

    renderWithClient(
      <InvoiceActionMenu
        actions={{
          [ReceivablesStatusEnum.DRAFT]: ['edit'],
        }}
        invoice={{
          id: '1',
          status: ReceivablesStatusEnum.DRAFT,
        }}
        onClick={onClick}
      />
    );

    fireEvent.click(await screen.findByLabelText('Action menu'));

    expect(
      await screen.findByRole('menuitem', { name: 'Edit' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('menuitem', { name: 'View' })
    ).not.toBeInTheDocument();
  });

  test('renders specific action list is theme defaultProps specified', async () => {
    const onClick = jest.fn();

    renderWithClient(
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteInvoiceActionMenu: {
              defaultProps: {
                actions: {
                  [ReceivablesStatusEnum.DRAFT]: ['edit'],
                },
              },
            },
          },
        }}
      >
        <InvoiceActionMenu
          invoice={{
            id: '1',
            status: ReceivablesStatusEnum.DRAFT,
          }}
          onClick={onClick}
        />
      </ExtendThemeProvider>
    );

    fireEvent.click(await screen.findByLabelText('Action menu'));

    expect(
      await screen.findByRole('menuitem', { name: 'Edit' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('menuitem', { name: 'View' })
    ).not.toBeInTheDocument();
  });

  test('supports slotProps if defaultProps specified', async () => {
    const onClick = jest.fn();

    renderWithClient(
      <ExtendThemeProvider
        theme={{
          components: {
            MoniteInvoiceActionMenu: {
              defaultProps: {
                slotProps: {
                  root: { size: 'large' },
                  menu: { classes: { list: 'invoice-action-menu-test-class' } },
                },
              },
            },
          },
        }}
      >
        <InvoiceActionMenu
          invoice={{
            id: '1',
            status: ReceivablesStatusEnum.DRAFT,
          }}
          onClick={onClick}
        />
      </ExtendThemeProvider>
    );

    const menuButton = await screen.findByLabelText('Action menu');
    expect(menuButton).toHaveClass('MuiIconButton-sizeLarge');
    fireEvent.click(menuButton);

    expect(await screen.findByRole('menu')).toHaveClass(
      'invoice-action-menu-test-class'
    );
  });

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
      [key in InvoiceActionMenuItemValue]: true;
    }) as InvoiceActionMenuItemValue[];

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
            id: '1',
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
            id: '1',
            status: ReceivablesStatusEnum.DRAFT,
            entity_user_id: 'user_id_1',
          },
          'user_id_1'
        )
      ).toEqual(menuItems);
    });
  });
});
