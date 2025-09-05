import { PaymentSection } from '../../PaymentSection';
import type { SectionGeneralProps } from '../../types';
import { components } from '@/api';
import { calculateDueDate } from '@/components/counterparts/helpers';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { LockOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';

interface FullfillmentSummaryProps extends SectionGeneralProps {
  paymentTerms:
    | {
        data?: components['schemas']['PaymentTermsResponse'][];
      }
    | undefined;
  isPaymentTermsLoading: boolean;
  isFieldShown: boolean;
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      {
        data?: components['schemas']['PaymentTermsResponse'][];
      },
      | Error
      | { error: components['schemas']['ErrorSchema'] }
      | { detail?: { loc: (string | number)[]; msg: string; type: string }[] }
    >
  >;
}

export const FullfillmentSummary = ({
  disabled,
  paymentTerms,
  isPaymentTermsLoading,
  isFieldShown,
  refetch,
}: FullfillmentSummaryProps) => {
  const { i18n } = useLingui();
  const { control, resetField, watch, setValue } =
    useFormContext<CreateReceivablesFormProps>();

  const { locale } = useMoniteContext();

  const { root } = useRootElements();

  const dateTime = i18n.date(new Date(), locale.dateTimeFormat);

  const paymentTermsId = watch('payment_terms_id');

  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term) => term.id === paymentTermsId
  );

  const dueDate = selectedPaymentTerm && calculateDueDate(selectedPaymentTerm);

  const handlePaymentTermsChange = async (newId: string = '') => {
    try {
      await refetch();
      await Promise.resolve();

      setValue('payment_terms_id', newId);
    } catch (error) {
      console.error('Error changing payment terms:', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', flexBasis: '50%' }}
        >
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
        <Box
          sx={{ display: 'flex', flexDirection: 'column', flexBasis: '50%' }}
        >
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
              {t(i18n)`${selectedPaymentTerm?.name ? '' : 'Not selected'}`}
              {dueDate ? i18n.date(dueDate, locale.dateTimeFormat) : ''}
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
