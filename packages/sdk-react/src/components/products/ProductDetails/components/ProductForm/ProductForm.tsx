import { BaseSyntheticEvent, useCallback, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { RHFRadioGroup } from '@/components/RHF/RHFRadioGroup';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMeasureUnits } from '@/core/queries';
import { MoniteCurrency } from '@/ui/Currency';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ProductServiceTypeEnum } from '@monite/sdk-api';
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import {
  ProductFormValues,
  IProductFormSubmitValues,
  getValidationSchema,
} from '../../validation';

interface ProductFormProps {
  /** Triggered when the form is submitted */
  onSubmit: (values: IProductFormSubmitValues) => void;

  /**
   * Default values for the form fields
   */
  defaultValues: ProductFormValues;

  /** The `<form />` id attribute to submit the form using external button */
  formId: string;
}

/**
 * Common form for creating and editing products
 *
 * Renders a form, if `defaultValues` are provided,
 *  the form will be pre-filled with the values.
 */
export const ProductForm = (props: ProductFormProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { data: measureUnits, isLoading } = useMeasureUnits();

  const methods = useForm<IProductFormSubmitValues>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: useMemo(() => props.defaultValues, [props.defaultValues]),
  });

  const { control, handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        id={props.formId}
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(props.onSubmit)(event);
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
            <RHFRadioGroup
              label={t(i18n)`Type`}
              name="type"
              control={control}
              options={[
                {
                  value: ProductServiceTypeEnum.PRODUCT,
                  label: t(i18n)`Product`,
                },
                {
                  value: ProductServiceTypeEnum.SERVICE,
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
                      variant="outlined"
                      fullWidth
                      error={Boolean(error)}
                      required
                      disabled={isLoading}
                    >
                      <InputLabel id={field.name}>{t(i18n)`Units`}</InputLabel>
                      <Select
                        labelId={field.name}
                        label={t(i18n)`Units`}
                        MenuProps={{ container: root }}
                        {...field}
                      >
                        {[...(measureUnits?.data ?? [])].map(({ id, name }) => (
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
                  label={t(i18n)`Smallest amount`}
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
                <MoniteCurrency name="currency" control={control} required />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <RHFTextField
              label={t(i18n)`Description`}
              name="description"
              control={control}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};
