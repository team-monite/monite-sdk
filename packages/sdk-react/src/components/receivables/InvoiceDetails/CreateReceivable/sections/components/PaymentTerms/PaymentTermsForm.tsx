import { useState, FormEvent, ReactNode, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { safeZodResolver } from '@/core/utils/safeZodResolver';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Box,
  Alert,
  TextField,
} from '@mui/material';

import { DiscountForm } from './DiscountForm';
import { getValidation } from './paymentTermsValidation';
import { PaymentTermsFields, TermField } from './types';
import { usePaymentTermsApi } from './usePaymentTermsApi';

const MAX_DISCOUNTS = 2;

interface PaymentTermsFormProps {
  formName: string;
  selectedTerm?: components['schemas']['PaymentTermsResponse'] | null;
  onTermsChange?: (
    id?: components['schemas']['PaymentTermsResponse']['id']
  ) => void;
}

export const PaymentTermsForm = ({
  formName,
  selectedTerm,
  onTermsChange,
}: PaymentTermsFormProps) => {
  const { id: selectedTermId, ...selectedTermsFields } = selectedTerm || {};
  const [error, setError] = useState<ReactNode>();
  const { i18n } = useLingui();
  const methods = useForm<PaymentTermsFields>({
    defaultValues: { ...selectedTermsFields },
    resolver: safeZodResolver<PaymentTermsFields>(getValidation(i18n)),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const { createPaymentTerm, updatePaymentTerm } = usePaymentTermsApi({
    onCreationError: () =>
      setError(
        <>
          {t(i18n)`Failed to create payment term, please try again.`}
          <br />
          {t(i18n)`If this error recurs, contact your admin.`}
        </>
      ),
    onSuccessfullChange: onTermsChange,
  });

  const [discountForms, setDiscountForms] = useState<TermField[]>(() => {
    if (selectedTerm) {
      return [TermField.Term1, TermField.Term2].filter((term) =>
        Boolean(selectedTerm[term])
      );
    }

    return [];
  });

  useEffect(() => {
    const sectionErrors = Object.keys(errors).filter(
      (errorKey) =>
        ![...(Object.values(TermField) as string[])].includes(errorKey)
    );
    if (sectionErrors.length > 0) {
      setError(
        t(i18n)`To create a preset you need to fill out all the required fields`
      );
    } else {
      setError(null);
    }
  }, [errors, i18n]);

  const addDiscountForm = () => {
    if (discountForms.length === MAX_DISCOUNTS) return;
    const nextDiscount = discountForms.length
      ? TermField.Term2
      : TermField.Term1;

    setDiscountForms((prev) => [...prev, nextDiscount]);
    methods.setValue(nextDiscount, { number_of_days: null, discount: null });
  };

  const removeDiscountForm = () => {
    if (!discountForms.length) return;

    const discountToRemove = discountForms[discountForms.length - 1];
    setDiscountForms((prev) => prev.slice(0, -1));
    methods.setValue(discountToRemove, null);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    handleSubmit((values) => {
      const { term_1, term_2, ...rest } = values;
      const payload = { ...rest };

      if (term_1) {
        Object.assign(payload, { term_1 });
      }

      if (term_2) {
        Object.assign(payload, { term_2 });
      }

      if (selectedTermId) {
        updatePaymentTerm(selectedTermId, payload);
      } else {
        createPaymentTerm(payload);
      }
    })(event);
  };

  return (
    <FormProvider {...methods}>
      {!!error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      <form id={formName} noValidate onSubmit={onSubmit}>
        <Typography variant="subtitle1">{t(i18n)`Settings`}</Typography>
        <Card elevation={0} variant="outlined" sx={{ mt: 1 }}>
          <CardContent>
            <Stack direction="row" gap={1} useFlexGap>
              <TextField
                label={t(i18n)`Name`}
                {...register('name')}
                required
                error={!!errors.name}
                helperText={t(i18n)`Example: NET 30, –2%/10 days, –1%/20 days`}
                sx={{ flex: 1 }}
              />
              <TextField
                label={t(i18n)`Payment due`}
                {...register('term_final.number_of_days')}
                required
                type="number"
                error={!!errors.term_final?.number_of_days}
                sx={{ width: 180 }}
                InputProps={{
                  endAdornment: t(i18n)`days`,
                }}
              />
            </Stack>
            <TextField
              label={t(i18n)`Description`}
              {...register('description')}
              fullWidth
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">{t(
            i18n
          )`Early payment discounts`}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {t(i18n)`Offer a discount to your customer if they pay early.`}
            <br />
            {t(i18n)`You can set up to 2 early payment discounts per invoice.`}
          </Typography>
        </Box>
        <Stack gap={3} useFlexGap sx={{ mt: 3 }}>
          {discountForms.map((field, index) => (
            <DiscountForm
              key={field}
              index={index}
              field={field}
              isLast={index === discountForms.length - 1}
              remove={removeDiscountForm}
            />
          ))}
        </Stack>
        {discountForms.length < MAX_DISCOUNTS && (
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addDiscountForm}
          >{t(i18n)`Add discount`}</Button>
        )}
      </form>
    </FormProvider>
  );
};
