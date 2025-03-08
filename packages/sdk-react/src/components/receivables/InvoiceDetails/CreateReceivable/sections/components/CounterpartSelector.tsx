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

import { CreateReceivablesFormProps } from '../../validation';

interface CounterpartsAutocompleteOptionProps {
  id: string;
  label: string;
}

type CounterpartSelectorProps = {
  disabled?: boolean;
  counterpartAddresses: components['schemas']['package__receivables__v2024_05_25__receivables__ReceivablesRepresentationOfCounterpartAddress'][];
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

export const CounterpartSelector = ({
  setIsCreateCounterpartOpened,
  setIsEditCounterpartOpened,
  isSimplified = false,
  disabled,
  counterpartAddresses,
}: CounterpartSelectorProps) => {
  const { i18n } = useLingui();

  const { root } = useRootElements();
  const { control, watch } = useFormContext<CreateReceivablesFormProps>();
  const { data: counterparts, isLoading: isCounterpartsLoading } =
    useCounterpartList({ query: { is_customer: true } });
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
  const [address, setAddress] = useState('');

  const [isFocused, setIsFocused] = useState(false);

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

  const counterpartId = watch('counterpart_id');

  useEffect(() => {
    const selectedCounterpart = counterparts?.data.find(
      (counterpart) => counterpart.id === counterpartId
    );
    if (selectedCounterpart) {
      setAddress(
        prepareAddressView({ address: counterpartAddresses?.data[0] })
      );
    } else {
      setAddress('');
    }
  }, [counterpartId, counterparts, counterpartAddresses]);

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
          <>
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

                !isSimplified &&
                  filtered.unshift({
                    id: COUNTERPART_CREATE_NEW_ID,
                    label: t(i18n)`Create new counterpart`,
                  });

                if (!isSimplified && params.inputValue.length) {
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
                              {t(i18n)`Edit`}
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
                            <IconButton onClick={() => field.onChange(null)}>
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
};
