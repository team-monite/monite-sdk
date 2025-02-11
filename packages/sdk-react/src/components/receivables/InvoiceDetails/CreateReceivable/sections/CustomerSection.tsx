import { Controller, useFormContext } from 'react-hook-form';
import { usePrevious } from 'react-use';

import { components } from '@/api';
import { getIndividualName } from '@/components/counterparts/helpers';
import { CountryInvoiceOption } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/CountryInvoiceOption';
import { CounterpartAutocompleteWithCreate } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CounterpartAutocompleteWithCreate';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCounterpartAddresses,
  useCounterpartById,
  useCounterpartContactList,
  useCounterpartVatList,
} from '@/core/queries';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
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
    isLoading: _isCounterpartAddressesLoading,
  } = useCounterpartAddresses(counterpartId);
  // _isCounterpartAddressesLoading will be true if counterpartId isn't set
  const isCounterpartAddressesLoading =
    counterpartId && _isCounterpartAddressesLoading;

  const defaultContactName = counterpartContacts?.find(
    (contact) => contact.is_default
  );

  const contactPersonDisplayableError =
    usePrevious(contactPersonError) ?? contactPersonError;

  const className = 'Monite-CreateReceivable-CustomerSection';

  return (
    <Stack spacing={2} className={className}>
      <CounterpartAutocompleteWithCreate
        disabled={disabled}
        name="counterpart_id"
        label="Customer"
      />
      {counterpartId && (
        <>
          <Box>
            <TextField
              disabled
              fullWidth
              variant="outlined"
              label={t(i18n)`Contact person`}
              value={
                defaultContactName ? getIndividualName(defaultContactName) : ''
              }
              InputProps={{
                startAdornment:
                  counterpartId && isContactPersonsLoading ? (
                    <CircularProgress size={20} />
                  ) : null,
              }}
            />
            <Collapse in={Boolean(contactPersonError)}>
              <FormHelperText>
                {contactPersonDisplayableError &&
                  getAPIErrorMessage(i18n, contactPersonDisplayableError)}
              </FormHelperText>
            </Collapse>
            <Collapse
              in={
                !contactPersonError &&
                !isContactPersonsLoading &&
                counterpartContacts?.length === 0
              }
            >
              <FormHelperText>{t(
                i18n
              )`No contact persons available`}</FormHelperText>
            </Collapse>
          </Box>
          <Controller
            name="counterpart_vat_id_id"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                variant="outlined"
                fullWidth
                disabled={
                  isCounterpartVatsLoading ||
                  !counterpartVats?.data ||
                  counterpartVats?.data.length === 0 ||
                  disabled
                }
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
          </Box>
          <Controller
            name="default_billing_address_id"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                variant="outlined"
                fullWidth
                required
                error={Boolean(error)}
                disabled={
                  isCounterpartAddressesLoading || !counterpartId || disabled
                }
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
          <Controller
            name="default_shipping_address_id"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                variant="outlined"
                fullWidth
                error={Boolean(error)}
                disabled={
                  isCounterpartAddressesLoading || !counterpartId || disabled
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
                      onClick={(event) => {
                        event.preventDefault();
                        setValue('default_shipping_address_id', '');
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
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
        </>
      )}
    </Stack>
  );
};
