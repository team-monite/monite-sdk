import React from 'react';

import { components } from '@/api';
import { useDialog } from '@/components/Dialog';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip';
import { PayableDataTestId } from '@/components/payables/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  ButtonProps,
  DialogTitle,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import { isPayableInOCRProcessing } from '../../utils/isPayableInOcr';
import { PayableDetailsPermissions } from '../usePayableDetails';

export interface PayablesDetailsHeaderProps {
  payable?: components['schemas']['PayableResponseSchema'];
  permissions: PayableDetailsPermissions[];
  setEdit: (isEdit: boolean) => void;
  submitInvoice: () => void;
  rejectInvoice: () => void;
  approveInvoice: () => void;
  cancelInvoice: () => void;
  payInvoice: () => void;
  /** The "id" of the form used to edit the Payable */
  payableDetailsFormId: string;
  onClose?: () => void;
}

export const PayableDetailsHeader = ({
  payable,
  permissions,
  setEdit,
  submitInvoice,
  rejectInvoice,
  approveInvoice,
  cancelInvoice,
  payInvoice,
  payableDetailsFormId,
  onClose,
}: PayablesDetailsHeaderProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();

  const buttonsByPermissions: Record<PayableDetailsPermissions, ButtonProps> = {
    edit: {
      variant: 'contained',
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
      variant: 'contained',
      color: 'error',
      onClick: rejectInvoice,
      children: t(i18n)`Reject`,
    },
    approve: {
      variant: 'contained',
      onClick: approveInvoice,
      children: t(i18n)`Approve`,
    },
    cancel: {
      variant: 'contained',
      color: 'error',
      onClick: cancelInvoice,
      children: t(i18n)`Cancel`,
    },
    pay: {
      variant: 'contained',
      onClick: payInvoice,
      children: t(i18n)`Pay`,
    },
  };

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const className = 'Monite__PayableDetails__Header';

  return (
    <DialogTitle sx={{ position: 'relative' }} className={className}>
      <Toolbar>
        {dialogContext?.isDialogContent && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label={t(i18n)`Close payable details`}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h3" sx={{ ml: 2, flex: 1 }} component="div">
            {payable?.document_id ?? t(i18n)`New incoming invoice`}
          </Typography>
          <PayableStatusChip status={payable?.status ?? 'draft'} />
        </Box>

        {(!payable || !isPayableInOCRProcessing(payable)) && (
          <Stack
            className={className + '__ActionsContainer'}
            spacing={2}
            direction="row"
            sx={{ marginLeft: 'auto' }}
            data-testid={PayableDataTestId.PayableDetailsActions}
          >
            {permissions.map((permission) => {
              const { children, ...restProps } =
                buttonsByPermissions[permission];

              return (
                <Button
                  key={permission}
                  className={className + '__Action--' + permission}
                  {...restProps}
                >
                  {children}
                </Button>
              );
            })}
          </Stack>
        )}
      </Toolbar>
    </DialogTitle>
  );
};
