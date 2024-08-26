import { ReactNode, useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { usePreviousDistinct } from 'react-use';

import { components } from '@/api';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { createDayPluralForm } from '@/core/i18n/plural/createDayPluralForm';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { yupResolver } from '@hookform/resolvers/yup';
import type { I18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Add } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import * as yup from 'yup';
import type { SchemaOf } from 'yup';

interface CreatePaymentTermsFormProps {
  onCreate(paymentTermsId: string): void;
  paymentTermsId?: never;
  onClose?(): void;
}

interface UpdatePaymentTermsFormProps {
  paymentTermsId: string;
  onUpdate(): void;
  onClose(): void;
}

export const PaymentTermsForm = ({
  paymentTermsId,
  ...restProps
}: CreatePaymentTermsFormProps | UpdatePaymentTermsFormProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const {
    data: paymentTerms,
    error,
    isError,
    isLoading,
  } = api.paymentTerms.getPaymentTermsId.useQuery(
    {
      path: { payment_terms_id: paymentTermsId || '' },
    },
    { enabled: Boolean(paymentTermsId) }
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <NotFound
        title={t(i18n)`Payment terms error`}
        description={getAPIErrorMessage(i18n, error)}
      />
    );
  }

  if (paymentTermsId && !paymentTerms) {
    return (
      <NotFound
        title={t(i18n)`Payment terms not found`}
        description={t(
          i18n
        )`There is no payment terms by provided id: ${paymentTermsId}`}
      />
    );
  }

  return (
    <PaymentTermsFormComponent paymentTerms={paymentTerms} {...restProps} />
  );
};

