import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useFieldArray,
  useFormContext,
  type FieldPath,
  type FieldPathValue,
  type DeepPartial,
} from 'react-hook-form';

import type { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies, useDebounceCallback } from '@/core/hooks';
import { useIsMounted } from '@/core/hooks/useIsMounted';
import { generateUniqueId } from '@/utils/uuid';

import { useCreateInvoiceProductsTable } from '../components/useCreateInvoiceProductsTable';
import { sanitizeLineItems } from '../utils';
import type {
  CreateReceivablesFormBeforeValidationProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
} from '../validation';

interface UseLineItemManagementProps {
  actualCurrency?: CurrencyEnum;
  defaultCurrency: CurrencyEnum;
  isNonVatSupported: boolean;
  isInclusivePricing: boolean;
  maxAllowedEmptyRows?: number;
}

const DEFAULT_MAX_ALLOWED_EMPTY_ROWS = 4;

export const useLineItemManagement = ({
  actualCurrency,
  defaultCurrency,
  isNonVatSupported,
  isInclusivePricing,
  maxAllowedEmptyRows = DEFAULT_MAX_ALLOWED_EMPTY_ROWS,
}: UseLineItemManagementProps) => {
  const {
    control,
    formState: { errors: formErrors },
    setValue,
    getValues,
    watch,
    clearErrors,
    trigger,
  } = useFormContext<CreateReceivablesFormBeforeValidationProps>();

  const { api } = useMoniteContext();
  const { data: measureUnitsData } =
    api.measureUnits.getMeasureUnits.useQuery();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'line_items',
    shouldUnregister: false,
  });

  const mounted = useIsMounted();
  const isAddingRow = useRef(false);

  const [autoAddedRows, setAutoAddedRows] = useState<number[]>([]);
  const [tooManyEmptyRows, setTooManyEmptyRows] = useState(false);

  const watchedLineItems = watch('line_items');
  const currentLineItems = useMemo(
    () => watchedLineItems || [],
    [watchedLineItems]
  );

  const sanitizedLineItemsForTable = useMemo(() => {
    return sanitizeLineItems(currentLineItems);
  }, [currentLineItems]);

  const { formatCurrencyToDisplay } = useCurrencies();

  const {
    subtotalPrice,
    totalPrice,
    totalTaxes,
    shouldShowVatExemptRationale,
    taxesByVatRate,
  } = useCreateInvoiceProductsTable({
    lineItems: sanitizedLineItemsForTable,
    isNonVatSupported,
    actualCurrency: actualCurrency ?? defaultCurrency,
    isInclusivePricing,
    formatCurrencyToDisplay,
  });

  const createEmptyRow = useCallback(
    (
      template?: CreateReceivablesFormBeforeValidationLineItemProps
    ): CreateReceivablesFormBeforeValidationLineItemProps => {
      const product: CreateReceivablesFormBeforeValidationLineItemProps['product'] =
        {
          name: template?.product?.name || '',
          price: {
            currency: actualCurrency ?? defaultCurrency,
            value: template?.product?.price?.value || 0,
          },
          measure_unit_id: template?.product?.measure_unit_id || '',
          type: template?.product?.type || 'product',
        };

      // Preserve VAT rates correctly based on region
      // For non-VAT regions, use tax_rate_value, otherwise preserve vat_rate_id and vat_rate_value
      return {
        id: template?.id ?? generateUniqueId(),
        product_id: template?.product_id || '',
        product,
        quantity: template?.quantity ?? 1,
        // Preserve VAT values or set defaults based on region
        vat_rate_id: isNonVatSupported ? undefined : template?.vat_rate_id,
        vat_rate_value: isNonVatSupported
          ? undefined
          : template?.vat_rate_value,
        tax_rate_value: isNonVatSupported
          ? template?.tax_rate_value
          : undefined,
        // Preserve measure_unit for custom units
        ...(template?.measure_unit
          ? { measure_unit: template.measure_unit }
          : {}),
      };
    },
    [actualCurrency, defaultCurrency, isNonVatSupported]
  );

  const countEmptyRows = useCallback(
    (items: CreateReceivablesFormBeforeValidationLineItemProps[]) => {
      return items.reduce(
        (count, field) => (field.product?.name === '' ? count + 1 : count),
        0
      );
    },
    []
  );

  const performAutoAddRow = useCallback(() => {
    if (isAddingRow.current || !mounted.current) {
      return;
    }

    const currentItems = getValues('line_items') || [];
    const emptyRowCount = countEmptyRows(currentItems);

    if (emptyRowCount <= maxAllowedEmptyRows) {
      setTooManyEmptyRows(false);
    }

    if (emptyRowCount === 0 && currentItems.length > 0) {
      isAddingRow.current = true;

      const newRow = createEmptyRow();
      if (
        measureUnitsData?.data &&
        measureUnitsData.data.length > 0 &&
        newRow.product &&
        !newRow.product.measure_unit_id
      ) {
        newRow.product.measure_unit_id = measureUnitsData.data[0].id;
      }

      const newRowIndex = currentItems.length;
      append(newRow, { shouldFocus: false });
      setAutoAddedRows((prev) => [...prev, newRowIndex]);
    }
  }, [
    mounted,
    getValues,
    countEmptyRows,
    maxAllowedEmptyRows,
    createEmptyRow,
    measureUnitsData?.data,
    append,
  ]);

  const debouncedAutoAddRow = useDebounceCallback(performAutoAddRow);

  const handleAddRow = useCallback(() => {
    const currentItems = getValues('line_items') || [];
    const emptyRowCount = countEmptyRows(currentItems);

    if (emptyRowCount > maxAllowedEmptyRows) {
      setTooManyEmptyRows(true);
      return;
    }

    if (isAddingRow.current) {
      return;
    }

    setTooManyEmptyRows(false);
    isAddingRow.current = true;

    append(createEmptyRow());

    const itemsAfterManualAdd = getValues('line_items');

    if (itemsAfterManualAdd && itemsAfterManualAdd.length > 0) {
      const newRowIndex = itemsAfterManualAdd.length - 1;

      clearErrors(`line_items.${newRowIndex}`);
    }
  }, [
    append,
    createEmptyRow,
    countEmptyRows,
    getValues,
    clearErrors,
    maxAllowedEmptyRows,
  ]);

  const handleAutoAddRow = useCallback(() => {
    debouncedAutoAddRow();
  }, [debouncedAutoAddRow]);

  useEffect(() => {
    if (isAddingRow.current) {
      Promise.resolve().then(() => {
        isAddingRow.current = false;
      });
    }
  }, [fields.length]);

  const cleanUpLineItemsForSubmission = useCallback(() => {
    const currentItems = getValues('line_items');

    if (!currentItems?.length) {
      return;
    }

    const nonEmptyItems = currentItems.filter((item) =>
      Boolean(item?.product?.name?.trim())
    );
    const firstEmptyItem = currentItems.find(
      (item) => !item?.product?.name?.trim()
    );

    let finalItems: CreateReceivablesFormBeforeValidationLineItemProps[] = [];
    const actualNonEmptyItems = nonEmptyItems; // nonEmptyItems is already the filtered list

    if (actualNonEmptyItems.length > 0) {
      finalItems = actualNonEmptyItems;
    } else if (currentItems.length > 0) {
      finalItems = [createEmptyRow(firstEmptyItem || undefined)];
    } else {
      finalItems = [];
    }

    const didItemsChange =
      finalItems.length !== currentItems.length ||
      !finalItems.every((item, index) => item.id === currentItems[index]?.id);

    if (didItemsChange) {
      clearErrors('line_items');
      setValue('line_items', finalItems, {
        shouldValidate: false,
        shouldDirty: true,
      });
      setAutoAddedRows([]);
    }
  }, [getValues, setValue, clearErrors, createEmptyRow]);

  useEffect(() => {
    if (!mounted.current) {
      const existingItems = getValues('line_items');

      if (!existingItems?.length && !isAddingRow.current) {
        isAddingRow.current = true;
        append(createEmptyRow());
        setAutoAddedRows([0]);
      }
    }
  }, [append, createEmptyRow, getValues, setAutoAddedRows, mounted]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      remove(index);

      const currentItems = getValues('line_items') || [];
      const itemsAfterRemoval = currentItems.filter(
        (
          _item: CreateReceivablesFormBeforeValidationLineItemProps,
          i: number
        ) => i !== index
      );
      const emptyRowCount = countEmptyRows(itemsAfterRemoval);
      if (emptyRowCount <= maxAllowedEmptyRows) {
        setTooManyEmptyRows(false);
      }

      setAutoAddedRows((prev) =>
        prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))
      );
    },
    [
      remove,
      getValues,
      countEmptyRows,
      setAutoAddedRows,
      setTooManyEmptyRows,
      maxAllowedEmptyRows,
    ]
  );

  const setValueWithValidationLocal = useCallback(
    <TName extends FieldPath<CreateReceivablesFormBeforeValidationProps>>(
      name: TName,
      value: FieldPathValue<CreateReceivablesFormBeforeValidationProps, TName>,
      options?: {
        shouldValidate?: boolean;
        shouldDirty?: boolean;
        shouldTouch?: boolean;
      }
    ) => {
      setValue(name, value, {
        shouldDirty: true,
        ...options,
      });
      if (options?.shouldValidate) {
        trigger(name);
      }
    },
    [setValue, trigger]
  );

  const handleRequestLineItemValue = useCallback(
    <
      TFieldName extends FieldPath<CreateReceivablesFormBeforeValidationLineItemProps>
    >(
      index: number,
      path: TFieldName
    ): FieldPathValue<
      CreateReceivablesFormBeforeValidationLineItemProps,
      TFieldName
    > => {
      const fieldPath = `line_items.${index}.${path}` as const;

      return getValues(fieldPath);
    },
    [getValues]
  );

  const lineItemErrors = useMemo(() => {
    if (formErrors.line_items && Array.isArray(formErrors.line_items)) {
      return fields.map((_field, index) => {
        const error = formErrors.line_items?.[index] as
          | DeepPartial<CreateReceivablesFormBeforeValidationLineItemProps>
          | undefined;
        return error || {};
      });
    }
    return fields.map(() => ({}));
  }, [formErrors.line_items, fields]);

  return {
    fields,
    autoAddedRows,
    tooManyEmptyRows,
    subtotalPrice,
    totalPrice,
    totalTaxes,
    taxesByVatRate,
    shouldShowVatExemptRationale,
    lineItemErrors,
    handleAddRow,
    handleRemoveItem,
    handleAutoAddRow,
    setAutoAddedRows,
    setValueWithValidationLocal,
    cleanUpLineItemsForSubmission,
    createEmptyRow,
    handleRequestLineItemValue,
  };
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
