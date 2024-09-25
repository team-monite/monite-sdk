import { useState } from 'react';
import {
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type UseControllerProps,
  useFormContext,
} from 'react-hook-form';

import { Dialog } from '@/components';
import { PaymentTermsForm } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/PaymentTermsForm/PaymentTermsForm';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { RHFAutocomplete } from '@/components/RHF/RHFAutocomplete';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getBankAccountName } from '@/core/utils/getBankAccountName';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import type { SectionGeneralProps } from './Section.types';

export const PaymentSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  const { api } = useMoniteContext();

  const { data: bankAccounts, isLoading: isBankAccountsLoading } =
    api.bankAccounts.getBankAccounts.useQuery();

  const className = 'Monite-CreateReceivable-PaymentSection';

  return (
    <Stack spacing={1} className={className}>
      <Typography variant="h3">{t(i18n)`Payment`}</Typography>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {isBankAccountsLoading ? (
                <SelectSkeleton />
              ) : (
                <RHFTextField
                  fullWidth
                  select
                  name="entity_bank_account_id"
                  control={control}
                  label={t(i18n)`Bank account`}
                  disabled={disabled || !bankAccounts?.data.length}
                >
                  {!bankAccounts?.data.length && <MenuItem value="" />}
                  {bankAccounts?.data.map((bankAccount) => (
                    <MenuItem key={bankAccount.id} value={bankAccount.id}>
                      {getBankAccountName(i18n, bankAccount)}
                    </MenuItem>
                  ))}
                </RHFTextField>
              )}

              {!isBankAccountsLoading && !bankAccounts?.data.length && (
                <FormHelperText>{t(
                  i18n
                )`No bank accounts available`}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <PaymentTermsAutocomplete
                control={control}
                name="payment_terms_id"
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

const PaymentTermsAutocomplete = <
  TFieldValues extends FieldValues,
  TFieldPath extends FieldPath<TFieldValues>
>({
  disabled,
  name,
  control,
  ...restProps
}: UseControllerProps<TFieldValues, TFieldPath>) => {
  const { api, i18n } = useMoniteContext();
  const { watch, setValue } = useFormContext<TFieldValues>();
  const paymentTermsIdFieldValue = watch(name);
  const createLabel = ({
    name,
    description,
  }: {
    name: string;
    description?: string;
  }) => {
    return name + (description ? ` (${description})` : '');
  };

  const { data: paymentTermsOptionList, isLoading: isPaymentTermsListLoading } =
    api.paymentTerms.getPaymentTerms.useQuery(undefined, {
      select: (data) =>
        data.data?.map(({ id, name, description }) => ({
          value: id,
          label: createLabel({ name, description }),
        })) ?? [],
    });
  const { data: selectedPaymentTermsOption } =
    api.paymentTerms.getPaymentTermsId.useQuery(
      {
        path: {
          payment_terms_id: paymentTermsIdFieldValue
            ? String(paymentTermsIdFieldValue)
            : '',
        },
      },
      {
        enabled: Boolean(paymentTermsIdFieldValue),
        select: ({ id, name, description }) => ({
          value: id,
          label: createLabel({ name, description }),
        }),
      }
    );

  const { data: user } = useEntityUserByAuthToken();

  const { data: isCreateAllowed } = useIsActionAllowed({
    method: 'receivable',
    action: 'create',
    entityUserId: user?.id,
  });

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'receivable',
    action: 'update',
    entityUserId: user?.id,
  });

  const shouldPrependOptionsList = !paymentTermsOptionList?.some(
    ({ value }) => value === selectedPaymentTermsOption?.value
  );

  const paymentTermsOptions = [
    {
      value: 'create',
      label: t(i18n)`Create payment terms`,
    },
    shouldPrependOptionsList && selectedPaymentTermsOption,
    ...(paymentTermsOptionList ?? []),
  ].filter((option) => !!option);

  const [paymentTermsModal, setPaymentTermsModal] = useState<
    | {
        open: boolean;
        paymentTermsId: string;
      }
    | {
        open: boolean;
        paymentTermsId: undefined;
      }
  >({ open: false, paymentTermsId: undefined });

  if (isPaymentTermsListLoading) {
    return <SelectSkeleton />;
  }

  return (
    <>
      <Stack useFlexGap spacing={1} direction="row">
        <RHFAutocomplete
          {...restProps}
          label={t(i18n)`Payment terms`}
          name={name}
          fullWidth
          disabled={disabled}
          options={paymentTermsOptions}
          optionKey="value"
          labelKey="label"
          noOptionsText={t(i18n)`No payment terms available`}
          getOptionDisabled={(option) =>
            option.value === 'create' ? !isCreateAllowed : false
          }
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;

            if (!option.value) return '';
            if (option.value === 'create')
              return t(i18n)`Create a payment terms` ?? '';
            return option.label || '—';
          }}
          onChange={(_, value) => {
            if (value === null)
              return void setValue(
                name,
                '' as FieldPathValue<TFieldValues, TFieldPath>
              );

            if (
              !(
                typeof value === 'object' &&
                !Array.isArray(value) &&
                value?.value
              )
            )
              throw new Error('Invalid payment terms value');

            if (value.value === 'create')
              return void setPaymentTermsModal({
                open: true,
                paymentTermsId: undefined,
              });

            setValue(
              name,
              value.value as FieldPathValue<TFieldValues, TFieldPath>
            );
          }}
          renderOption={(props, option) => (
            <MenuItem
              {...props}
              key={option.value}
              value={option.value}
              disabled={!isCreateAllowed}
              sx={
                option.value === 'create'
                  ? {
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      color: 'primary.main',
                      whiteSpace: 'unset',
                    }
                  : {
                      whiteSpace: 'unset',
                    }
              }
            >
              {option.value === 'create' && <AddIcon sx={{ marginRight: 1 }} />}
              {option.label}
            </MenuItem>
          )}
        />
        <Button
          variant="outlined"
          disabled={!isUpdateAllowed || !paymentTermsIdFieldValue}
          size="large"
          onClick={(event) => {
            event.preventDefault();
            if (paymentTermsIdFieldValue)
              setPaymentTermsModal({
                open: true,
                paymentTermsId: paymentTermsIdFieldValue,
              });
          }}
        >
          {t(i18n)`Edit`}
        </Button>
      </Stack>
      <PaymentTermsDetailsDialog
        paymentTermsId={paymentTermsModal.paymentTermsId}
        open={paymentTermsModal.open}
        onClose={() =>
          setPaymentTermsModal((prev) => ({ ...prev, open: false }))
        }
        onCreate={(newPaymentTermsId) =>
          setValue(
            name,
            newPaymentTermsId as FieldPathValue<TFieldValues, TFieldPath>
          )
        }
      />
    </>
  );
};

const PaymentTermsDetailsDialog = ({
  paymentTermsId,
  open,
  onClose,
  onCreate,
  ...restProps
}: {
  open: boolean;
  paymentTermsId: string | undefined;
  onClose: () => void;
  onCreate: (paymentTermsId: string) => void;
}) => {
  return (
    <Dialog alignDialog="right" open={open} {...restProps}>
      {paymentTermsId && (
        <PaymentTermsForm
          paymentTermsId={paymentTermsId}
          onUpdate={onClose}
          onClose={onClose}
        />
      )}
      {!paymentTermsId && (
        <PaymentTermsForm
          paymentTermsId={undefined}
          onCreate={onCreate}
          onClose={onClose}
        />
      )}
    </Dialog>
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
