'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { getCounterpartName } from '@/components/counterparts/helpers';
import { CountryInvoiceOption } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/CountryInvoiceOption';
import { CreateCounterpartDialog } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CreateCounterpartDialog';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCounterpartAddresses,
  useCounterpartById,
  useCounterpartContactList,
  useCounterpartList,
  useCounterpartVatList,
} from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CounterpartAddressResponseWithCounterpartID } from '@monite/sdk-api';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material';

import { CreateReceivablesFormProps } from '../validation';
import type { SectionGeneralProps } from './Section.types';

interface CounterpartsAutocompleteOptionProps {
  id: string;
  label: string;
}

const filter = createFilterOptions<CounterpartsAutocompleteOptionProps>();

const CounterpartAddressView = ({
  address,
}: {
  address: CounterpartAddressResponseWithCounterpartID | undefined;
}) => {
  if (!address) {
    return null;
  }

  return (
    <>
      {address.postal_code}, {address.city}, {address.line1}
    </>
  );
};

const customerGridItemProps = {
  xs: 12,
  sm: 6,
  md: 4,
  lg: 4,
};

const COUNTERPART_CREATE_NEW_ID = '__create-new__';

function isCreateNewCounterpartOption(
  counterpartOption: CounterpartsAutocompleteOptionProps | undefined | null
): boolean {
  return counterpartOption?.id === COUNTERPART_CREATE_NEW_ID;
}

