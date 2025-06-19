import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  CounterpartIndividualForm,
  CounterpartOrganizationForm,
} from '@/components/counterparts/CounterpartDetails/CounterpartForm';
import {
  prepareAddressView,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { CounterpartSelector } from '@/components/receivables/components/CounterpartSelector';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCounterpartAddresses,
  useCounterpartById,
  useCounterpartContactList,
  useCounterpartVatList,
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
} from '@mui/material';

import { CreateReceivablesFormProps } from '../InvoiceDetails/CreateReceivable/validation';

type FormValues = {
  billingAddressId: string;
  shippingAddressId: string;
};

export interface EditCounterpartModalProps {
  disabled: boolean;
  initialCounterpartId: string;
  initialBillingAddressId: string;
  initialShippingAddressId?: string;
  open: boolean;
  onClose: () => void;
}

export const EditCounterpartModal = ({
  initialCounterpartId,
  initialBillingAddressId,
  initialShippingAddressId,
  disabled,
  open,
  onClose,
}: EditCounterpartModalProps) => {
  const { i18n } = useLingui();
  const { control, setValue } = useFormContext<CreateReceivablesFormProps>();
  const { root } = useRootElements();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentCounterpartId, setCurrentCounterpartId] =
    useState(initialCounterpartId);
  const [formValues, setFormValues] = useState<FormValues>({
    billingAddressId: '',
    shippingAddressId: '',
  });
  const [isDirty, setIsDirty] = useState(false);

  const { data: counterpart } = useCounterpartById(currentCounterpartId);
  const { data: contacts } = useCounterpartContactList(currentCounterpartId);
  const { data: counterpartAddresses, isLoading: isAddressesLoading } =
    useCounterpartAddresses(currentCounterpartId);
  const { data: counterpartVats } = useCounterpartVatList(currentCounterpartId);
  const currentBillingAddress = counterpartAddresses?.data.find(
    (address) => address?.id === formValues.billingAddressId
  );

  const defaultContact = contacts?.find((c) => c.is_default);

  const isAddressFormDisabled = isAddressesLoading || !currentCounterpartId;

  const handleUpdate = () => {
    onClose();
    setIsEditMode(false);
  };

  const handleSaveChanges = () => {
    onClose();
    setIsDirty(false);
    setValue('counterpart_id', currentCounterpartId);
    setValue('default_billing_address_id', formValues.billingAddressId);
    setValue('default_shipping_address_id', formValues.shippingAddressId);
  };

  const isOrganization = counterpart && isOrganizationCounterpart(counterpart);

  useEffect(() => {
    if (!counterpartAddresses?.data?.length) return;

    setFormValues(() => {
      const isInitialBillingAddressValid = counterpartAddresses.data.find(
        (address) => address.id === initialBillingAddressId
      );
      const isInitialShippingAddressValid = counterpartAddresses.data.find(
        (address) => address.id === initialShippingAddressId
      );

      const billingAddressId =
        (isInitialBillingAddressValid && initialBillingAddressId) ||
        counterpart?.default_billing_address_id ||
        counterpartAddresses.data[0].id ||
        '';
      const shippingAddressId =
        (isInitialShippingAddressValid && initialShippingAddressId) ||
        counterpart?.default_shipping_address_id ||
        '';

      return {
        billingAddressId,
        shippingAddressId,
      };
    });
  }, [
    counterpartAddresses,
    counterpart,
    initialShippingAddressId,
    initialBillingAddressId,
  ]);

  return (
    <Modal open={open} container={root}>
      <Box
        sx={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
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
                : t(i18n)`View customer's details`}
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
              id={currentCounterpartId}
              onCancel={() => setIsEditMode(false)}
              onUpdate={handleUpdate}
              isInvoiceCreation
              showCategories={false}
            />
          ) : (
            <CounterpartIndividualForm
              id={currentCounterpartId}
              onCancel={() => setIsEditMode(false)}
              onUpdate={handleUpdate}
              isInvoiceCreation
              showCategories={false}
            />
          )
        ) : (
          <>
            <Stack sx={{ padding: '2rem' }}>
              <CounterpartSelector
                isSimplified
                counterpartAddresses={counterpartAddresses}
                shouldDisableFormUpdate
                currentCounterpartId={currentCounterpartId}
                handleUpdateCounterpartId={(value) => {
                  setIsDirty(true);
                  setCurrentCounterpartId(value ?? '');
                }}
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
                render={({ field, fieldState: { error } }) =>
                  (counterpartAddresses &&
                    counterpartAddresses?.data?.length > 1) ||
                  isAddressesLoading ? (
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
                        value={formValues.billingAddressId}
                        onChange={(event) => {
                          setIsDirty(true);
                          setFormValues((prevState) => ({
                            ...prevState,
                            billingAddressId: event.target.value
                              ? event.target.value
                              : '',
                          }));
                        }}
                        labelId={field.name}
                        label={t(i18n)`Billing address`}
                        IconComponent={() => (
                          <KeyboardArrowDown fontSize="small" />
                        )}
                        MenuProps={{ container: root }}
                        startAdornment={
                          isAddressesLoading ? (
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
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  ) : (
                    <TextField
                      {...field}
                      value={prepareAddressView({
                        address: currentBillingAddress,
                      })}
                      id={field.name}
                      label={t(i18n)`Billing address`}
                      required
                      variant="standard"
                      fullWidth
                      disabled
                      error={Boolean(error)}
                      helperText={error?.message}
                    />
                  )
                }
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
                    <InputLabel htmlFor={field.name}>
                      {t(i18n)`Shipping address`}
                    </InputLabel>
                    <Select
                      {...field}
                      id={field.name}
                      value={formValues.shippingAddressId}
                      onChange={(event) => {
                        setIsDirty(true);
                        setFormValues((prevState) => ({
                          ...prevState,
                          shippingAddressId: event.target.value
                            ? event.target.value
                            : '',
                        }));
                      }}
                      labelId={field.name}
                      MenuProps={{ container: root }}
                      label={t(i18n)`Shipping address`}
                      IconComponent={() => (
                        <KeyboardArrowDown fontSize="small" />
                      )}
                      startAdornment={
                        isAddressesLoading ? (
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
                              setIsDirty(true);
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
            </Stack>
            <Grid
              container
              alignItems="center"
              p={4}
              sx={{ borderTop: 'solid 1px rgba(0, 0, 0, 0.13)' }}
            >
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditMode(true)}
                >{t(i18n)`Edit profile`}</Button>
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
                <Button
                  variant="text"
                  onClick={() => {
                    setIsDirty(false);
                    onClose();
                  }}
                >
                  {t(i18n)`${isDirty ? 'Cancel' : 'Close'}`}
                </Button>
                {isDirty && (
                  <Button
                    variant="contained"
                    disabled={disabled}
                    onClick={handleSaveChanges}
                  >
                    {t(i18n)`Save`}
                  </Button>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Modal>
  );
};
