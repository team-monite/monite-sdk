import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import {
  CounterpartIndividualForm,
  CounterpartOrganizationForm,
} from '@/components/counterparts/CounterpartDetails/CounterpartForm';
import {
  prepareAddressView,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { CountryInvoiceOption } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/CountryInvoiceOption';
import { CounterpartSelector } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CounterpartSelector';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCounterpartAddresses,
  useCounterpartContactList,
} from '@/core/queries';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { KeyboardArrowDown } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { CreateReceivablesFormProps } from '../../validation';
import { SectionGeneralProps } from '../Section.types';
import { useDefaultCounterpartValues } from './useDefaultCounterpartValues';

export interface EditCounterpartModalProps extends SectionGeneralProps {
  counterpart: components['schemas']['CounterpartResponse'] | undefined;
  counterpartVats:
    | {
        data: components['schemas']['CounterpartVatIDResponse'][];
      }
    | undefined;
  isCounterpartLoading: boolean;
  isCounterpartVatsLoading: boolean;
  open: boolean;
  onClose: () => void;
}

export const EditCounterpartModal = ({
  counterpart,
  counterpartVats,
  isCounterpartLoading,
  isCounterpartVatsLoading,
  disabled,
  open,
  onClose,
}: EditCounterpartModalProps) => {
  const { i18n } = useLingui();
  const { control, setValue, watch } =
    useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();

  const counterpartId = watch('counterpart_id');

  const { data: contacts } = useCounterpartContactList(counterpartId);
  const defaultContact = contacts?.find((c) => c.is_default);
  const {
    data: counterpartAddresses,
    isLoading: _isCounterpartAddressesLoading,
  } = useCounterpartAddresses(counterpartId);
  // _isCounterpartAddressesLoading will be true if counterpartId isn't set
  const isCounterpartAddressesLoading =
    counterpartId && _isCounterpartAddressesLoading;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

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

  useDefaultCounterpartValues({
    counterpartAddresses,
    counterpartVats,
  });

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isOrganization = counterpart && isOrganizationCounterpart(counterpart);

  return (
    <Modal open={open} container={root}>
      <Box
        sx={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: isLargeScreen ? 600 : 480,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 8,
        }}
      >
        <Grid container alignItems="center" p={4}>
          <Grid item xs={11}>
            <Typography variant="h3">
              {isEditMode
                ? t(i18n)`Edit customer's profile`
                : t(i18n)`Edit customer`}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconWrapper
              aria-label={t(i18n)`Edit Customer Close`}
              onClick={onClose}
              color="inherit"
            >
              <CloseIcon />
            </IconWrapper>
          </Grid>
        </Grid>
        {isEditMode ? (
          counterpart && isOrganizationCounterpart(counterpart) ? (
            <CounterpartOrganizationForm
              id={counterpartId}
              onCancel={() => setIsEditMode(false)}
              isInvoiceCreation={true}
              showCategories={false} //when to show or hide categories?
            />
          ) : (
            <CounterpartIndividualForm
              id={counterpartId}
              onCancel={() => setIsEditMode(false)}
              isInvoiceCreation={true}
              showCategories={false} //when to show or hide categories?
            />
          )
        ) : (
          <>
            <Stack
              sx={{
                padding: '0 2rem',
                maxHeight: isLargeScreen ? 480 : 380,
                overflowY: 'auto',
              }}
            >
              <CounterpartSelector
                isSimplified
                disabled={disabled}
                counterpartAddresses={counterpartAddresses}
              />
              <List
                sx={{
                  marginBottom: '2rem',
                  '& .MuiListItem-root': {
                    padding: '.25rem .5rem .25rem 0',
                    fontWeight: '400',
                    '& span': {
                      color: 'rgba(112, 112, 112, 1)',
                      minWidth: '144px',
                      paddingRight: '1rem',
                    },
                  },
                }}
              >
                {isOrganization && counterpart?.organization.email && (
                  <ListItem>
                    <span>{t(i18n)`Email`}</span>{' '}
                    {counterpart.organization.email}
                  </ListItem>
                )}{' '}
                {!isOrganization && counterpart?.individual.email && (
                  <ListItem>
                    <span>{t(i18n)`Email`}</span> {counterpart.individual.email}
                  </ListItem>
                )}
                {isOrganization && counterpart?.organization.phone && (
                  <ListItem>
                    <span>{t(i18n)`Phone Number`}</span>{' '}
                    {counterpart.organization.phone}
                  </ListItem>
                )}{' '}
                {!isOrganization && counterpart?.individual.phone && (
                  <ListItem>
                    <span>{t(i18n)`Phone Number`}</span>{' '}
                    {counterpart.individual.phone}
                  </ListItem>
                )}
                {defaultContact && (
                  <ListItem>
                    <span>{t(i18n)`Contact person`}</span>{' '}
                    {defaultContact?.first_name} {defaultContact?.last_name}
                  </ListItem>
                )}
                {counterpart?.tax_id && (
                  <ListItem>
                    <span>{t(i18n)`TAX ID`}</span> {counterpart?.tax_id}
                  </ListItem>
                )}
                {counterpartVats?.data[0]?.value && (
                  <ListItem>
                    <span>{t(i18n)`VAT ID`}</span>{' '}
                    {counterpartVats.data[0].value}
                  </ListItem>
                )}
              </List>

              <Controller
                name="default_billing_address_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    variant="standard"
                    sx={{ marginBottom: '1rem' }}
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
                      IconComponent={() => (
                        <KeyboardArrowDown fontSize="small" />
                      )}
                      MenuProps={{ container: root }}
                      startAdornment={
                        isCounterpartAddressesLoading ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                    >
                      {counterpartAddresses?.data.map((address) => (
                        <MenuItem key={address.id} value={address.id}>
                          {prepareAddressView({ address })}
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
                    variant="standard"
                    sx={{ marginBottom: '1rem' }}
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
                      IconComponent={() => (
                        <KeyboardArrowDown fontSize="small" />
                      )}
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
                          {prepareAddressView({ address })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {isEditMode && (
                <>
                  <Controller
                    name="counterpart_vat_id_id"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl
                        variant="standard"
                        sx={{ marginBottom: '1rem' }}
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
                        <InputLabel htmlFor={field.name}>{t(
                          i18n
                        )`VAT ID`}</InputLabel>
                        <Select
                          {...field}
                          labelId={field.name}
                          label={t(i18n)`VAT ID`}
                          IconComponent={() => (
                            <KeyboardArrowDown fontSize="small" />
                          )}
                          MenuProps={{ container: root }}
                          startAdornment={
                            isCounterpartVatsLoading ? (
                              <CircularProgress size={20} />
                            ) : null
                          }
                        >
                          {counterpartVats?.data?.map(
                            ({ id, country, value }) => (
                              <MenuItem key={id} value={id}>
                                {country && (
                                  <CountryInvoiceOption code={country} />
                                )}
                                {value}
                              </MenuItem>
                            )
                          )}
                        </Select>
                        {error && (
                          <FormHelperText>{error.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                  <Box mb={isHiddenForUS ? 0 : 1}>
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
                        in={
                          counterpart &&
                          !counterpart.tax_id &&
                          !isCounterpartLoading
                        }
                      >
                        <FormHelperText>{t(
                          i18n
                        )`No TAX ID available`}</FormHelperText>
                      </Collapse>
                    )}
                  </Box>
                </>
              )}
            </Stack>
            <Grid
              container
              alignItems="center"
              p={4}
              sx={{ borderTop: 'solid 1px rgba(0, 0, 0, 0.13)' }}
            >
              <Grid item xs={6}>
                {!isEditMode && (
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditMode(true)}
                  >{t(i18n)`Edit profile`}</Button>
                )}
              </Grid>
              <Grid
                item
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                }}
                xs={6}
              >
                <Button variant="text" onClick={onClose}>
                  {t(i18n)`Cancel`}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setIsEditMode(false)}
                >
                  {t(i18n)`Save`}
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Modal>
  );
};
