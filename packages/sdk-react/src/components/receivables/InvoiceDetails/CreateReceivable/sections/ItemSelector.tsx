import { useCallback, useMemo, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { components } from '@/api';
import {
  CreateReceivablesProductsFormProps,
  getCreateInvoiceProductsValidationSchema,
} from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { useDebounceCallback } from '@/core/hooks/useDebounce';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  TextField,
} from '@mui/material';

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
  disabled?: boolean;
  error?: boolean;
  actualCurrency?: CurrencyEnum;
  defaultCurrency?: CurrencyEnum;
  fieldName?: string;
  index: number;
  measureUnits?: { data: MeasureUnit[] };
  marginLeft?: string | number;
  onCreateItem: () => void;
  onUpdate: (item: ItemSelectorOptionProps, isCatalogItem?: boolean) => void;
};

const CREATE_NEW_ID = '__create-new__';
const DIVIDER = '__divider__';
const CUSTOM_ID = 'custom';

function isCreateNewItemOption(itemOption: ItemSelectorOptionProps): boolean {
  return itemOption?.id === CREATE_NEW_ID;
}

function isDividerOption(
  itemOption: ItemSelectorOptionProps | undefined | null
): boolean {
  return itemOption?.id === DIVIDER;
}

function isCustomOption(
  itemOption: ItemSelectorOptionProps | undefined | null
): boolean {
  return itemOption?.id === CUSTOM_ID;
}

export const ItemSelector = ({
  fieldName,
  error,
  disabled,
  index = 0,
  actualCurrency,
  defaultCurrency,
  measureUnits,
  marginLeft = '4px', //to avoid box-shadow from being cut by container
  onCreateItem,
  onUpdate,
}: ItemSelectorProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const currency = actualCurrency ?? defaultCurrency;
  const [customName, setCustomName] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  useEffect(() => {
    if (!isTyping && fieldName && fieldName.length > 0) {
      const searchMatch = flattenProducts?.find(
        (item) => item?.name === fieldName
      );
      if (!searchMatch && !customName) {
        setCustomName(fieldName);
      }
    }
  }, [fieldName, isTyping, flattenProducts, customName]);

  const handleCustomNameChange = useDebounceCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomName(event.target.value);
    },
    300
  );

  const handleFocus = () => setIsTyping(true);
  const handleBlur = useCallback(
    (field: any) => {
      setIsTyping(false);
      if (!customName.trim()) return;

      const isCustomName = !itemsAutocompleteData.some(
        (item) => item.label === customName
      );

      if (isCustomName) {
        const lastValidItem = flattenProducts?.find(
          (item) => item?.id === field?.value
        );
        if (lastValidItem) {
          setCustomName(lastValidItem.name);
          onUpdate({ id: lastValidItem.id, label: lastValidItem.name }, true);
        } else {
          setCustomName('');
          onUpdate({ id: '', label: '' }, false);
        }
      }
    },
    [customName, itemsAutocompleteData, onUpdate, flattenProducts]
  );

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
          }
        }

        const selectedItemOption = selectedItem
          ? {
              id: selectedItem.id,
              label: selectedItem.name,
            }
          : customName
          ? { id: CUSTOM_ID, label: customName }
          : null;

        const handleItemChange = (value: ItemSelectorOptionProps | null) => {
          if (
            !value ||
            isCreateNewItemOption(value) ||
            isDividerOption(value)
          ) {
            setCustomName('');
            field.onChange(null);
            onUpdate({ id: '', label: '' }, false);
            return;
          }

          field.onChange(value.id);
          setCustomName('');
          onUpdate(value, true);
        };

        return (
          <Autocomplete
            {...field}
            value={selectedItemOption}
            onChange={(_, value) => handleItemChange(value)}
            isOptionEqualToValue={(option, value) => {
              if (!value) return false;

              if (isCustomOption(value)) {
                return isCustomOption(option) && option.label === value.label;
              }

              if (isCustomOption(option)) {
                return false;
              }

              if (isCreateNewItemOption(value) || isDividerOption(value)) {
                return option.id === value.id;
              }

              return option.id === value.id;
            }}
            slotProps={{
              popper: {
                container: root,
                sx: {
                  width: 'calc(50% - 80px) !important',
                  maxWidth: 'min(940px, 100%)',
                  left: '40px !important',
                },
              },
            }}
            disableClearable={false}
            filterOptions={(options, params) => {
              const filtered = options.filter((option) => {
                const isSelectedItem = option.id === selectedItemOption?.id;
                const isCustomItem = isCustomOption(option);
                const matchesSearch = option.label
                  .toLowerCase()
                  .includes(params.inputValue.toLowerCase());

                return !isSelectedItem && !isCustomItem && matchesSearch;
              });

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

              return filtered;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={``}
                placeholder={t(i18n)`Line item`}
                required
                error={error}
                className="Item-Selector"
                sx={{
                  width: '100%',
                  marginLeft,
                }}
                InputProps={{
                  ...params.InputProps,
                  onFocus: handleFocus,
                  onBlur: () => handleBlur(field),
                  startAdornment: isLoading && <CircularProgress size={20} />,
                  endAdornment: (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {params.InputProps.endAdornment}
                    </div>
                  ),
                }}
                onChange={handleCustomNameChange}
              />
            )}
            loading={isLoading || disabled}
            options={[
              ...(customName ? [{ id: CUSTOM_ID, label: customName }] : []),
              ...itemsAutocompleteData,
            ]}
            getOptionLabel={(itemOption) =>
              isCreateNewItemOption(itemOption) || isDividerOption(itemOption)
                ? ''
                : itemOption.label
            }
            selectOnFocus
            clearOnBlur={true}
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
                  onClick={onCreateItem}
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
