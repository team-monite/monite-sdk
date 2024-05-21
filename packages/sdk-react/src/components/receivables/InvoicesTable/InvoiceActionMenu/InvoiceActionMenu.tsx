import React, { forwardRef, memo } from 'react';

import { useMenuButton } from '@/core/hooks';
import { isActionAllowed, usePermissions } from '@/core/queries/usePermissions';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ActionEnum,
  InvoiceResponsePayload,
  ReceivableResponse,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  type IconButtonProps,
  Menu,
  MenuItem,
  MenuItemProps,
  type MenuProps,
} from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

/**
 * The event handler for a row action.
 * See `MoniteInvoiceActionMenu` documentation for more details.
 * @param id - The identifier of the clicked invoice row.
 * @param action - The action to perform.
 */
export type InvoiceActionHandler = (id: string, action?: InvoiceAction) => void;

export interface MoniteInvoiceActionMenuProps {
  actions?: Partial<InvoiceDefaultActions>;
  slotProps?: {
    root?: Partial<IconButtonProps>;
    menu?: Partial<MenuProps>;
  };
}

export type ActionMenuInvoice =
  | Pick<InvoiceResponsePayload, 'id' | 'status' | 'entity_user_id'>
  | Pick<ReceivableResponse, 'id' | 'status' | 'entity_user_id'>;

interface InvoiceActionMenuProps extends MoniteInvoiceActionMenuProps {
  invoice: ActionMenuInvoice;
  onClick?: InvoiceActionHandler;
}

/**
 * Displays a menu with actions available for a given Invoice.
 * Could be customized through MUI theming.
 *
 * @example MUI theming
 * // You can configure the component through MUI theming like this:
 * createTheme(myTheme, {
 *   components: {
 *     MoniteInvoiceActionMenu: {
 *       defaultProps: {
 *         // override default actions for each invoice status
 *         actions: {
 *           "draft": ['view', 'edit', 'issue', 'delete'], // Optional
 *           "issued": ['view', 'send', 'cancel', 'copyPaymentLink'], // Optional
 *           "canceled": ['view', 'send'], // Optional
 *           "partially_paid": ['view', 'send', 'copyPaymentLink', 'cancel'], // Optional
 *           "overdue": ['view', 'send', 'copyPaymentLink', 'cancel', 'markUncollectible'], // Optional
 *           "paid": ['view'], // Optional
 *           "uncollectible": ['view'], // Optional
 *           "expired": ['view'], // Optional
 *           "accepted": ['view'], // Optional
 *           "declined": ['view'], // Optional
 *           "recurring": ['view'], // Optional
 *           "deleted": [], // Optional
 *         },
 *         slotProps: {
 *           root: { size: 'large' },
 *           menu: {
 *             anchorOrigin: {
 *               vertical: 'center',
 *               horizontal: 'center',
 *             },
 *           },
 *         },
 *       },
 *       styleOverrides: {
 *         root: {
 *           outline: 'solid red 1px',
 *         },
 *       },
 *     },
 *   },
 * });
 */
export const InvoiceActionMenu = memo((inProps: InvoiceActionMenuProps) => {
  const { buttonProps, menuProps } = useMenuButton();

  const { invoice, actions, slotProps, onClick } = useThemeProps({
    props: inProps,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceActionMenu',
  });
  const { i18n } = useLingui();

  const actionList = useInvoiceActionList({ invoice, actions });

  if (actionList.length === 0) return null;

  return (
    <>
      <StyledIconButton
        {...slotProps?.root}
        {...buttonProps}
        aria-label={t(i18n)`Action menu`}
      >
        <MoreVertIcon />
      </StyledIconButton>

      <StyledMenu {...slotProps?.menu} {...menuProps}>
        {actionList.map((value) => (
          <ActionMenuItem
            key={value}
            invoiceAction={value}
            onClick={() => void onClick?.(invoice.id, value)}
          />
        ))}
      </StyledMenu>
    </>
  );
});

const StyledIconButton = styled(
  forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => (
    <IconButton ref={ref} {...props} />
  )),
  {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceActionMenu',
    slot: 'root',
    shouldForwardProp: () => true,
  }
)({});

const StyledMenu = styled(
  forwardRef<HTMLDivElement, MenuProps>((props, ref) => (
    <Menu ref={ref} {...props} />
  )),
  {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceActionMenu',
    slot: 'menu',
    shouldForwardProp: () => true,
  }
)({});

const ActionMenuItem = ({
  invoiceAction,
  ...restProps
}: { invoiceAction: InvoiceAction } & MenuItemProps) => {
  const { i18n } = useLingui();
  return (
    <MenuItem {...restProps}>
      {getInvoiceMenuItemLabel(i18n, invoiceAction)}
    </MenuItem>
  );
};

