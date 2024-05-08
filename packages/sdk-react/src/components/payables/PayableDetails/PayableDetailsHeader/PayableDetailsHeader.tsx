import React, { cloneElement, ReactElement, useMemo } from 'react';

import { useDialog } from '@/components/Dialog';
import { PayableStatusChip } from '@/components/payables/PayableStatusChip';
import { PayableDataTestId } from '@/components/payables/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { PayableResponseSchema, PayableStateEnum } from '@monite/sdk-api';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  DialogTitle,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import { isPayableInOCRProcessing } from '../../utils/isPayableInOcr';
import { PayableDetailsPermissions } from '../usePayableDetails';

export interface PayablesDetailsHeaderProps {
  payable?: PayableResponseSchema;
  permissions: PayableDetailsPermissions[];
  setEdit: (isEdit: boolean) => void;
  submitInvoice: () => void;
  rejectInvoice: () => void;
  approveInvoice: () => void;
  cancelInvoice: () => void;
  payInvoice: () => void;
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
  onClose,
}: PayablesDetailsHeaderProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();

  const actions = useMemo<Record<PayableDetailsPermissions, ReactElement>>(
    () => ({
      edit: (
        <Button
          variant="contained"
          key="edit"
          color="primary"
          onClick={() => setEdit(true)}
        >
          {t(i18n)`Edit`}
        </Button>
      ),
      save: (
        <Button
          variant="contained"
          key="save"
          color="primary"
          type="submit"
          value="save"
          form="payableDetailsForm"
        >
          {t(i18n)`Save`}
        </Button>
      ),
      cancelEdit: (
        <Button
          variant="outlined"
          key="cancelEdit"
          onClick={() => {
            setEdit(false);

            !payable && onClose && onClose();
          }}
        >
          {t(i18n)`Cancel`}
        </Button>
      ),
      submit: (
        <Button
          variant="contained"
          key="submit"
          color="primary"
          onClick={submitInvoice}
        >
          {t(i18n)`Submit`}
        </Button>
      ),
      reject: (
        <Button
          variant="contained"
          key="reject"
          color="error"
          onClick={rejectInvoice}
        >
          {t(i18n)`Reject`}
        </Button>
      ),
      approve: (
        <Button
          variant="contained"
          key="approve"
          color="primary"
          onClick={approveInvoice}
        >
          {t(i18n)`Approve`}
        </Button>
      ),
      cancel: (
        <Button
          variant="contained"
          key="cancel"
          color="error"
          onClick={cancelInvoice}
        >
          {t(i18n)`Cancel`}
        </Button>
      ),
      pay: (
        <Button
          variant="contained"
          key="pay"
          color="primary"
          onClick={payInvoice}
        >
          {t(i18n)`Pay`}
        </Button>
      ),
    }),
    [
      i18n,
      submitInvoice,
      rejectInvoice,
      approveInvoice,
      cancelInvoice,
      payInvoice,
      setEdit,
      payable,
      onClose,
    ]
  );

  return (
    <DialogTitle sx={{ position: 'relative' }}>
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
          <PayableStatusChip
            status={payable?.status ?? PayableStateEnum.DRAFT}
          />
        </Box>
        {(!payable || !isPayableInOCRProcessing(payable)) && (
          <Stack
            spacing={2}
            direction="row"
            sx={{ marginLeft: 'auto' }}
            data-testid={PayableDataTestId.PayableDetailsActions}
          >
            {permissions.map((permission) => cloneElement(actions[permission]))}
          </Stack>
        )}
      </Toolbar>
    </DialogTitle>
  );
};
