import { forwardRef, memo } from 'react';

import { useMenuButton } from '@/core/hooks';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload, ReceivablesStatusEnum } from '@monite/sdk-api';
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

interface InvoiceActionMenuProps extends MoniteInvoiceActionMenuProps {
  invoice: Pick<InvoiceResponsePayload, 'id' | 'status'>;
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
 *           "draft": ['view', 'edit', 'issue', 'downloadPDF', 'duplicate', 'delete'], // Optional
 *           "issued": ['view', 'duplicate', 'downloadPDF', 'send', 'recordPayment', 'cancel', 'copyPaymentLink'], // Optional
 *           "canceled": ['view', 'downloadPDF', 'send'], // Optional
 *           "partially_paid": ['view', 'duplicate', 'downloadPDF', 'send', 'recordPayment', 'copyPaymentLink', 'cancel'], // Optional
 *           "overdue": ['view', 'duplicate', 'downloadPDF', 'send', 'recordPayment', 'copyPaymentLink', 'cancel', 'markUncollectible'], // Optional
 *           "paid": ['view', 'duplicate', 'downloadPDF'], // Optional
 *           "uncollectible": ['view', 'duplicate', 'downloadPDF'], // Optional
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

  const {
    invoice,
    actions = invoiceDefaultActions,
    slotProps,
    onClick,
  } = useThemeProps({
    props: inProps,
    // eslint-disable-next-line lingui/no-unlocalized-strings
    name: 'MoniteInvoiceActionMenu',
  });
  const { i18n } = useLingui();

  const operations =
    actions[invoice.status] ?? invoiceDefaultActions[invoice.status];

  if (operations.length === 0) return null;

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
        {operations.map((value) => (
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

const ActionMenuItem = memo(
  ({
    invoiceAction,
    ...restProps
  }: { invoiceAction: InvoiceAction } & MenuItemProps) => {
    const { i18n } = useLingui();
    return (
      <MenuItem {...restProps}>
        {getInvoiceMenuItemLabel(i18n, invoiceAction)}
      </MenuItem>
    );
  }
);

const invoiceDefaultActions: InvoiceDefaultActions = {
  [ReceivablesStatusEnum.DRAFT]: [
    'view',
    'edit',
    'issue',
    'downloadPDF',
    'duplicate',
    'delete',
  ],
  [ReceivablesStatusEnum.ISSUED]: [
    'view',
    'duplicate',
    'downloadPDF',
    'send',
    'recordPayment',
    'cancel',
    'copyPaymentLink',
  ],
  [ReceivablesStatusEnum.CANCELED]: ['view', 'downloadPDF', 'send'],
  [ReceivablesStatusEnum.PARTIALLY_PAID]: [
    'view',
    'duplicate',
    'downloadPDF',
    'send',
    'recordPayment',
    'copyPaymentLink',
    'cancel',
  ],
  [ReceivablesStatusEnum.OVERDUE]: [
    'view',
    'duplicate',
    'downloadPDF',
    'send',
    'recordPayment',
    'copyPaymentLink',
    'cancel',
    'markUncollectible',
  ],
  [ReceivablesStatusEnum.PAID]: ['view', 'duplicate', 'downloadPDF'],
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: ['view', 'duplicate', 'downloadPDF'],
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
    downloadPDF: t(i18n)({
      message: 'Download PDF',
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
    recordPayment: t(i18n)({
      message: 'Record payment',
      context: 'InvoiceActionMenu',
    }),
    duplicate: t(i18n)({
      message: 'Duplicate',
      context: 'InvoiceActionMenu',
    }),
    issue: t(i18n)({
      message: 'Issue',
      context: 'InvoiceActionMenu',
    }),
  };

  return labels[action];
}

type InvoiceAction =
  | 'view'
  | 'edit'
  | 'issue'
  | 'duplicate'
  | 'delete'
  | 'downloadPDF'
  | 'copyPaymentLink'
  | 'send'
  | 'recordPayment'
  | 'cancel'
  | 'markUncollectible';

interface InvoiceDefaultActions
  extends Record<ReceivablesStatusEnum, InvoiceAction[]> {
  [ReceivablesStatusEnum.DRAFT]: Array<
    'view' | 'edit' | 'issue' | 'downloadPDF' | 'duplicate' | 'delete'
  >;
  [ReceivablesStatusEnum.ISSUED]: Array<
    | 'view'
    | 'duplicate'
    | 'downloadPDF'
    | 'send'
    | 'recordPayment'
    | 'cancel'
    | 'copyPaymentLink'
  >;
  [ReceivablesStatusEnum.CANCELED]: Array<'view' | 'downloadPDF' | 'send'>;
  [ReceivablesStatusEnum.PARTIALLY_PAID]: Array<
    | 'view'
    | 'duplicate'
    | 'downloadPDF'
    | 'send'
    | 'recordPayment'
    | 'copyPaymentLink'
    | 'cancel'
  >;
  [ReceivablesStatusEnum.OVERDUE]: Array<
    | 'view'
    | 'duplicate'
    | 'downloadPDF'
    | 'send'
    | 'recordPayment'
    | 'copyPaymentLink'
    | 'cancel'
    | 'markUncollectible'
  >;
  [ReceivablesStatusEnum.PAID]: Array<'view' | 'duplicate' | 'downloadPDF'>;
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: Array<
    'view' | 'duplicate' | 'downloadPDF'
  >;
  [ReceivablesStatusEnum.EXPIRED]: Array<'view'>;
  [ReceivablesStatusEnum.ACCEPTED]: Array<'view'>;
  [ReceivablesStatusEnum.DECLINED]: Array<'view'>;
  [ReceivablesStatusEnum.RECURRING]: Array<'view'>;
  [ReceivablesStatusEnum.DELETED]: Array<never>;
}