const PaymentTermsFormComponent = ({
  paymentTerms,
  ...props
}:
  | {
      onCreate?(paymentTermsId: string): void;
      paymentTerms?: undefined;
      onClose?(): void;
    }
  | {
      onUpdate?(paymentTermsId: string): void;
      paymentTerms: components['schemas']['PaymentTerms'];
      onClose?(): void;
    }) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  const methods = useForm<
    yup.InferType<ReturnType<typeof getPaymentTermsCreatePayloadSchema>>
  >({
    resolver: yupResolver(getPaymentTermsCreatePayloadSchema(i18n)),
    defaultValues: {
      name: paymentTerms?.name ?? '',
      // @ts-expect-error - `description` not exists in OpenAPI Document
      description: paymentTerms?.description ?? '',
      term_1: paymentTerms?.term_1 ?? null,
      term_2: paymentTerms?.term_2 ?? null,
      term_final: {
        number_of_days: paymentTerms?.term_final?.number_of_days ?? 45,
      },
    },
  });

  const { control, handleSubmit, setValue, watch } = methods;

  const [term1FieldValue, term2FieldValue, termFinalFieldValue] = watch([
    'term_1',
    'term_2',
    'term_final',
  ]);

  const formName = `Monite-PaymentTermsForm-${useId()}`;

  const createPaymentTermsMutation =
    api.paymentTerms.postPaymentTerms.useMutation(undefined, {
      onSuccess: async (newPaymentTerms) => {
        await api.paymentTerms.getPaymentTerms.invalidateQueries(queryClient);

        toast.success(t(i18n)`Payment terms has been created`);

        if ('onCreate' in props) props.onCreate?.(newPaymentTerms.id);
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  const updatePaymentTermsMutation =
    api.paymentTerms.patchPaymentTermsId.useMutation(
      { path: { payment_terms_id: paymentTerms?.id ?? '' } },
      {
        onSuccess: async (updatedPaymentTerms) => {
          api.paymentTerms.getPaymentTermsId.setQueryData(
            {
              path: { payment_terms_id: updatedPaymentTerms.id },
            },
            updatedPaymentTerms,
            queryClient
          );

          await api.paymentTerms.getPaymentTerms.invalidateQueries(queryClient);

          toast.success(t(i18n)`Payment terms has been updated`);

          api.paymentTerms.getPaymentTermsId.invalidateQueries(
            {
              parameters: {
                path: { payment_terms_id: updatedPaymentTerms.id },
              },
            },
            queryClient
          );

          if ('onUpdate' in props) props.onUpdate?.(updatedPaymentTerms.id);
        },
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
      }
    );

  const { root } = useRootElements();

  const previousTermFinalNumberOfDaysFieldValue = usePreviousDistinct(
    termFinalFieldValue.number_of_days
  );

  const optionList: { value: number; label: string }[] = [
    termFinalFieldValue.number_of_days ||
      previousTermFinalNumberOfDaysFieldValue,
    15,
    20,
    25,
    30,
    35,
    40,
    45,
  ]
    .filter((item, index, array) => array.lastIndexOf(item) === index)
    .filter((item) => typeof item === 'number')
    .map((number_of_days) => {
      const number_of_days_plural = createDayPluralForm(i18n, number_of_days);

      return {
        value: number_of_days,
        label: t(i18n)`${number_of_days} ${number_of_days_plural}`,
      };
    });

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            {paymentTerms
              ? t(i18n)`Update payment term`
              : t(i18n)`Create payment term`}
          </Typography>
          {props.onClose && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={(event) => {
                event.preventDefault();
                props.onClose?.();
              }}
              aria-label={t(i18n)`Close`}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <form
          id={formName}
          noValidate
          onSubmit={handleSubmit((body) => {
            if (paymentTerms)
              return updatePaymentTermsMutation.mutate(
                // @ts-expect-error - back-end does not support `null` values
                body
              );
            return createPaymentTermsMutation.mutate({
              // @ts-expect-error - back-end does not support `null` values
              body,
            });
          })}
        >
          <Stack spacing={3}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack useFlexGap spacing={3}>
                <RHFTextField
                  label={t(i18n)`Preset name`}
                  name="name"
                  control={control}
                  fullWidth
                  required
                />

                <RHFTextField
                  label={t(i18n)`Description`}
                  name="description"
                  control={control}
                  fullWidth
                  required
                />

                <Controller
                  control={control}
                  name="term_final.number_of_days"
                  render={({
                    field,
                    fieldState: { error, isTouched },
                    formState: { isValid },
                  }) => (
                    <Autocomplete
                      {...field}
                      freeSolo
                      slotProps={{
                        popper: {
                          container: root,
                        },
                      }}
                      options={optionList}
                      onChange={(_, value) => {
                        if (typeof value === 'string')
                          return void field.onChange(parseInt(value));
                        field.onChange(value?.value ?? null);
                      }}
                      value={{
                        value: field.value,
                        label: String(field.value),
                      }}
                      getOptionLabel={(option) =>
                        String(
                          typeof option === 'string' ? option : option.label
                        )
                      }
                      getOptionKey={(option) =>
                        typeof option === 'string' ? option : option.value
                      }
                      renderInput={(params) => {
                        const inputError =
                          isTouched || !isValid ? error : undefined;

                        return (
                          <TextField
                            {...params}
                            required
                            label={t(i18n)`Payment due`}
                            error={!!inputError?.message}
                            type="number"
                            helperText={inputError?.message}
                            InputProps={{
                              ...params.InputProps,
                              slotProps: {
                                input: { min: 1, inputMode: 'numeric' },
                              },
                            }}
                          />
                        );
                      }}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Box>
              <Typography variant="body1" color="text.primary" mb={1}>
                {t(i18n)`Early payment discounts`}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                <Trans>
                  Offer a discount to your customer if they pay early. You can
                  set up to 2 early payment discounts per invoice.
                </Trans>
              </Typography>
            </Box>

            {term1FieldValue && (
              <PaymentTermsFormLayout
                title={t(i18n)`Discount date 1`}
                numberOfDays={
                  <>
                    <InputLabel htmlFor="term_1.number_of_days">
                      <Typography>{t(i18n)`Pay in`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_1.number_of_days"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, inputMode: 'numeric' },
                      }}
                      control={control}
                      size="small"
                    />
                  </>
                }
                discount={
                  <>
                    <InputLabel htmlFor="term_1.discount">
                      <Typography>{t(i18n)`to get discount`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_1.discount"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, inputMode: 'numeric' },
                      }}
                      control={control}
                      size="small"
                    />
                  </>
                }
                onDelete={() => {
                  if (!term2FieldValue) return void setValue('term_1', null);
                  setValue('term_1', term2FieldValue);
                  setValue('term_2', null);
                }}
              />
            )}
            {term2FieldValue && (
              <PaymentTermsFormLayout
                title={t(i18n)`Discount date 2`}
                numberOfDays={
                  <>
                    <InputLabel htmlFor="term_2.number_of_days">
                      <Typography>{t(i18n)`Pay in`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_2.number_of_days"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, inputMode: 'numeric' },
                      }}
                      control={control}
                      size="small"
                    />
                  </>
                }
                discount={
                  <>
                    <InputLabel htmlFor="term_2.discount">
                      <Typography>{t(i18n)`to get discount`}</Typography>
                    </InputLabel>
                    <RHFTextField
                      name="term_2.discount"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, inputMode: 'numeric' },
                      }}
                      control={control}
                      size="small"
                    />
                  </>
                }
                onDelete={() => setValue('term_2', null)}
              />
            )}
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ alignSelf: 'start' }}
              disabled={Boolean(term1FieldValue && term2FieldValue)}
              onClick={(event) => {
                event.preventDefault();

                if (!term1FieldValue)
                  return void setValue('term_1', {
                    number_of_days: Math.max(
                      1,
                      Math.floor(
                        (termFinalFieldValue?.number_of_days ?? 45) * 0.8
                      )
                    ),
                    discount: 5,
                  });

                if (!term2FieldValue)
                  return void setValue('term_2', {
                    number_of_days: Math.max(
                      1,
                      Math.floor((term1FieldValue.number_of_days ?? 45) * 0.6)
                    ),
                    discount: Math.max(
                      1,
                      parseFloat(
                        ((term1FieldValue.discount ?? 2) * 0.5).toFixed(2)
                      )
                    ),
                  });
              }}
            >{t(i18n)`Add discount`}</Button>
          </Stack>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        {props?.onClose && (
          <Button
            variant="outlined"
            onClick={(event) => {
              event.preventDefault();
              props?.onClose?.();
            }}
          >
            {t(i18n)`Cancel`}
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          form={formName}
          disabled={createPaymentTermsMutation.isPending}
        >
          {paymentTerms ? t(i18n)`Update` : t(i18n)`Create`}
        </Button>
      </DialogActions>
    </>
  );
};

