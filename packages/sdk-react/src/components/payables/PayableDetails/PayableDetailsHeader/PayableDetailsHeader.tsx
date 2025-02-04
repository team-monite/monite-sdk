import { ReactNode, useState } from 'react';

import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useDialog } from '@/components/Dialog';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip';
import { PayableDataTestId } from '@/components/payables/types';
import { useCounterpartById } from '@/core/queries';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  ButtonProps,
  DialogTitle,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

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
  payInvoice: () => void;
  /** The "id" of the form used to edit the Payable */
  payableDetailsFormId: string;
  onClose?: () => void;
  isPaymentLinkAvailable: boolean;
  isProcessingPayment: boolean;
  modalComponent: ReactNode;
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
  payInvoice,
  payableDetailsFormId,
  isPaymentLinkAvailable,
  isProcessingPayment,
  onClose,
  modalComponent,
}: PayablesDetailsHeaderProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
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
    pay: {
      variant: 'contained',
      onClick: payInvoice,
      disabled: !isPaymentLinkAvailable || isProcessingPayment,
      children: t(i18n)`Pay`,
    },
  };

  const className = 'Monite-PayableDetails-Header';
  const canCancel = permissions.includes('cancel');

  return (
    <DialogTitle sx={{ position: 'relative' }} className={className}>
      <Toolbar>
        {dialogContext?.isDialogContent && (
          <IconWrapper
            edge="start"
            color="inherit"
            onClick={onClose}
            ariaLabelOverride={t(i18n)`Close payable details`}
            tooltip={t(i18n)`Close payable details`}
          >
            <CloseIcon />
          </IconWrapper>
        )}

        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Typography variant="h3" sx={{ ml: 3, flex: 1 }} component="div">
            {payable?.document_id
              ? counterpartName
                ? `${t(i18n)`Bill`} #${payable.document_id} ${t(
                    i18n
                  )`from`} ${counterpartName}`
                : isEdit
                ? `${t(i18n)`Edit bill`} #${payable.document_id}`
                : `${t(i18n)`Bill`} #${payable.document_id}`
              : t(i18n)`New incoming invoice`}
          </Typography>
          <PayableStatusChip status={payable?.status ?? 'draft'} />
        </Box>

        {(!payable || !isPayableInOCRProcessing(payable)) && (
          <Stack
            spacing={2}
            direction="row"
            sx={{ marginLeft: 'auto' }}
            data-testid={PayableDataTestId.PayableDetailsActions}
          >
            {permissions.map((permission) => {
              const { children, ...restProps } =
                buttonsByPermissions[permission];

              return (
                <Button key={permission} {...restProps}>
                  {children}
                </Button>
              );
            })}
          </Stack>
        )}
      </Toolbar>
      {modalComponent}
      {canCancel && (
        <PayableDetailsCancelModal
          isOpen={showCancelationModal}
          handleCloseModal={() => setShowCancelationModal(false)}
          handleConfirmation={cancelInvoice}
        />
      )}
    </DialogTitle>
  );
};
