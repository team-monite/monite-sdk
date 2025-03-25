import { useEffect } from 'react';
import { UseFormGetValues, UseFormReset } from 'react-hook-form';

import { components } from '@/api';

type MeasureUnit =
  components['schemas']['package__receivables__latest__receivables__LineItemProductMeasureUnit'];

interface ExtendedLineItem {
  product: {
    measure_unit_id?: string;
    measure_unit_name?: string;
  };
  measure_unit?: {
    name: string;
    id: null;
  };
}

interface FormValues {
  line_items: Array<ExtendedLineItem>;
}

/**
 * A hook that maps measure unit names to IDs when possible and preserves custom measure units
 */
export const useMeasureUnitsMapping = <T extends FormValues>(
  measureUnits: { data?: MeasureUnit[] } | undefined,
  getValues: UseFormGetValues<T>,
  reset: UseFormReset<T>
) => {
  useEffect(() => {
    if (!measureUnits?.data?.length) return;

    const currentValues = getValues();
    const unitsMap = new Map(measureUnits.data.map((unit) => [unit.id, unit]));
    const unitsNameMap = new Map(
      measureUnits.data
        .filter((unit) => unit.name)
        .map((unit) => [unit.name?.toLowerCase(), unit])
    );

    const lineItemsWithMappedUnits = currentValues.line_items.map((item) => {
      const measureUnitId = item.product.measure_unit_id;
      const measureUnitName =
        item.product.measure_unit_name || item.measure_unit?.name;

      // Try to find a matching unit either by ID or name
      let matchedUnit: MeasureUnit | undefined;

      if (measureUnitId && unitsMap.has(measureUnitId)) {
        matchedUnit = unitsMap.get(measureUnitId);
      } else if (
        measureUnitName &&
        unitsNameMap.has(measureUnitName.toLowerCase())
      ) {
        matchedUnit = unitsNameMap.get(measureUnitName.toLowerCase());
      }

      // Case 1 & 2: We found a matching unit (either by ID or name)
      if (matchedUnit) {
        return {
          ...item,
          product: {
            ...item.product,
            measure_unit_id: matchedUnit.id,
            measure_unit_name: undefined,
          },
          measure_unit: {
            id: matchedUnit.id,
            name: matchedUnit.name || '',
          },
        };
      }

      // Case 3: Keep a custom measure unit name
      if (measureUnitName) {
        return {
          ...item,
          product: {
            ...item.product,
            measure_unit_id: undefined,
            measure_unit_name: measureUnitName,
          },
          measure_unit: {
            name: measureUnitName,
            id: null,
          },
        };
      }

      // Case 4: Clear empty ID if no name exists
      if (measureUnitId === '' || measureUnitId === undefined) {
        return {
          ...item,
          product: {
            ...item.product,
            measure_unit_id: undefined,
          },
        };
      }

      // Default: Keep item as is
      return { ...item };
    });

    // Reset with mapped units
    reset({
      ...currentValues,
      line_items: lineItemsWithMappedUnits,
    } as T);
  }, [measureUnits?.data, reset, getValues]);
};