export const CustomerSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control, watch, resetField, setValue } =
    useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();

  const counterpartId = watch('counterpart_id');

  const { data: counterparts, isLoading: isCounterpartsLoading } =
    useCounterpartList();
  const {
    data: counterpartContacts,
    error: contactPersonError,
    isLoading: isContactPersonsLoading,
  } = useCounterpartContactList(counterpartId);
  const { data: counterpartVats, isLoading: isCounterpartVatsLoading } =
    useCounterpartVatList(counterpartId);
  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const {
    data: counterpartAddresses,
    isLoading: isCounterpartAddressesLoading,
  } = useCounterpartAddresses(counterpartId);

  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const handleCreateNewCounterpart = useCallback(() => {
    setIsCreateCounterpartOpened(true);
  }, []);

  const counterpartsAutocompleteData = useMemo<
    Array<CounterpartsAutocompleteOptionProps>
  >(
    () =>
      counterparts
        ? counterparts?.data.map((counterpart) => ({
            id: counterpart.id,
            label: getCounterpartName(counterpart),
          }))
        : [],
    [counterparts]
  );

  /**
   * `defaultContactName` must return an empty string
   *  if it has no contact, because MUI throws a warning
   *  if input at the beginning has `undefined` and then
   *  a string. We have to always set a string to do not
   *  break MUI lifecycle
   */
  const defaultContactName = useMemo(() => {
    if (counterpartContacts?.length === 0) {
      return '';
    }

    const defaultContact = counterpartContacts?.find(
      (contact) => contact.is_default
    );

    if (!defaultContact) {
      return '';
    }

    return `${defaultContact.first_name} ${defaultContact.last_name}`;
  }, [counterpartContacts]);

  const counterpartBillingAddress = useMemo(() => {
    if (!counterpartAddresses) {
      return undefined;
    }

    const defaultAddress = counterpartAddresses.find(
      (address) => address.is_default
    );

    if (!defaultAddress) {
      throw new Error('Monite SDK-React: default billing address is not found');
    }

    return defaultAddress;
  }, [counterpartAddresses]);

  useEffect(() => {
    if (counterpartId) {
      /**
       * For some reason `methods.resetField` doesn't work here,
       *  maybe because that `Select` triggers `onChange` event
       *  before `resetField` is called
       * But `setValue` as empty string works fine
       */
      setValue('default_shipping_address_id', '');
    }
  }, [counterpartId, setValue]);

  useEffect(() => {
    if (counterpartBillingAddress) {
      /**
       * We have to set billing address id manually because
       *  the user never changes this field by themselves.
       * This field is calculated based on counterpart billing address
       */
      setValue('default_billing_address_id', counterpartBillingAddress.id, {
        shouldValidate: true,
      });
    }
  }, [counterpartBillingAddress, setValue]);

  const counterpartListContent = useMemo(() => {
    if (!counterparts || counterparts.data.length === 0) {
      return (
        <Box
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>{t(
            i18n
          )`No counterparts found.`}</Typography>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={handleCreateNewCounterpart}
          >{t(i18n)`Create New`}</Button>
        </Box>
      );
    }

    return [
      <Box key="counterpart-create-new">
        <Button
          variant="text"
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            justifyContent: 'flex-start',
            px: 2,
          }}
          onClick={handleCreateNewCounterpart}
        >
          {t(i18n)`Create new counterpart`}
        </Button>
      </Box>,
      counterparts?.data.map((counterpart) => (
        <MenuItem key={counterpart.id} value={counterpart.id}>
          {getCounterpartName(counterpart)}
        </MenuItem>
      )),
    ];
  }, [counterparts, handleCreateNewCounterpart, i18n]);

  return (
    <Stack spacing={1}>
      <CreateCounterpartDialog
        open={isCreateCounterpartOpened}
        onClose={() => {
          setIsCreateCounterpartOpened(false);
        }}
      />

      <Typography variant="subtitle2">{t(i18n)`Customer`}</Typography>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item {...customerGridItemProps}>
              <Controller
                name="counterpart_id"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const selectedCounterpart = counterparts?.data.find(
                    (counterpart) => counterpart.id === field.value
                  );

                  /**
                   * We have to set `selectedCounterpartOption` to `null`
                   *  if `selectedCounterpart` is `null` because
                   *  `Autocomplete` component doesn't work with `undefined`
                   */
                  const selectedCounterpartOption = selectedCounterpart
                    ? {
                        id: selectedCounterpart.id,
                        label: getCounterpartName(selectedCounterpart),
                      }
                    : null;

                  return (
                    <Autocomplete
                      {...field}
                      value={selectedCounterpartOption}
                      onChange={(_, value) => {
                        if (isCreateNewCounterpartOption(value)) {
                          field.onChange(null);

                          return;
                        }

                        field.onChange(value?.id);
                      }}
                      slotProps={{
                        popper: {
                          container: root,
                        },
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        filtered.unshift({
                          id: COUNTERPART_CREATE_NEW_ID,
                          label: t(i18n)`Create new counterpart`,
                        });

                        return filtered;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t(i18n)`Bill to`}
                          required
                          error={Boolean(error)}
                          helperText={error?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: isCounterpartsLoading ? (
                              <CircularProgress size={20} />
                            ) : null,
                          }}
                        />
                      )}
                      loading={isCounterpartsLoading || disabled}
                      options={counterpartsAutocompleteData}
                      getOptionLabel={(counterpartOption) =>
                        isCreateNewCounterpartOption(counterpartOption)
                          ? ''
                          : counterpartOption.label
                      }
                      isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                      }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      renderOption={(props, counterpartOption) =>
                        isCreateNewCounterpartOption(counterpartOption) ? (
                          <Button
                            key={counterpartOption.id}
                            variant="text"
                            startIcon={<AddIcon />}
                            fullWidth
                            sx={{
                              justifyContent: 'flex-start',
                              px: 2,
                            }}
                            onClick={handleCreateNewCounterpart}
                          >
                            {counterpartOption.label}
                          </Button>
                        ) : (
                          <li {...props}>{counterpartOption.label}</li>
                        )
                      }
                    />
                  );
                }}
              />
            </Grid>
            <Grid item {...customerGridItemProps}>
              <TextField
                disabled
                fullWidth
                variant="outlined"
                label={t(i18n)`Contact person`}
                value={defaultContactName}
                InputProps={{
                  startAdornment: isContactPersonsLoading ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
              />
              <Collapse in={Boolean(contactPersonError)}>
                <FormHelperText>{contactPersonError?.message}</FormHelperText>
              </Collapse>
              <Collapse
                in={
                  !Boolean(contactPersonError) &&
                  !isContactPersonsLoading &&
                  counterpartContacts?.length === 0
                }
              >
                <FormHelperText>
                  {t(i18n)`No contact persons available`}
                </FormHelperText>
              </Collapse>
            </Grid>
            <Grid item {...customerGridItemProps}>
              <Controller
                name="counterpart_vat_id_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={
                      isCounterpartVatsLoading ||
                      !counterpartVats ||
                      counterpartVats.length === 0 ||
                      disabled
                    }
                    error={Boolean(error)}
                  >
                    <InputLabel htmlFor={field.name}>{t(
                      i18n
                    )`VAT ID`}</InputLabel>
                    <Select
                      labelId={field.name}
                      label={t(i18n)`VAT ID`}
                      MenuProps={{ container: root }}
                      startAdornment={
                        isCounterpartVatsLoading ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                      {...field}
                    >
                      {counterpartVats?.map((counterpartVat) => (
                        <MenuItem
                          key={counterpartVat.id}
                          value={counterpartVat.id}
                        >
                          <CountryInvoiceOption code={counterpartVat.country} />
                          {counterpartVat.value}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item {...customerGridItemProps}>
              <TextField
                disabled
                fullWidth
                variant="outlined"
                label={t(i18n)`TAX ID`}
                value={counterpart?.tax_id ?? ''}
                InputProps={{
                  startAdornment: isCounterpartLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: 'nowrap',
                          mr: 1,
                        }}
                      >
                        {t(i18n)`TAX ID`}
                      </Typography>
                    </>
                  ),
                }}
              />
              <Collapse
                in={counterpart && !counterpart.tax_id && !isCounterpartLoading}
              >
                <FormHelperText>{t(i18n)`No TAX ID available`}</FormHelperText>
              </Collapse>
            </Grid>
            <Grid item {...customerGridItemProps}>
              <Controller
                name="default_billing_address_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    required
                    disabled
                    error={Boolean(error)}
                  >
                    <InputLabel id={field.name}>{t(
                      i18n
                    )`Billing address`}</InputLabel>
                    <Select
                      labelId={field.name}
                      label={t(i18n)`Billing address`}
                      MenuProps={{ container: root }}
                      startAdornment={
                        isCounterpartAddressesLoading ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                      {...field}
                    >
                      <MenuItem value={counterpartBillingAddress?.id}>
                        <CounterpartAddressView
                          address={counterpartBillingAddress}
                        />
                      </MenuItem>
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item {...customerGridItemProps}>
              <Controller
                name="default_shipping_address_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={Boolean(error)}
                    disabled={
                      isCounterpartAddressesLoading ||
                      !counterpartId ||
                      disabled
                    }
                  >
                    <InputLabel htmlFor={field.name}>{t(
                      i18n
                    )`Shipping address`}</InputLabel>
                    <Select
                      {...field}
                      id={field.name}
                      labelId={field.name}
                      MenuProps={{ container: root }}
                      label={t(i18n)`Shipping address`}
                      startAdornment={
                        isCounterpartAddressesLoading ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                      endAdornment={
                        <IconButton
                          sx={{
                            visibility: field.value ? 'visible' : 'hidden ',
                            mr: 2,
                          }}
                          size="small"
                          onClick={() => {
                            /** On click, we want to clear this field state */
                            resetField(field.name);
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      {counterpartAddresses?.map((shippingAddress) => (
                        <MenuItem
                          key={shippingAddress.id}
                          value={shippingAddress.id}
                        >
                          <CounterpartAddressView address={shippingAddress} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
