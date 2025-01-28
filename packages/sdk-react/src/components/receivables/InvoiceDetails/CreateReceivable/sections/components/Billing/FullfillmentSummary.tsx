import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { LockOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Button, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

import { PaymentSection } from '../../PaymentSection';
import { SectionGeneralProps } from '../../Section.types';

interface FullfillmentSummaryProps extends SectionGeneralProps {
  paymentTerms:
    | {
        data?: components['schemas']['PaymentTermsResponse'][];
      }
    | undefined;
  isPaymentTermsLoading: boolean;
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      {
        data?: components['schemas']['PaymentTermsResponse'][];
      },
      Error | { error: components['schemas']['ErrorSchema'] }
    >
  >;
}

export const FullfillmentSummary = ({
  disabled,
  paymentTerms,
  isPaymentTermsLoading,
  refetch,
}: FullfillmentSummaryProps) => {
  const { i18n } = useLingui();
  const { control, resetField, watch, setValue } =
    useFormContext<CreateReceivablesFormProps>();

  const { api, locale } = useMoniteContext();

  const { root } = useRootElements();

  const dateTime = i18n.date(new Date(), locale.dateTimeFormat);

  const [isFieldShown, setIsFieldShown] = useState<boolean>(false);

  const paymentTermsId = watch('payment_terms_id');

  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term) => term.id === paymentTermsId
  );

  const handlePaymentTermsChange = async (newId: string = '') => {
    await refetch();
    setValue('payment_terms_id', newId);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="body2"
            color="textSecondary"
            mb={0.5}
            fontWeight={500}
          >
            {t(i18n)`Issue date`}
          </Typography>
          <Box>
            <Typography variant="body2" color="textSecondary">
              {dateTime}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <LockOutlined sx={{ color: 'divider', width: '16px' }} />
              {t(i18n)`Set on issuance`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="body2"
            color="textSecondary"
            mb={0.5}
            fontWeight={500}
          >
            {t(i18n)`Due date`}
          </Typography>
          <Box>
            <Typography variant="body2" color="textSecondary">
              {t(i18n)`${selectedPaymentTerm?.name ?? 'Not selected'}`}
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <LockOutlined sx={{ color: 'divider', width: '16px' }} />
              {t(i18n)`Set by payment term`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box mt={2}>
        <Box sx={{ mt: 1, mb: 2 }}>
          <PaymentSection
            disabled={disabled}
            paymentTerms={paymentTerms}
            isLoading={isPaymentTermsLoading}
            selectedPaymentTerm={selectedPaymentTerm}
            onPaymentTermsChange={handlePaymentTermsChange}
          />
        </Box>
        {!isFieldShown && (
          <Button startIcon={<AddIcon />} onClick={() => setIsFieldShown(true)}>
            {t(i18n)`Fulfillment date`}
          </Button>
        )}
        {isFieldShown && (
          <Controller
            name="fulfillment_date"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <DatePicker
                  {...field}
                  minDate={new Date()}
                  disabled={disabled}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  label={t(i18n)`Fulfillment date`}
                  slotProps={{
                    popper: {
                      container: root,
                    },
                    dialog: {
                      container: root,
                    },
                    actionBar: {
                      actions: ['today'],
                    },
                    textField: {
                      fullWidth: true,
                      helperText: error?.message,
                    },
                    field: {
                      clearable: true,
                      onClear: () => {
                        resetField(field.name);
                      },
                    },
                  }}
                  views={['year', 'month', 'day']}
                />
              </>
            )}
          />
        )}
      </Box>
    </>
  );
};
