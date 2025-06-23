import { ReactNode, useState } from 'react';

import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip';
import { useCounterpartById } from '@/core/queries';
import { FullScreenModalHeader } from '@/ui/FullScreenModalHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button, ButtonProps } from '@mui/material';

import { isPayableInOCRProcessing } from '../../utils/isPayableInOcr';
import { PayableDetailsCancelModal } from '../PayableDetailsCancelModal';
import { PayableDetailsPermissions } from '../usePayableDetails';

export interface PayablesDetailsHeaderProps {
  payable?: components['schemas']['PayableResponseSchema'];
  permissions: PayableDetailsPermissions[];
  setEdit: (isEdit: boolean) => void;
  isEdit: boolean;
  submitInvoice: () => void;
  rejectInvoice: () => void;
  approveInvoice: () => void;
  cancelInvoice: () => void;
  reopenInvoice: () => void;
  deleteInvoice: () => void;
  payInvoice: () => void;
  /** The "id" of the form used to edit the Payable */
  payableDetailsFormId: string;
  onClose?: () => void;
  modalComponent: ReactNode;
  showPayButton: boolean;
}

export const PayableDetailsHeader = ({
  payable,
  permissions,
  setEdit,
  isEdit,
  submitInvoice,
  rejectInvoice,
  approveInvoice,
  cancelInvoice,
  reopenInvoice,
  deleteInvoice,
  payInvoice,
  payableDetailsFormId,
  onClose,
  modalComponent,
  showPayButton,
}: PayablesDetailsHeaderProps) => {
  const { i18n } = useLingui();
  const { data: counterpart } = useCounterpartById(payable?.counterpart_id);
  const [showCancelationModal, setShowCancelationModal] = useState(false);

  const counterpartName = getCounterpartName(counterpart);

  const buttonsByPermissions: Record<PayableDetailsPermissions, ButtonProps> = {
    edit: {
      variant: 'outlined',
      onClick: () => setEdit(true),
      children: t(i18n)`Edit`,
    },
    save: {
      variant: 'contained',
      form: payableDetailsFormId,
      type: 'submit',
      children: t(i18n)`Save`,
    },
    cancelEdit: {
      variant: 'outlined',
      onClick: () => {
        setEdit(false);
        !payable && onClose && onClose();
      },
      children: t(i18n)`Cancel`,
    },
    submit: {
      variant: 'contained',
      onClick: submitInvoice,
      children: t(i18n)`Submit`,
    },
    reject: {
      variant: 'text',
      color: 'error',
      onClick: rejectInvoice,
      children: t(i18n)`Reject`,
    },
    reopen: {
      variant: 'text',
      color: 'error',
      onClick: reopenInvoice,
      children: t(i18n)`Reopen`,
    },
    approve: {
      variant: 'contained',
      onClick: approveInvoice,
      children: t(i18n)`Approve`,
    },
    cancel: {
      variant: 'text',
      color: 'error',
      onClick: () => setShowCancelationModal(true),
      children: t(i18n)`Cancel bill`,
    },
    delete: {
      variant: 'text',
      color: 'error',
      onClick: () => {
        deleteInvoice();
        onClose?.();
      },
      children: t(i18n)`Delete bill`,
    },
    pay: {
      variant: 'contained',
      onClick: payInvoice,
      disabled: !showPayButton,
      children: t(i18n)`Pay`,
    },
  };

  const className = 'Monite-PayableDetails-Header';
  const canCancel = permissions.includes('cancel');

  const title = payable?.document_id
    ? counterpartName
      ? `${t(i18n)`Bill`} #${payable.document_id} ${t(
          i18n
        )`from`} ${counterpartName}`
      : isEdit
      ? `${t(i18n)`Edit bill`} #${payable.document_id}`
      : `${t(i18n)`Bill`} #${payable.document_id}`
    : t(i18n)`New incoming invoice`;

  const actions =
    (!payable || !isPayableInOCRProcessing(payable)) &&
    permissions.map((permission) => {
      const { children, ...restProps } = buttonsByPermissions[permission];
      return (
        <Button key={permission} {...restProps}>
          {children}
        </Button>
      );
    });

  return (
    <>
      <FullScreenModalHeader
        className={className}
        title={title}
        statusElement={
          <PayableStatusChip status={payable?.status ?? 'draft'} />
        }
        actions={actions}
        closeButtonTooltip={t(i18n)`Close payable details`}
      />
      {modalComponent}
      {canCancel && (
        <PayableDetailsCancelModal
          isOpen={showCancelationModal}
          handleCloseModal={() => setShowCancelationModal(false)}
          handleConfirmation={cancelInvoice}
        />
      )}
    </>
  );
};
