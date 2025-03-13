import {
  Dispatch,
  SetStateAction,
  useCallback,
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

import debounce from 'lodash/debounce';

type CurrencyEnum = components['schemas']['CurrencyEnum'];

interface ItemSelectorOptionProps {
  id: string;
  label: string;
  price?: {
    currency: components['schemas']['CurrencyEnum'];
    value: number;
  };
  smallestAmount?: number;
  measureUnit?: components['schemas']['package__receivables__latest__receivables__LineItemProductMeasureUnit'];
  currency?: CurrencyEnum;
}

type MeasureUnit =
  components['schemas']['package__receivables__latest__receivables__LineItemProductMeasureUnit'];

type ItemSelectorProps = {
  setIsCreateItemOpened: Dispatch<SetStateAction<boolean>>;
  onUpdate: (arg0: ItemSelectorOptionProps, arg1?: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  actualCurrency?: CurrencyEnum;
  defaultCurrency?: CurrencyEnum;
  fieldName?: string;
  index: number;
  measureUnits?: { data: MeasureUnit[] };
};

const CREATE_NEW_ID = '__create-new__';
const DIVIDER = '__divider__';

function isCreateNewItemOption(itemOption: ItemSelectorOptionProps): boolean {
  return itemOption?.id === CREATE_NEW_ID;
}

function isDividerOption(
  itemOption: ItemSelectorOptionProps | undefined | null
): boolean {
  return itemOption?.id === DIVIDER;
}

export const ItemSelector = ({
  setIsCreateItemOpened,
  fieldName,
  error,
  disabled,
  index = 0,
  actualCurrency,
  defaultCurrency,
  measureUnits,
  onUpdate,
}: ItemSelectorProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const currency = actualCurrency ?? defaultCurrency;

  const { control } = useForm<CreateReceivablesProductsFormProps>({
    resolver: yupResolver(getCreateInvoiceProductsValidationSchema(i18n)),
    defaultValues: useMemo(
      () => ({
        items: [],
        currency,
      }),
      [currency]
    ),
  });

  const { api } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const { data: productsInfinity, isLoading } =
    api.products.getProducts.useInfiniteQuery(
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

  const itemsAutocompleteData = useMemo<ItemSelectorOptionProps[]>(() => {
    if (!flattenProducts || flattenProducts.length === 0) {
      return [];
    }

    return flattenProducts.map((item) => {
      const unit = measureUnits
        ? measureUnits.data.find(
            (u: MeasureUnit) => u.id === item.measure_unit_id
          )
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
  }, [flattenProducts, measureUnits, fieldName]);

  const handleCreateNewItem = useCallback(() => {
    setIsCreateItemOpened(true);
  }, [setIsCreateItemOpened]);

  const [customName, setCustomName] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleCustomNameChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomName(event.target.value);
    },
    300
  );

  const handleFocus = useCallback(() => setIsTyping(true), []);
  const handleBlur = useCallback(() => {
    setIsTyping(false);
    const isCustomName = !itemsAutocompleteData.some(
      (item) => item.label === customName
    );

    if (isCustomName && customName.trim() !== '') {
      onUpdate({ id: 'custom', label: customName }, false);
    }
  }, [customName, itemsAutocompleteData, onUpdate]);

  return (
    <Controller
      name={`items.${index}`}
      control={control}
      render={({ field }) => {
        let selectedItem = flattenProducts?.find(
          (item) => item?.id === field?.value
        );

        //fieldName will be inherited after value is saved. some possible scenarios:
        //(Create invoice: name typed followed by onblur . Edit invoice: name loaded.)
        if (
          !isTyping &&
          fieldName &&
          fieldName.length > 0 &&
          !customName.length &&
          !selectedItem
        ) {
          const searchMatch = flattenProducts?.find(
            (item) => item?.name === fieldName // potentially item?.product.name, double check
          );
          if (searchMatch) {
            // inherited value was found in catalogue
            selectedItem = searchMatch;
          } else {
            // not found in catalogue, display name as is
            setCustomName(fieldName);
          }
        }

        const selectedItemOption = selectedItem
          ? {
              id: selectedItem.id,
              label: selectedItem.name,
            }
          : customName
          ? { id: 'custom', label: customName }
          : null;

        //will trigger only for existing items in catalogue so it is pointless to check custom scenario
        const handleItemChange = (value: ItemSelectorOptionProps | null) => {
          if (
            !value ||
            isCreateNewItemOption(value) ||
            isDividerOption(value)
          ) {
            setCustomName('');
            field.onChange(null);
            return;
          } else if (value) {
            field.onChange(value.id);
            setCustomName('');
            if (onUpdate) {
              onUpdate(value, true);
            }
          }
        };

        return (
          <Autocomplete
            {...field}
            value={selectedItemOption}
            onChange={(_, value) => handleItemChange(value)}
            slotProps={{
              popper: {
                container: root,
                sx: {
                  width: 'calc(50% - 80px) !important',
                  maxWidth: 'min(940px, 100%)',
                  left: '40px !important',
                  marginLeft: '4px',
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
                  error={error}
                  className="Item-Selector"
                  InputProps={{
                    ...params.InputProps,
                    value: params.inputProps.value,
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    startAdornment: isLoading && <CircularProgress size={20} />,
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
                            <ClearIcon sx={{ width: '1rem', height: '1rem' }} />
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
            clearOnBlur={false}
            handleHomeEndKeys
            renderOption={(props, itemOption: ItemSelectorOptionProps) =>
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
                <li {...props} style={{ display: 'flex' }} key={itemOption.id}>
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
        );
      }}
    />
  );
};
