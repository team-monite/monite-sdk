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
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
} from '@mui/material';

type CurrencyEnum = components['schemas']['CurrencyEnum'];

interface ItemSelectorOptionProps {
  id: string;
  label: string;
  description?: string;
  price?: {
    currency: components['schemas']['CurrencyEnum'];
    value: number;
  };
  smallestAmount?: number;
  measureUnit?: components['schemas']['LineItemProductMeasureUnit'];
  currency?: CurrencyEnum;
}

type MeasureUnit = components['schemas']['LineItemProductMeasureUnit'];

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
export const CUSTOM_ID = 'custom';

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
    resolver: zodResolver(getCreateInvoiceProductsValidationSchema(i18n)),
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
        description: item.description,
        price: item.price,
        smallestAmount: item.smallest_amount,
        measureUnit: unit,
        fieldName: fieldName ?? '',
      };
    });
  }, [flattenProducts, measureUnits, fieldName]);

  useEffect(() => {
    if (!isTyping && fieldName && fieldName.length > 0 && !customName.length) {
      const searchMatch = flattenProducts?.find(
        (item) => item?.name === fieldName
      );

      if (!searchMatch) {
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

  const handleFocus = useCallback(() => setIsTyping(true), []);

  const handleBlur = useCallback(() => {
    setIsTyping(false);
    if (customName && customName.trim() !== '') {
      const isCustomName = !itemsAutocompleteData.some(
        (item) => item.label === customName
      );

      if (isCustomName) {
        onUpdate({ id: CUSTOM_ID, label: customName }, false);
      }
    }
  }, [customName, itemsAutocompleteData, onUpdate]);

  const handleInputChange = useCallback(
    (_: React.SyntheticEvent, value: string) => {
      setCustomName(value);
      if (value.trim()) {
        onUpdate({ id: CUSTOM_ID, label: value }, false);
      }
    },
    [onUpdate]
  );

  const handleItemChange = useCallback(
    (
      _: React.SyntheticEvent,
      value: ItemSelectorOptionProps | null,
      reason: string
    ) => {
      if (reason === 'clear') {
        setIsTyping(false);
        setCustomName('');
        onUpdate({ id: '', label: '' }, false);
        return;
      }

      if (!value || isCreateNewItemOption(value) || isDividerOption(value)) {
        return;
      }

      if (isCustomOption(value)) {
        setCustomName(value.label);
        onUpdate({ id: CUSTOM_ID, label: value.label }, false);
      } else {
        setCustomName('');
        onUpdate(value, true);
      }
    },
    [onUpdate]
  );

  const isOptionEqualToValue = useCallback(
    (option: ItemSelectorOptionProps, value: ItemSelectorOptionProps) => {
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
    },
    []
  );

  const renderOption = useCallback(
    (
      props: React.HTMLAttributes<HTMLLIElement>,
      itemOption: ItemSelectorOptionProps
    ) => {
      if (isCreateNewItemOption(itemOption)) {
        return (
          <Button
            key={`item-option-${itemOption.id}-${itemOption.label}`}
            component="div"
            onClick={onCreateItem}
            variant="text"
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              px: 2,
            }}
          >
            {itemOption.label}
          </Button>
        );
      }

      if (isDividerOption(itemOption)) {
        return (
          <Divider
            key={`item-option-${itemOption.id}-${itemOption.label}`}
            sx={{
              width: '100%',
              my: 1,
            }}
          />
        );
      }

      return (
        <MenuItem
          {...props}
          key={`item-option-${itemOption.id}-${itemOption.label}`}
          sx={{
            display: 'flex',
            width: '100%',
            py: 1,
            px: 2,
            '& .item-content': {
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            },
            '& .item-label': {
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
            '& .item-details': {
              flexShrink: 0,
              textAlign: 'right',
            },
          }}
        >
          <div className="item-content">
            <span className="item-label">{itemOption?.label}</span>
            <span className="item-details">
              {itemOption?.smallestAmount}{' '}
              {itemOption?.measureUnit?.description} /{' '}
              {itemOption?.price &&
                formatCurrencyToDisplay(
                  itemOption?.price?.value,
                  itemOption?.price?.currency
                )}
            </span>
          </div>
        </MenuItem>
      );
    },
    [formatCurrencyToDisplay, onCreateItem]
  );

  const getOptionLabel = useCallback(
    (itemOption: string | ItemSelectorOptionProps) => {
      if (typeof itemOption === 'string') {
        return itemOption;
      }

      if (isCreateNewItemOption(itemOption) || isDividerOption(itemOption)) {
        return '';
      }

      return itemOption.label;
    },
    []
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

        return (
          <Autocomplete
            {...field}
            id={`item-selector-${index}`}
            value={selectedItemOption}
            onChange={(e, value, reason) => {
              if (reason === 'clear') {
                field.onChange(null);
                handleItemChange(e, null, reason);
                return;
              }

              if (typeof value === 'string') {
                const stringValue: ItemSelectorOptionProps = {
                  id: CUSTOM_ID,
                  label: value,
                };
                handleItemChange(e, stringValue, reason);
                field.onChange(stringValue.id);
                return;
              }

              handleItemChange(e, value, reason);
              if (value) {
                field.onChange(value.id);
              }
            }}
            onInputChange={handleInputChange}
            freeSolo
            blurOnSelect={false}
            openOnFocus
            loading={isLoading || disabled}
            options={itemsAutocompleteData}
            getOptionLabel={getOptionLabel}
            selectOnFocus
            clearOnBlur={false}
            handleHomeEndKeys
            renderOption={renderOption}
            isOptionEqualToValue={isOptionEqualToValue}
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
              if (options.length === 0) {
                const result = [
                  {
                    id: CREATE_NEW_ID,
                    label: t(i18n)`Create new item`,
                  },
                ];

                if (params.inputValue.length) {
                  result.push({
                    id: CUSTOM_ID,
                    label: params.inputValue,
                  });
                }

                return result;
              }

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
                const hasExactMatch = filtered.some(
                  (item) =>
                    item.label.toLowerCase() === params.inputValue.toLowerCase()
                );

                if (!hasExactMatch && params.inputValue.trim()) {
                  filtered.push({
                    id: CUSTOM_ID,
                    label: params.inputValue,
                  });
                }

                filtered.push({
                  id: DIVIDER,
                  label: '-',
                });
              }

              return [...filtered, ...reverseFiltered];
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
                  onBlur: handleBlur,
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
          />
        );
      }}
    />
  );
};
