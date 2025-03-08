import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';

import { components } from '@/api';
import {
  CreateReceivablesProductsFormProps,
  getCreateInvoiceProductsValidationSchema,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
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
  TextField,
} from '@mui/material';

interface CounterpartsAutocompleteOptionProps {
  id: string;
  label: string;
  price?: {
    currency: components['schemas']['CurrencyEnum'];
    value: number;
  };
  smallestAmount?: number;
  measureUnit?: any;
  fieldName?: string;
  currency?: any;
}

type CounterpartSelectorProps = {
  disabled?: boolean;
  counterpartAddresses: any;
  setIsCreateCounterpartOpened: Dispatch<SetStateAction<boolean>>;
  setIsEditCounterpartOpened: Dispatch<SetStateAction<boolean>>;
};

const CREATE_NEW_ID = '__create-new__';
const DIVIDER = '__divider__';

function isCreateNewItemOption(itemOption: any): boolean {
  return itemOption?.id === CREATE_NEW_ID;
}

function isDividerOption(
  itemOption: CounterpartsAutocompleteOptionProps | undefined | null
): boolean {
  return itemOption?.id === DIVIDER;
}

export const ItemSelector = ({
  setIsCreateItemOpened,
  fieldName,
  disabled,
  index = 0,
  actualCurrency,
  defaultCurrency,
  measureUnits,
  onUpdate,
}: any) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const currency = actualCurrency ?? defaultCurrency;

  console.log({ actualCurrency, defaultCurrency, currency });
  const { control, watch } = useForm<CreateReceivablesProductsFormProps>({
    resolver: yupResolver(getCreateInvoiceProductsValidationSchema(i18n)),
    defaultValues: useMemo(
      () => ({
        items: [],
        currency,
      }),
      [actualCurrency, defaultCurrency]
    ),
  });

  const { api } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const {
    data: productsInfinity,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = api.products.getProducts.useInfiniteQuery(
    {
      query: {
        limit: 20,
        currency,
      },
    },
    {
      initialPageParam: {
        query: {
          pagination_token: undefined,
        },
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.next_pagination_token) return;
        return {
          query: {
            pagination_token: lastPage.next_pagination_token,
          },
        };
      },
      enabled: !!currency,
    }
  );

  const flattenProducts = useMemo(
    () =>
      productsInfinity
        ? productsInfinity.pages.flatMap((page) => page.data)
        : [],
    [productsInfinity]
  );

  const itemsAutocompleteData = useMemo<
    CounterpartsAutocompleteOptionProps[]
  >(() => {
    if (!flattenProducts || flattenProducts.length === 0) {
      return [];
    }

    return flattenProducts.map((item) => {
      const unit = measureUnits
        ? measureUnits.data.find((u: any) => u.id === item.measure_unit_id)
        : undefined;

      return {
        id: item.id,
        label: item.name,
        price: item.price,
        smallestAmount: item.smallest_amount,
        measureUnit: unit,
        fieldName: fieldName ?? '',
      };
    });
  }, [flattenProducts, measureUnits]);

  const handleCreateNewItem = useCallback(() => {
    setIsCreateItemOpened(true);
  }, [setIsCreateItemOpened]);

  const [customName, setCustomName] = useState('');

  const handleCustomNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomName(event.target.value);
  };

  return (
    <Controller
      name={`items.${index}`}
      control={control}
      render={({ field, fieldState: { error } }) => {
        let selectedItem = flattenProducts?.find(
          (item) => item?.id === field?.value
        );

        if (fieldName && !selectedItem) {
          selectedItem = flattenProducts?.find(
            (item) => item?.name === fieldName
          );
        }

        const selectedItemOption = selectedItem
          ? {
              id: selectedItem.id,
              label: selectedItem.name,
            }
          : customName
          ? { id: 'custom', label: customName }
          : null;

        const handleItemChange = (value: any) => {
          if (isCreateNewItemOption(value) || isDividerOption(value)) {
            field.onChange(null);
            return;
          }

          if (value && value.id === 'custom') {
            field.onChange(value.label);
            setCustomName(value.label);
          } else {
            field.onChange(value?.id);
          }

          if (value && onUpdate) {
            onUpdate(value);
          }
        };

        const isCustomName = !itemsAutocompleteData.some(
          (item) => item.label === customName
        );

        const handleBlur = () => {
          if (isCustomName && customName.trim() !== '') {
            onUpdate({ id: 'custom', label: customName });
          }
        };

        return (
          <>
            <Autocomplete
              {...field}
              value={selectedItemOption}
              onChange={(_, value) => handleItemChange(value)}
              onBlur={handleBlur}
              slotProps={{
                popper: {
                  container: root,
                  sx: {
                    width: 'calc(50% - 80px) !important',
                    left: '40px !important',
                  },
                },
              }}
              filterOptions={(options, params) => {
                const { filtered, reverseFiltered } = options.reduce<{
                  filtered: Array<{ id: string; label: string }>;
                  reverseFiltered: Array<{ id: string; label: string }>;
                }>(
                  (acc, option) => {
                    if (
                      option.label
                        .toLowerCase()
                        .includes(params.inputValue.toLowerCase())
                    ) {
                      acc.filtered.push(option);
                    } else {
                      acc.reverseFiltered.push(option);
                    }
                    return acc;
                  },
                  { filtered: [], reverseFiltered: [] }
                );

                filtered.unshift({
                  id: CREATE_NEW_ID,
                  label: t(i18n)`Create new item`,
                });

                if (params.inputValue.length) {
                  filtered.push({
                    id: DIVIDER,
                    label: '-',
                  });
                }
                return [...filtered, ...reverseFiltered];
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label={``}
                    placeholder={t(i18n)`Line item`}
                    required
                    error={Boolean(error)}
                    helperText={error?.message}
                    className="Item-Selector"
                    InputProps={{
                      ...params.InputProps,
                      value: params.inputProps.value,
                      startAdornment: isLoading && (
                        <CircularProgress size={20} />
                      ),
                      endAdornment: (() => {
                        if (
                          selectedItemOption &&
                          params.inputProps['aria-expanded']
                        ) {
                          return (
                            <IconButton
                              onClick={() => {
                                field.onChange(null);
                                setCustomName('');
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
                    onChange={handleCustomNameChange}
                  />
                );
              }}
              loading={isLoading || disabled}
              options={itemsAutocompleteData}
              getOptionLabel={(itemOption) =>
                isCreateNewItemOption(itemOption) || isDividerOption(itemOption)
                  ? ''
                  : itemOption.label
              }
              isOptionEqualToValue={(option, value) => {
                return option.id === value.id;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(
                props,
                itemOption: CounterpartsAutocompleteOptionProps
              ) =>
                isCreateNewItemOption(itemOption) ? (
                  <Button
                    key={itemOption.id}
                    variant="text"
                    startIcon={<AddIcon />}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      px: 2,
                    }}
                    onClick={handleCreateNewItem}
                  >
                    {itemOption.label}
                  </Button>
                ) : itemOption.id === DIVIDER ? (
                  <Divider
                    key={itemOption.id}
                    sx={{ padding: '.5rem', marginBottom: '1rem' }}
                  />
                ) : (
                  <li
                    {...props}
                    style={{ display: 'flex' }}
                    key={itemOption.id}
                  >
                    {itemOption?.label}
                    <span style={{ marginLeft: 'auto' }}>
                      {itemOption?.smallestAmount}{' '}
                      {itemOption?.measureUnit?.description} /{' '}
                      {itemOption?.price &&
                        formatCurrencyToDisplay(
                          itemOption?.price?.value,
                          itemOption?.price?.currency
                        )}
                    </span>
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
