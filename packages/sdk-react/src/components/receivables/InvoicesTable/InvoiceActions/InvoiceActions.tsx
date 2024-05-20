import { useMenuButton } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload, ReceivablesStatusEnum } from '@monite/sdk-api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

export type InvoiceAction = (id: string, action?: Operations) => void;

type Operations =
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

export interface InvoiceActionsRootProps
  extends Record<ReceivablesStatusEnum, Operations[]> {
  draft: Array<
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

type Labels = Record<Operations, string>;

type Option = {
  label: string;
  action: () => InvoiceAction | void;
};

type InvoiceMenuCellProps = {
  invoice: InvoiceResponsePayload;
  onClick?: InvoiceAction;
};

const useInvoiceOptionsByStatus = ({
  invoice: { id, status },
  onClick,
}: InvoiceMenuCellProps): Option[] => {
  const { i18n } = useLingui();

  const labels: Labels = {
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

  const getOptionByOperation = (operation: Operations): Option => ({
    label: labels[operation],
    action: () => onClick?.(id, operation),
  });

  // TODO add implementation
  return [];
};

export const InvoiceActions = (props: InvoiceMenuCellProps) => {
  const { buttonProps, menuProps } = useMenuButton();

  const options = useInvoiceOptionsByStatus(props);

  if (options.length === 0) return null;

  return (
    <>
      <IconButton {...buttonProps}>
        <MoreVertIcon />
      </IconButton>

      <Menu {...menuProps}>
        {options.map(({ label, action }) => (
          <MenuItem key={label} onClick={action}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
