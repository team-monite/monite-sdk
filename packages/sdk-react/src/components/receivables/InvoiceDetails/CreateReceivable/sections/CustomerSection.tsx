import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { components } from '@/api';
import {
  CounterpartIndividualForm,
  CounterpartOrganizationForm,
} from '@/components/counterparts/CounterpartDetails/CounterpartForm';
import {
  getCounterpartName,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import { CountryInvoiceOption } from '@/components/receivables/InvoiceDetails/CreateReceivable/components/CountryInvoiceOption';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCounterpartAddresses,
  useCounterpartContactList,
  useCounterpartList,
} from '@/core/queries';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { AccountCircle } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { CreateReceivablesFormProps } from '../validation';
import { CreateCounterpartModal } from './components/CreateCounterpartModal';
import { SectionGeneralProps } from './Section.types';

interface CounterpartsAutocompleteOptionProps {
  id: string;
  label: string;
}

const filter = createFilterOptions<CounterpartsAutocompleteOptionProps>();

function prepareAddressView({
  address,
}: {
  address: components['schemas']['CounterpartAddressResponseWithCounterpartID'];
}) {
  if (address)
    return `${address.postal_code}, ${address.city}, ${address.line1}`;
  return '';
}

const COUNTERPART_CREATE_NEW_ID = '__create-new__';
const COUNTERPART_DIVIDER = '__divider__';

function isCreateNewCounterpartOption(
  counterpartOption: CounterpartsAutocompleteOptionProps | undefined | null
): boolean {
  return counterpartOption?.id === COUNTERPART_CREATE_NEW_ID;
}

function isDividerOption(
  counterpartOption: CounterpartsAutocompleteOptionProps | undefined | null
): boolean {
  return counterpartOption?.id === COUNTERPART_DIVIDER;
}

export const CustomerSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control, watch, setValue } =
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
  const [isCreateCounterpartOpened, setIsCreateCounterpartOpened] =
    useState<boolean>(false);
  const [isEditCounterpartOpened, setIsEditCounterpartOpened] =
    useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

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

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isOrganization = counterpart && isOrganizationCounterpart(counterpart);
  //const handleEditSubmit = () => console.log;

  return (
    <Stack spacing={2} className={className}>
      <CreateCounterpartDialog
        open={false}
        onClose={() => {
          setIsCreateCounterpartOpened(false);
        }}
        onCreate={(newCounterpartId: string) => {
          setValue('counterpart_id', newCounterpartId);
        }}
      />

      <Modal
        open={isCreateCounterpartOpened}
        onClose={() => setIsCreateCounterpartOpened(false)}
        container={root}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <p>Add new customer</p>
        </Box>
      </Modal>

      <CounterpartSelector
        setIsCreateCounterpartOpened={setIsCreateCounterpartOpened}
        setIsEditCounterpartOpened={setIsEditCounterpartOpened}
        disabled={disabled}
        counterpartAddresses={counterpartAddresses}
      />

      {
        //everything here should be part of "Edit customer" new modal
        counterpartId && (
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
                  <InputLabel htmlFor={field.name}>{t(
                    i18n
                  )`VAT ID`}</InputLabel>
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
                  in={
                    counterpart && !counterpart.tax_id && !isCounterpartLoading
                  }
                >
                  <FormHelperText>{t(
                    i18n
                  )`No TAX ID available`}</FormHelperText>
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
        )
      }
    </Stack>
  );
};

const CounterpartSelector = ({
  setIsCreateCounterpartOpened,
  disabled,
}: {
  setIsCreateCounterpartOpened: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}) => {
  const { i18n } = useLingui();

  const { root } = useRootElements();
  const { control } = useFormContext<CreateReceivablesFormProps>();
  const { data: counterparts, isLoading: isCounterpartsLoading } =
    useCounterpartList();
  const handleCreateNewCounterpart = useCallback(() => {
    setIsCreateCounterpartOpened(true);
  }, [setIsCreateCounterpartOpened]);

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

  return (
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
              if (
                isCreateNewCounterpartOption(value) ||
                isDividerOption(value)
              ) {
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
              const reverseFiltered = options.filter(
                (option) =>
                  !filtered.some(
                    (filteredOption) => filteredOption.id === option.id
                  )
              );

              filtered.unshift({
                id: COUNTERPART_CREATE_NEW_ID,
                label: t(i18n)`Create new counterpart`,
              });

              if (params.inputValue.length) {
                filtered.push({
                  id: COUNTERPART_DIVIDER,
                  label: '-',
                });
              }
              return [...filtered, ...reverseFiltered];
            }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={t(i18n)`Customer`}
                  placeholder={t(i18n)`Select customer`}
                  required
                  error={Boolean(error)}
                  helperText={error?.message}
                  className="Monite-CounterpartSelector"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: isCounterpartsLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <InputAdornment
                        sx={{
                          width: '44px',
                          height: '44px',
                          maxHeight: '44px',

                          justifyContent: 'center',
                          backgroundColor: selectedCounterpartOption
                            ? 'rgba(203, 203, 254, 1)'
                            : 'rgba(235, 235, 255, 1)',
                          borderRadius: '50%',
                        }}
                        position="start"
                      >
                        <Typography variant="caption">
                          {selectedCounterpartOption
                            ? Array.from(
                                selectedCounterpartOption.label
                              )[0].toUpperCase()
                            : '+'}
                        </Typography>
                      </InputAdornment>
                    ),
                    endAdornment: (() => {
                      if (
                        selectedCounterpartOption &&
                        !params.inputProps['aria-expanded']
                      ) {
                        return <Button>Edit</Button>;
                      }
                      if (
                        selectedCounterpartOption &&
                        params.inputProps['aria-expanded']
                      ) {
                        return (
                          <IconButton onClick={() => field.onChange(null)}>
                            <ClearIcon sx={{ width: '1rem', height: '1rem' }} />
                          </IconButton>
                        );
                      }
                      return null;
                    })(),
                  }}
                />
              );
            }}
            loading={isCounterpartsLoading || disabled}
            options={counterpartsAutocompleteData}
            getOptionLabel={(counterpartOption) =>
              isCreateNewCounterpartOption(counterpartOption) ||
              isDividerOption(counterpartOption)
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
              ) : counterpartOption.id === COUNTERPART_DIVIDER ? (
                <Divider
                  key={counterpartOption.id}
                  sx={{ padding: '8px', marginBottom: '16px' }}
                />
              ) : (
                <li {...props} key={counterpartOption.id}>
                  {counterpartOption.label}
                </li>
              )
            }
          />
        );
      }}
    />
  );
};