// todo::add tests ⬇︎
const useInvoiceActionList = ({
  invoice,
  actions,
}: Pick<InvoiceActionMenuProps, 'actions' | 'invoice'>): InvoiceAction[] => {
  const { data: allowedReceivableActions, userIdFromAuthToken } =
    usePermissions('receivable');

  const isAllowedInvoiceAction = (
    action: Parameters<typeof isActionAllowed>[0]['action']
  ) =>
    isActionAllowed({
      action,
      actions: allowedReceivableActions,
      entityUserId: invoice.entity_user_id,
      entityUserIdFromAuthToken: userIdFromAuthToken,
    });

  const actionList =
    actions?.[invoice.status] ?? invoiceDefaultActions[invoice.status];

  // @ts-expect-error - `filter` can't handle complex union types
  return actionList.filter((operation: InvoiceAction) => {
    if (operation === 'view') return isAllowedInvoiceAction(ActionEnum.READ);
    if (operation === 'edit') return isAllowedInvoiceAction(ActionEnum.UPDATE);
    if (operation === 'issue') return isAllowedInvoiceAction(ActionEnum.UPDATE);
    if (operation === 'delete')
      return isAllowedInvoiceAction(ActionEnum.DELETE);
    if (operation === 'copyPaymentLink')
      return isAllowedInvoiceAction(ActionEnum.READ);
    if (operation === 'cancel')
      return isAllowedInvoiceAction(ActionEnum.UPDATE);
    if (operation === 'markUncollectible')
      return isAllowedInvoiceAction(ActionEnum.UPDATE);
    if (operation === 'recurrent')
      return isAllowedInvoiceAction(ActionEnum.CREATE);
    if (operation === 'partiallyPay')
      return isAllowedInvoiceAction(ActionEnum.UPDATE);
    if (operation === 'pay') return isAllowedInvoiceAction(ActionEnum.UPDATE);
    if (operation === 'overduePayment')
      return isAllowedInvoiceAction(ActionEnum.UPDATE);

    throw new Error(`Unknown operation: ${operation}`);
  });
};

const invoiceDefaultActions: InvoiceDefaultActions = {
  [ReceivablesStatusEnum.DRAFT]: ['view', 'edit', 'issue', 'delete'],
  [ReceivablesStatusEnum.ISSUED]: ['view', 'send', 'cancel'], // 'copyPaymentLink', 'partiallyPay', 'overduePayment' are not default
  [ReceivablesStatusEnum.CANCELED]: ['view'],
  [ReceivablesStatusEnum.PARTIALLY_PAID]: [
    // 'copyPaymentLink', 'pay', 'overduePayment' are not default
    'view',
    'send',
    'cancel',
  ],
  [ReceivablesStatusEnum.OVERDUE]: ['view', 'send', 'cancel'], // 'copyPaymentLink', 'pay', 'markUncollectible' are not default
  [ReceivablesStatusEnum.PAID]: ['view'],
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: ['view'],
  [ReceivablesStatusEnum.EXPIRED]: ['view'],
  [ReceivablesStatusEnum.ACCEPTED]: ['view'],
  [ReceivablesStatusEnum.DECLINED]: ['view'],
  [ReceivablesStatusEnum.RECURRING]: ['view'],
  [ReceivablesStatusEnum.DELETED]: [],
};

function getInvoiceMenuItemLabel(i18n: I18n, action: InvoiceAction) {
  const labels: Record<InvoiceAction, string> = {
    view: t(i18n)({
      message: 'View',
      context: 'InvoiceActionMenu',
    }),
    send: t(i18n)({
      message: 'Send',
      context: 'InvoiceActionMenu',
    }),
    copyPaymentLink: t(i18n)({
      message: 'Copy payment link',
      context: 'InvoiceActionMenu',
    }),
    cancel: t(i18n)({
      message: 'Cancel with credit note',
      context: 'InvoiceActionMenu',
    }),
    edit: t(i18n)({
      message: 'Edit',
      context: 'InvoiceActionMenu',
    }),
    delete: t(i18n)({
      message: 'Delete',
      context: 'InvoiceActionMenu',
    }),
    markUncollectible: t(i18n)({
      message: 'Mark uncollectible',
      context: 'InvoiceActionMenu',
    }),
    issue: t(i18n)({
      message: 'Issue',
      context: 'InvoiceActionMenu',
    }),
    recurrent: t(i18n)({
      message: 'Recurring',
      context: 'InvoiceActionMenu',
    }),
    partiallyPay: t(i18n)({
      message: 'Partially pay',
      context: 'InvoiceActionMenu',
    }),
    pay: t(i18n)({
      message: 'Pay',
      context: 'InvoiceActionMenu',
    }),
    overduePayment: t(i18n)({
      message: 'Overdue payment',
      context: 'InvoiceActionMenu',
    }),
  };

  return labels[action];
}

type InvoiceCustomAction = 'view' | 'edit' | 'copyPaymentLink' | 'send';

export type InvoiceAction =
  | 'recurrent'
  | 'issue'
  | 'delete'
  | 'cancel'
  | 'partiallyPay'
  | 'pay'
  | 'overduePayment'
  | 'markUncollectible'
  | InvoiceCustomAction;

export interface InvoiceDefaultActions
  extends Record<ReceivablesStatusEnum, InvoiceAction[]> {
  [ReceivablesStatusEnum.DRAFT]: Array<
    'view' | 'edit' | 'issue' | 'recurrent' | 'delete'
  >;
  [ReceivablesStatusEnum.ISSUED]: Array<
    | 'view'
    | 'send'
    | 'copyPaymentLink'
    | 'pay'
    | 'partiallyPay'
    | 'overduePayment'
    | 'cancel'
  >;
  [ReceivablesStatusEnum.CANCELED]: Array<'view'>;
  [ReceivablesStatusEnum.PARTIALLY_PAID]: Array<
    'view' | 'send' | 'copyPaymentLink' | 'pay' | 'overduePayment' | 'cancel'
  >;
  [ReceivablesStatusEnum.OVERDUE]: Array<
    'view' | 'send' | 'copyPaymentLink' | 'pay' | 'cancel' | 'markUncollectible'
  >;
  [ReceivablesStatusEnum.PAID]: Array<'view'>;
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: Array<'view'>;
  [ReceivablesStatusEnum.EXPIRED]: Array<'view'>;
  [ReceivablesStatusEnum.ACCEPTED]: Array<'view'>;
  [ReceivablesStatusEnum.DECLINED]: Array<'view'>;
  [ReceivablesStatusEnum.RECURRING]: Array<'view'>;
  [ReceivablesStatusEnum.DELETED]: Array<never>;
}
