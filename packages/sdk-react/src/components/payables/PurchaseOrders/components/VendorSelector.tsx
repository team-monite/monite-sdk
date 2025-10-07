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
  createFilterOptions,
  type FilterOptionsState,
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
    const [open, setOpen] = useState(false);

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

    const handleFilterOptions = useCallback(
      (options: CounterpartsAutocompleteOptionProps[], params: FilterOptionsState<CounterpartsAutocompleteOptionProps>) => {
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
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onChange={(_, value) => {
                  if (
                    isCreateNewCounterpartOption(value) ||
                    isDividerOption(value)
                  ) {
                    if (isCreateNewCounterpartOption(value)) {
                      handleCreateNewCounterpart();
                    }
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
                                <span className="mtw:text-xs mtw:font-semibold mtw:text-[#292929]">
                                  {selectedCounterpartOption
                                    ? Array.from(
                                        selectedCounterpartOption.label
                                      )[0].toUpperCase()
                                    : '+'}
                                </span>
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
                                  <span className="mtw:text-sm mtw:font-semibold mtw:text-[#292929]">
                                    {params.inputProps.value}
                                  </span>
                                  <span className="mtw:text-xs mtw:text-muted-foreground">
                                    {address}
                                  </span>
                                </InputAdornment>
                              )}
                            </>
                          )
                        ),
                        endAdornment: (() => {
                          if (
                            !isSimplified &&
                            selectedCounterpartOption &&
                            !open
                          ) {
                            return (
                              <Button onClick={handleEditCounterpart}>
                                {t(i18n)`View details`}
                              </Button>
                            );
                          }
                          if (isSimplified && !open) {
                            return <KeyboardArrowDown fontSize="small" />;
                          }
                          if (selectedCounterpartOption && open) {
                            return (
                              <IconButton
                                onClick={() => {
                                  if (
                                    shouldDisableFormUpdate &&
                                    handleUpdateCounterpartId
                                  ) {
                                    handleUpdateCounterpartId('');
                                  } else {
                                    field.onChange('');
                                  }
                                }}
                              >
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
                renderOption={(props, counterpartOption) => {
                  if (isCreateNewCounterpartOption(counterpartOption)) {
                    return (
                      <li {...props} key={counterpartOption.id}>
                        <AddIcon sx={{ mr: 1 }} />
                        {counterpartOption.label}
                      </li>
                    );
                  }
                  if (isDividerOption(counterpartOption)) {
                    return (
                      <li
                        {...props}
                        key={counterpartOption.id}
                        role="presentation"
                        aria-hidden="true"
                        style={{ pointerEvents: 'none' }}
                      >
                        <Divider sx={{ p: '.5rem', mb: '1rem' }} />
                      </li>
                    );
                  }
                  return (
                    <li {...props} key={counterpartOption.id}>
                      {counterpartOption.label}
                    </li>
                  );
                }}
              />
            </>
          );
        }}
      />
    );
  }
);
