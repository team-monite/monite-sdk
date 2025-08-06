import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import { Box, MenuItem, Skeleton, useTheme, Button } from '@mui/material';

import {
  PaymentTermsSummary,
  PaymentTermsDialog,
} from './components/PaymentTerms';
import type { SectionGeneralProps } from './types';

type Props = SectionGeneralProps & {
  paymentTerms:
    | {
        data?: components['schemas']['PaymentTermsResponse'][];
      }
    | undefined;
  isLoading: boolean;
  selectedPaymentTerm?: components['schemas']['PaymentTermsResponse'];
  onPaymentTermsChange: (
    id?: components['schemas']['PaymentTermsResponse']['id']
  ) => void;
};

enum TermsDialogState {
  Closed,
  Create,
  Update,
}

export const PaymentSection = ({
  disabled,
  paymentTerms,
  isLoading,
  selectedPaymentTerm,
  onPaymentTermsChange,
}: Props) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();
  const [termsDialogState, setTermsDialogState] = useState<TermsDialogState>(
    TermsDialogState.Closed
  );

  const openEditDialog = () => {
    setTermsDialogState(TermsDialogState.Update);
  };

  const onTermsDialogClosed = (id?: string, deleted?: boolean) => {
    setTermsDialogState(TermsDialogState.Closed);

    if (id || deleted) {
      onPaymentTermsChange(id);
    }
  };

  return (
    <Box>
      {isLoading ? (
        <SelectSkeleton />
      ) : (
        <>
          <RHFTextField
            fullWidth
            select
            name="payment_terms_id"
            control={control}
            label={t(i18n)`Payment terms`}
            disabled={disabled}
            required
          >
            <Button
              variant="text"
              startIcon={<AddIcon />}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                px: 2,
              }}
              onClick={() => setTermsDialogState(TermsDialogState.Create)}
            >
              {t(i18n)`Create payment term`}
            </Button>
            {paymentTerms?.data?.map(({ id, name, description }) => (
              <MenuItem key={id} value={id}>
                {name}
                {description && ` (${description})`}
              </MenuItem>
            ))}
          </RHFTextField>
          {selectedPaymentTerm && (
            <Box sx={{ mt: 1 }}>
              <PaymentTermsSummary
                paymentTerm={selectedPaymentTerm}
                openEditDialog={openEditDialog}
              />
            </Box>
          )}
          <PaymentTermsDialog
            show={termsDialogState !== TermsDialogState.Closed}
            closeDialog={onTermsDialogClosed}
            selectedTerm={
              termsDialogState === TermsDialogState.Update
                ? selectedPaymentTerm
                : undefined
            }
          />
        </>
      )}
    </Box>
  );
};

const SelectSkeleton = () => {
  const theme = useTheme();
  return (
    <Skeleton
      variant="rounded"
      width="100%"
      height="100%"
      sx={{
        minHeight: `calc(${theme.spacing(5)} + ${
          theme.typography.body1.fontSize
        })`,
      }}
    />
  );
};