interface PaymentTermsFormLayoutProps {
  title: string;
  numberOfDays: ReactNode;
  discount: ReactNode;
  onDelete: () => void;
}

export const PaymentTermsFormLayout = ({
  title,
  numberOfDays,
  discount,
  onDelete,
}: PaymentTermsFormLayoutProps) => {
  const { i18n } = useLingui();

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Stack useFlexGap spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <Button
            aria-label="delete"
            startIcon={<DeleteIcon />}
            color="error"
            onClick={onDelete}
          >
            {t(i18n)`Delete`}
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {numberOfDays}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {discount}
        </Box>
      </Stack>
    </Card>
  );
};

export const getPaymentTermsCreatePayloadSchema = (
  i18n: I18n
): SchemaOf<PaymentTermsCreatePayloadSchema> => {
  const createTermDiscountSchema = (max?: {
    maxDays: number;
    errorMessage: string;
  }): SchemaOf<components['schemas']['PaymentTermDiscount']> => {
    return yup.object({
      discount: yup
        .number()
        .required()
        .label(t(i18n)`Discount`),
      number_of_days: yup
        .number()
        .integer()
        .required()
        .label(t(i18n)`Pay in`)
        .min(1, t(i18n)`The number of days must be greater than 0`)
        .max(max?.maxDays ?? Infinity, max?.errorMessage),
    });
  };

  return yup.object({
    name: yup
      .string()
      .label(t(i18n)`Name`)
      .required(),
    description: yup
      .string()
      .nullable()
      .required()
      .label(t(i18n)`Description`),
    term_1: createTermDiscountSchema()
      .when(
        'term_final',
        (termFinal: { number_of_days?: number } | undefined, schema) => {
          if (!termFinal?.number_of_days) return schema;

          return createTermDiscountSchema({
            maxDays: termFinal.number_of_days,
            errorMessage: t(
              i18n
            )`The number of Discount days must be less than of Due days`,
          }) satisfies SchemaOf<components['schemas']['PaymentTermDiscount']>;
        }
      )
      .nullable()
      .required(),

    term_2: createTermDiscountSchema()
      .when(
        'term_1',
        (term1: { number_of_days?: number } | undefined, schema) => {
          if (!term1?.number_of_days) return schema;

          return createTermDiscountSchema({
            maxDays: term1.number_of_days,
            errorMessage: t(
              i18n
            )`The number of Discount 2 days must be more than the number of Discount 1 days`,
          }) satisfies SchemaOf<components['schemas']['PaymentTermDiscount']>;
        }
      )
      .nullable()
      .required(),
    term_final: yup
      .object({
        number_of_days: yup
          .number()
          .integer()
          .required()
          .label(t(i18n)`Payment due`),
      })
      .required(),
  });
};

type PaymentTermsCreatePayloadSchema = UndefinedToNull<
  components['schemas']['PaymentTermsCreatePayload']
>;

type UndefinedToNull<T> = {
  [Prop in keyof T]-?: T[Prop] extends object
    ? UndefinedToNull<T[Prop]>
    : UnionUndefinedToNull<T[Prop]>;
};
type UnionUndefinedToNull<T> = T extends undefined ? null : T;
