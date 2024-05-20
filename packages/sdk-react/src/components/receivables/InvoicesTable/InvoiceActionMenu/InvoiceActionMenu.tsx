import { forwardRef } from 'react';

import { useMenuButton } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload, ReceivablesStatusEnum } from '@monite/sdk-api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  type IconButtonProps,
  Menu,
  MenuItem,
  type MenuProps,
} from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';

export type InvoiceActionHandler = (id: string, action?: InvoiceAction) => void;

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

const useInvoiceMenuOptions = (
  status: ReceivablesStatusEnum,
  actions: Partial<InvoiceDefaultActions>
): {
  label: string;
  value: InvoiceAction;
}[] => {
  const { i18n } = useLingui();

  const operations = actions[status] ?? invoiceDefaultActions[status];

  const labels: Record<InvoiceAction, string> = {
    view: t(i18n)`View`,
    downloadPDF: t(i18n)`Download PDF`,
    send: t(i18n)`Send`,
    copyPaymentLink: t(i18n)`Copy payment link`,
    cancel: t(i18n)`Cancel with credit note`,
    edit: t(i18n)`Edit`,
    delete: t(i18n)`Delete`,
    markUncollectible: t(i18n)`Mark uncollectible`,
    recordPayment: t(i18n)`Record payment`,
    duplicate: t(i18n)`Duplicate`,
    issue: t(i18n)`Issue`,
  };

  return operations.map((operation) => ({
    label: labels[operation],
    value: operation,
  }));
};

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

export const InvoiceActionMenu = (inProps: InvoiceActionMenuProps) => {
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

  const options = useInvoiceMenuOptions(invoice.status, actions);

  if (options.length === 0) return null;

  return (
    <>
      <StyledIconButton {...slotProps?.root} {...buttonProps}>
        <MoreVertIcon />
      </StyledIconButton>

      <StyledMenu {...slotProps?.menu} {...menuProps}>
        {options.map(({ label, value }) => (
          <MenuItem
            key={value}
            onClick={() => void onClick?.(invoice.id, value)}
          >
            {label}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

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
