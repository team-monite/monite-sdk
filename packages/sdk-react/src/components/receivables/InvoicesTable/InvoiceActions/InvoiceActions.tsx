import { useMenuButton } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload, ReceivablesStatusEnum } from '@monite/sdk-api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

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

interface InvoiceActionMap
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

const invoiceActionMap: InvoiceActionMap = {
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

const useInvoiceOptionsByStatus = ({
  status,
}: {
  status: ReceivablesStatusEnum;
}): {
  label: string;
  value: InvoiceAction;
}[] => {
  const { i18n } = useLingui();

  const operations = invoiceActionMap[status];

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

export interface MoniteInvoiceActionsProps {}

interface InvoiceMenuCellProps extends MoniteInvoiceActionsProps {
  invoice: Pick<InvoiceResponsePayload, 'id' | 'status'>;
  onClick?: InvoiceActionHandler;
}

export const InvoiceActions = ({ invoice, onClick }: InvoiceMenuCellProps) => {
  const { buttonProps, menuProps } = useMenuButton();

  const options = useInvoiceOptionsByStatus({ status: invoice.status });

  if (options.length === 0) return null;

  return (
    <>
      <IconButton {...buttonProps}>
        <MoreVertIcon />
      </IconButton>

      <Menu {...menuProps}>
        {options.map(({ label, value }) => (
          <MenuItem
            key={value}
            onClick={() => {
              onClick?.(invoice.id, value);
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
