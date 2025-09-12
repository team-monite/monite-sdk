import { CreatePurchaseOrderFormProps } from '../validation';
import { components } from '@/api';
import {
  getCounterpartName,
  prepareAddressView,
} from '@/components/counterparts/helpers';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCounterpartList } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { KeyboardArrowDown } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material';
import {
  memo,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface CounterpartsAutocompleteOptionProps {
  id: string;
  label: string;
}

type VendorSelectorProps = {
  disabled?: boolean;
  shouldDisableFormUpdate?: boolean;
  currentCounterpartId?: string;
  handleUpdateCounterpartId?: (value?: string) => void;
  counterpartAddresses?: components['schemas']['CounterpartAddressResourceList'];
} & (
  | {
      isSimplified: true;
      setIsCreateCounterpartOpened?: never;
      setIsEditCounterpartOpened?: never;
    }
  | {
      isSimplified?: false;
      setIsCreateCounterpartOpened: Dispatch<SetStateAction<boolean>>;
      setIsEditCounterpartOpened: Dispatch<SetStateAction<boolean>>;
    }
);

const filter = createFilterOptions<CounterpartsAutocompleteOptionProps>();

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

export const VendorSelector = memo(
  ({
    setIsCreateCounterpartOpened,
    setIsEditCounterpartOpened,
    isSimplified = false,
    shouldDisableFormUpdate = false,
    disabled,
    counterpartAddresses,
    currentCounterpartId,
    handleUpdateCounterpartId,
  }: VendorSelectorProps) => {
    const { i18n } = useLingui();

    const { root } = useRootElements();
    const { control, watch } = useFormContext<CreatePurchaseOrderFormProps>();
    const { data: counterparts, isLoading: isCounterpartsLoading } =
      useCounterpartList({ query: { is_vendor: true } });
    const handleCreateNewCounterpart = useCallback(() => {
      if (!isSimplified && setIsCreateCounterpartOpened) {
        setIsCreateCounterpartOpened(true);
      }
    }, [isSimplified, setIsCreateCounterpartOpened]);

    const handleEditCounterpart = useCallback(() => {
      if (!isSimplified && setIsEditCounterpartOpened) {
        setIsEditCounterpartOpened(true);
      }
    }, [isSimplified, setIsEditCounterpartOpened]);

    const [isFocused, setIsFocused] = useState(false);

    const counterpartId = watch('counterpart_id');

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

    const selectedCounterpart = counterparts?.data.find(
      (counterpart) =>
        counterpart.id ===
        (shouldDisableFormUpdate ? currentCounterpartId : counterpartId)
    );

    const selectedCounterpartOption = useMemo(
      () =>
        selectedCounterpart
          ? {
              id: selectedCounterpart.id,
              label: getCounterpartName(selectedCounterpart),
            }
          : null,
      [selectedCounterpart]
    );

    const address = counterpartAddresses?.data?.[0]
      ? prepareAddressView({ address: counterpartAddresses?.data[0] })
      : '';

    // Optimize filterOptions function to prevent re-renders
    const handleFilterOptions = useCallback(
      (options: CounterpartsAutocompleteOptionProps[], params: any) => {
        const filtered = filter(options, params);

        !isSimplified &&
          filtered.unshift({
            id: COUNTERPART_CREATE_NEW_ID,
            label: t(i18n)`Create new vendor`,
          });

        if (!isSimplified && params.inputValue.length) {
          filtered.push({
            id: COUNTERPART_DIVIDER,
            label: '-',
          });

          const reverseFiltered = options.filter(
            (option) =>
              !filtered.some(
                (filteredOption) => filteredOption.id === option.id
              )
          );

          filtered.push(...reverseFiltered);
        }

        return filtered;
      },
      [isSimplified, i18n]
    );

    return (
      <Controller
        name="counterpart_id"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <>
              <Autocomplete
                {...field}
                value={selectedCounterpartOption}
                onChange={(_, value) => {
                  if (
                    isCreateNewCounterpartOption(value) ||
                    isDividerOption(value)
                  ) {
                    if (shouldDisableFormUpdate && handleUpdateCounterpartId) {
                      handleUpdateCounterpartId('');
                    } else {
                      field.onChange('');
                    }
                    return;
                  }
                  if (shouldDisableFormUpdate && handleUpdateCounterpartId) {
                    handleUpdateCounterpartId(value?.id ?? '');
                  } else {
                    field.onChange(value?.id ?? '');
                  }
                }}
                slotProps={{
                  popper: {
                    container: root,
                  },
                }}
                filterOptions={handleFilterOptions}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label={t(i18n)`Vendor`}
                      placeholder={t(i18n)`Select vendor`}
                      required
                      error={Boolean(error)}
                      helperText={error?.message}
                      className={`Monite-Selector ${
                        isSimplified ? 'isSimplified' : ''
                      }`}
                      InputProps={{
                        ...params.InputProps,
                        value: params.inputProps.value,
                        onFocus: () => setIsFocused(true),
                        onBlur: () => setIsFocused(false),
                        startAdornment: isCounterpartsLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          !isSimplified && (
                            <>
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
                              {!isFocused && (
                                <InputAdornment
                                  position="end"
                                  sx={{
                                    flexDirection: 'column',
                                    alignItems: 'baseline',
                                    height: 'auto',
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ color: 'rgba(41, 41, 41, 1)' }}
                                    fontWeight="bold"
                                  >
                                    {params.inputProps.value}
                                  </Typography>
                                  <Typography variant="body2">
                                    {address}
                                  </Typography>
                                </InputAdornment>
                              )}
                            </>
                          )
                        ),
                        endAdornment: (() => {
                          if (
                            !isSimplified &&
                            selectedCounterpartOption &&
                            !params.inputProps['aria-expanded']
                          ) {
                            return (
                              <Button onClick={handleEditCounterpart}>
                                {t(i18n)`View details`}
                              </Button>
                            );
                          }
                          if (
                            isSimplified &&
                            !params.inputProps['aria-expanded']
                          ) {
                            return <KeyboardArrowDown fontSize="small" />;
                          }
                          if (
                            selectedCounterpartOption &&
                            params.inputProps['aria-expanded']
                          ) {
                            return (
                              <IconButton onClick={() => field.onChange('')}>
                                <ClearIcon
                                  sx={{ width: '1rem', height: '1rem' }}
                                />
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
                      sx={{ padding: '.5rem', marginBottom: '1rem' }}
                    />
                  ) : (
                    <li {...props} key={counterpartOption.id}>
                      {counterpartOption.label}
                    </li>
                  )
                }
              />
            </>
          );
        }}
      />
    );
  }
);
