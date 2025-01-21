import { useId, useState } from 'react';

import { components } from '@/api';
import { Dialog } from '@/components';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  Typography,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';

import { DeletePaymentTerms } from './DeletePaymentTerms';
import { PaymentTermsForm } from './PaymentTermsForm';

export interface PaymentTermsDialogProps {
  show: boolean;
  closeDialog: (
    id?: components['schemas']['PaymentTermsResponse']['id'],
    isDeleted?: boolean
  ) => void;
  selectedTerm?: components['schemas']['PaymentTermsResponse'];
}

export const PaymentTermsDialog = ({
  show,
  closeDialog,
  selectedTerm,
}: PaymentTermsDialogProps) => {
  const formName = `Monite-Form-paymentTerms-${useId()}`;

  const submitButtonText = selectedTerm ? t(i18n)`Save` : t(i18n)`Create`;
  const titleText = selectedTerm
    ? t(i18n)`Edit payment term`
    : t(i18n)`Create payment term`;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const closeDeleteDialog = (isDeleted: boolean) => {
    setShowDeleteDialog(false);

    closeDialog(undefined, isDeleted);
  };

  return (
    <>
      <Dialog open={show} alignDialog="right" onClose={() => closeDialog()}>
        <DialogTitle>
          <Typography variant="h4">{titleText}</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <PaymentTermsForm
            formName={formName}
            selectedTerm={selectedTerm}
            onTermsChange={closeDialog}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Stack
            direction="row"
            sx={{
              flex: 1,
              justifyContent: selectedTerm ? 'space-between' : 'flex-end',
              px: 2,
            }}
          >
            {selectedTerm && (
              <Button
                variant="text"
                color="error"
                onClick={() => setShowDeleteDialog(true)}
              >{t(i18n)`Delete`}</Button>
            )}
            <Stack direction="row" gap={1} useFlexGap>
              <Button variant="text" onClick={() => closeDialog()}>{t(
                i18n
              )`Cancel`}</Button>
              <Button type="submit" variant="contained" form={formName}>
                {submitButtonText}
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Dialog>
      {selectedTerm && (
        <DeletePaymentTerms
          show={showDeleteDialog}
          paymentTermsId={selectedTerm.id}
          closeDialog={closeDeleteDialog}
        />
      )}
    </>
  );
};
