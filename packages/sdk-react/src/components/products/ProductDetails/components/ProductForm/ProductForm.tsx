import { type ProductFormValues, getValidationSchema } from '../../validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useProductCurrencyGroups } from '@/core/hooks/useProductCurrencyGroups';
import { safeZodResolver } from '@/core/utils/safeZodResolver';
import { MoniteCurrency } from '@/ui/Currency';
import { RHFRadioGroup } from '@/ui/RHF/RHFRadioGroup';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

interface ProductFormProps {
  /** Triggered when the form is submitted */
  onSubmit: (values: ProductFormValues) => void;

  /**
   * Default values for the form fields
   */
  defaultValues: Partial<ProductFormValues>;

  /** The `<form />` id attribute to submit the form using external button */
  formId: string;

  /** Triggered when form values are changed or set back to defaults */
  onChanged?: (isDirty: boolean) => void;

  /**
   * Opens a form where users can manage measurement units.
   * Allows creating, editing, and deleting units.
   */
  onManageMeasureUnits: () => void;
}

/**
 * Common form for creating and editing products
 *
 * Renders a form, if `defaultValues` are provided,
 *  the form will be pre-filled with the values.
 */
export const ProductForm = ({
  defaultValues,
  formId,
  onChanged,
  onSubmit,
  onManageMeasureUnits,
}: ProductFormProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api } = useMoniteContext();

  const { data: measureUnits, isLoading: isLoadingUnits } =
    api.measureUnits.getMeasureUnits.useQuery();

  const { currencyGroups, isLoadingCurrencyGroups } =
    useProductCurrencyGroups();

  const methods = useForm<ProductFormValues>({
    resolver: safeZodResolver<ProductFormValues>(getValidationSchema(i18n)),
    defaultValues,
  });

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = methods;

  useEffect(() => onChanged?.(isDirty), [isDirty, onChanged]);

  const MANAGE_MEASURE_UNITS_ID = '__manage_measure_units__';

  function isManageMeasureUnits(option: string): boolean {
    return option === MANAGE_MEASURE_UNITS_ID;
  }

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleSubmit(onSubmit)(event);
        }}
      >
        <Grid container direction="column" rowSpacing={3}>
          <Grid item>
            <RHFTextField
              label={t(i18n)`Name`}
              name="name"
              control={control}
              fullWidth
              required
            />
          </Grid>

          <Grid item>
            <RHFTextField
              label={t(i18n)`Description`}
              name="description"
              control={control}
              multiline
              rows={2}
              fullWidth
            />
          </Grid>

          <Grid item>
            <RHFRadioGroup
              label={t(i18n)`Type`}
              name="type"
              control={control}
              options={[
                {
                  value: 'product',
                  label: t(i18n)`Product`,
                },
                {
                  value: 'service',
                  label: t(i18n)`Service`,
                },
              ]}
            />
          </Grid>

          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="units"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      variant="standard"
                      fullWidth
                      error={Boolean(error)}
                      required
                      disabled={isLoadingUnits}
                    >
                      <InputLabel id={field.name}>{t(i18n)`Unit`}</InputLabel>
                      <Select
                        labelId={field.name}
                        label={t(i18n)`Unit`}
                        MenuProps={{ container: root }}
                        {...field}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (isManageMeasureUnits(value)) {
                            field.onChange(null);
                            return;
                          }
                          field.onChange(value);
                        }}
                      >
                        <MenuItem
                          key={MANAGE_MEASURE_UNITS_ID}
                          value={MANAGE_MEASURE_UNITS_ID}
                          sx={{ color: 'primary.main', fontWeight: 'bold' }}
                          onClick={onManageMeasureUnits}
                        >
                          {t(i18n)`Manage measure units `}
                        </MenuItem>

                        {measureUnits?.data?.map(({ id, name }) => (
                          <MenuItem key={id} value={id}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <RHFTextField
                  label={t(i18n)`Minimum quantity`}
                  name="smallestAmount"
                  control={control}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <RHFTextField
                  label={t(i18n)`Price per unit`}
                  name="pricePerUnit"
                  control={control}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <MoniteCurrency
                  name="currency"
                  control={control}
                  required
                  actualCurrency={defaultValues.currency}
                  groups={currencyGroups}
                  disabled={isLoadingCurrencyGroups}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
