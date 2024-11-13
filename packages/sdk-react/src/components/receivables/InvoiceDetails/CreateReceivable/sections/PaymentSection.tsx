import { useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  FormHelperText,
  MenuItem,
  Skeleton,
  useTheme,
} from '@mui/material';

import type { SectionGeneralProps } from './Section.types';

type Props = SectionGeneralProps & {
  paymentTerms:
    | {
        data?: components['schemas']['PaymentTermsResponse'][];
      }
    | undefined;
  isLoading: boolean;
};

export const PaymentSection = ({
  disabled,
  paymentTerms,
  isLoading,
}: Props) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  return (
    <Box>
      {isLoading ? (
        <SelectSkeleton />
      ) : (
        <RHFTextField
          fullWidth
          select
          name="payment_terms_id"
          control={control}
          label={t(i18n)`Payment term`}
          disabled={disabled || !paymentTerms?.data?.length}
          required
        >
          {!paymentTerms?.data?.length && <MenuItem value="" />}
          {paymentTerms?.data?.map(({ id, name, description }) => (
            <MenuItem key={id} value={id}>
              {name}
              {description && ` (${description})`}
            </MenuItem>
          ))}
        </RHFTextField>
      )}

      {!isLoading && !paymentTerms?.data?.length && (
        <FormHelperText>
          {t(
            i18n
          )`There is no payment terms available. Please create one in the settings.`}
        </FormHelperText>
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
