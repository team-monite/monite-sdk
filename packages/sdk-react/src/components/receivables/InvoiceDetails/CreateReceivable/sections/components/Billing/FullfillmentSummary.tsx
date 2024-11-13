import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useDateTimeFormat } from '@/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { LockOutlined } from '@mui/icons-material';
import { FormControlLabel, Checkbox, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { PaymentSection } from '../../PaymentSection';
import { SectionGeneralProps } from '../../Section.types';

export const FullfillmentSummary = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control, resetField, setValue, watch } =
    useFormContext<CreateReceivablesFormProps>();

  const { api } = useMoniteContext();

  const { data: paymentTerms, isLoading: isPaymentTermsLoading } =
    api.paymentTerms.getPaymentTerms.useQuery();

  const { root } = useRootElements();
  const dateTimeFormat = useDateTimeFormat();

  const dateTime = i18n.date(new Date(), dateTimeFormat);

  /** Describes if `Same as invoice date` checkbox is checked */
  const [isSameAsInvoiceDateChecked, setIsSameAsInvoiceDateChecked] =
    useState<boolean>(false);

  const paymentTermsId = watch('payment_terms_id');

  const selectedPaymentTerm = paymentTerms?.data?.find(
    (term) => term.id === paymentTermsId
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="body2" color="textSecondary" fontWeight={500}>
          {t(i18n)`Issue date`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            {dateTime}
          </Typography>
          <LockOutlined sx={{ color: 'divider', width: '16px' }} />
          <Typography variant="body2" color="textSecondary">
            {t(i18n)`Set on issuance`}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary" fontWeight={500}>
          {t(i18n)`Due date`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            {t(i18n)`${selectedPaymentTerm?.name ?? 'Not selected'}`}
          </Typography>
          <LockOutlined sx={{ color: 'divider', width: '16px' }} />
          <Typography variant="body2" color="textSecondary">
            {t(i18n)`Set by payment term`}
          </Typography>
        </Box>
      </Box>
      <Box>
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
                  const today = new Date();

                  if (today.toDateString() === date?.toDateString()) {
                    setIsSameAsInvoiceDateChecked(true);
                  } else {
                    setIsSameAsInvoiceDateChecked(false);
                  }

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
                      setIsSameAsInvoiceDateChecked(false);
                    },
                  },
                }}
                views={['year', 'month', 'day']}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={isSameAsInvoiceDateChecked}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      if (checked) {
                        setValue(field.name, new Date(), {
                          shouldValidate: true,
                        });
                      } else {
                        resetField(field.name);
                      }

                      setIsSameAsInvoiceDateChecked(checked);
                    }}
                  />
                }
                label={t(i18n)`Same as invoice date`}
              />
            </>
          )}
        />
        <Box sx={{ mt: 1 }}>
          <PaymentSection
            disabled={disabled}
            paymentTerms={paymentTerms}
            isLoading={isPaymentTermsLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};
