import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { CountryInvoiceOption } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/CountryInvoiceOption';
import { CounterpartAutocompleteWithCreate } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CounterpartAutocompleteWithCreate';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCounterpartAddresses,
  useCounterpartById,
  useCounterpartVatList,
} from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { CreateReceivablesFormProps } from '../validation';
import type { SectionGeneralProps } from './Section.types';

const CounterpartAddressView = ({
  address,
}: {
  address: components['schemas']['CounterpartAddressResponseWithCounterpartID'];
}) => (
  <>
    {address.postal_code}, {address.city}, {address.line1}
  </>
);

export const CustomerSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control, watch, setValue } =
    useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();

  const counterpartId = watch('counterpart_id');

  const { data: counterpartVats, isLoading: isCounterpartVatsLoading } =
    useCounterpartVatList(counterpartId);
  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const {
    data: counterpartAddresses,
    isLoading: _isCounterpartAddressesLoading,
  } = useCounterpartAddresses(counterpartId);
  // _isCounterpartAddressesLoading will be true if counterpartId isn't set
  const isCounterpartAddressesLoading =
    counterpartId && _isCounterpartAddressesLoading;

  const [isShippingAddressShown, setIsShippingAddressShown] =
    useState<boolean>(false);

  const className = 'Monite-CreateReceivable-CustomerSection';
  const isHiddenForUS =
    !_isCounterpartAddressesLoading &&
    Array.isArray(counterpartAddresses?.data) &&
    counterpartAddresses.data.length > 0 &&
    counterpartAddresses.data[0]?.country === 'US';
  const isAddressFormDisabled =
    isCounterpartAddressesLoading ||
    !counterpartId ||
    disabled ||
    counterpartAddresses?.data.length === 1;

  useEffect(() => {
    if (counterpartAddresses && counterpartAddresses.data.length === 1) {
      setValue('default_shipping_address_id', counterpartAddresses.data[0].id);
      setValue('default_billing_address_id', counterpartAddresses.data[0].id);
    }
  }, [counterpartAddresses, setValue]);

  useEffect(() => {
    if (counterpartVats && counterpartVats.data.length === 1) {
      setValue('counterpart_vat_id_id', counterpartVats.data[0].id);
    }
  }, [counterpartVats, setValue]);

  return (
    <Stack spacing={2} className={className}>
      <CounterpartAutocompleteWithCreate
        disabled={disabled}
        name="counterpart_id"
        label={t(i18n)`Customer`}
      />
      {counterpartId && (
        <>
          <Controller
            name="counterpart_vat_id_id"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                variant="standard"
                fullWidth
                disabled={
                  isCounterpartVatsLoading ||
                  !counterpartVats?.data ||
                  counterpartVats?.data.length < 2 ||
                  disabled
                }
                hidden={isHiddenForUS}
                error={Boolean(error)}
              >
                <InputLabel htmlFor={field.name}>{t(i18n)`VAT ID`}</InputLabel>
                <Select
                  {...field}
                  labelId={field.name}
                  label={t(i18n)`VAT ID`}
                  MenuProps={{ container: root }}
                  startAdornment={
                    isCounterpartVatsLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                >
                  {counterpartVats?.data?.map(({ id, country, value }) => (
                    <MenuItem key={id} value={id}>
                      {country && <CountryInvoiceOption code={country} />}
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Box>
            <TextField
              disabled
              fullWidth
              variant="standard"
              label={t(i18n)`TAX ID`}
              value={counterpart?.tax_id ?? ''}
              hidden={isHiddenForUS}
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
                        ml: '14px',
                      }}
                    >
                      {t(i18n)`TAX ID`}
                    </Typography>
                  </>
                ),
              }}
            />
            {!isHiddenForUS && (
              <Collapse
                in={counterpart && !counterpart.tax_id && !isCounterpartLoading}
              >
                <FormHelperText>{t(i18n)`No TAX ID available`}</FormHelperText>
              </Collapse>
            )}
          </Box>
          <Controller
            name="default_billing_address_id"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                variant="standard"
                fullWidth
                required
                error={Boolean(error)}
                disabled={isAddressFormDisabled}
              >
                <InputLabel id={field.name}>{t(
                  i18n
                )`Billing address`}</InputLabel>
                <Select
                  {...field}
                  labelId={field.name}
                  label={t(i18n)`Billing address`}
                  MenuProps={{ container: root }}
                  startAdornment={
                    isCounterpartAddressesLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                >
                  {counterpartAddresses?.data.map((address) => (
                    <MenuItem key={address.id} value={address.id}>
                      <CounterpartAddressView address={address} />
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          {!isShippingAddressShown && (
            <Button
              sx={{ alignSelf: 'baseline' }}
              startIcon={<AddIcon />}
              onClick={() => setIsShippingAddressShown(true)}
            >
              {t(i18n)`Shipping address`}
            </Button>
          )}
          {isShippingAddressShown && (
            <Controller
              name="default_shipping_address_id"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  variant="standard"
                  fullWidth
                  error={Boolean(error)}
                  disabled={isAddressFormDisabled}
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
                      counterpartAddresses &&
                      counterpartAddresses?.data.length > 1 && (
                        <IconButton
                          sx={{
                            visibility: field.value ? 'visible' : 'hidden ',
                            mr: 2,
                          }}
                          size="small"
                          onClick={(event) => {
                            event.preventDefault();
                            setValue('default_shipping_address_id', '');
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    {counterpartAddresses?.data.map((address) => (
                      <MenuItem key={address.id} value={address.id}>
                        <CounterpartAddressView address={address} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          )}
        </>
      )}
    </Stack>
  );
};
