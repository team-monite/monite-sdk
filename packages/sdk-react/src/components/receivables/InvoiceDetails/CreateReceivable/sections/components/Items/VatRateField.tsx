import { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';

import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { formatVatRateForDisplay, vatRatePercentageToBasisPoints } from '@/core/utils/vatUtils';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface VatRateFieldProps {
  availableVatRates?: VatRateItemType[];
  currentTaxRateValue?: number;
  currentVatRateValue?: number;
  isNonVatSupported: boolean;
  highestVatRate?: VatRateItemType;
  value?: string | null;
  error?: boolean;
  fieldError?: FieldError;
  disabled?: boolean;
  onChange: (
    newVatRateId: string | null,
    newVatRateValue?: number | null
  ) => void;
  onInitializeDefaults?: (
    defaultVatRateId: string | null,
    defaultVatRateValue?: number | null,
    defaultTaxRate?: number | null
  ) => void;
  onModified?: () => void;
}

export const VatRateField = ({
  availableVatRates,
  value,
  isNonVatSupported,
  currentTaxRateValue,
  currentVatRateValue, // Add current VAT rate value for reverse lookup
  highestVatRate,
  error,
  disabled = false,
  onChange,
  onInitializeDefaults,
  onModified,
}: VatRateFieldProps) => {
  const { root } = useRootElements();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!onInitializeDefaults || hasInitialized) {
      return;
    }
    
    const hasExistingValues = 
      (value && value !== '') || 
      (currentVatRateValue !== null && currentVatRateValue !== undefined) ||
      (currentTaxRateValue !== null && currentTaxRateValue !== undefined);
    
    if (hasExistingValues) {
      setHasInitialized(true);
      return;
    }

    let defaultVatId: string | null = null;
    let defaultVatValue: number | null = null;
    let defaultTaxRate: number | null = null;

    if (!isNonVatSupported && highestVatRate) {
      // For VAT-supported regions, always set the highest VAT rate as default
      defaultVatId = highestVatRate.id;
      defaultVatValue = highestVatRate.value;
    } else if (isNonVatSupported) {
      // For non-VAT regions, set VAT rate to null and use tax_rate_value (default to 0%)
      defaultVatId = null;
      defaultVatValue = null;
      defaultTaxRate =
        currentTaxRateValue === undefined ? 0 : currentTaxRateValue;
    }

    if (defaultVatId !== value || (isNonVatSupported && defaultTaxRate !== currentTaxRateValue)) {
      onInitializeDefaults(defaultVatId, defaultVatValue, defaultTaxRate);
    }
    setHasInitialized(true);
  }, [
    hasInitialized,
    isNonVatSupported,
    highestVatRate,
    onInitializeDefaults,
    value,
    currentVatRateValue,
    currentTaxRateValue,
  ]);

  useEffect(() => {
    if (
      !isNonVatSupported &&
      !value &&
      availableVatRates?.length &&
      hasInitialized &&
      typeof currentVatRateValue === 'number'
    ) {
      const currentVatRateInBasisPoints = vatRatePercentageToBasisPoints(currentVatRateValue);
      const matchingVatRate = availableVatRates.find(rate => 
        rate.value === currentVatRateInBasisPoints
      );

      if (matchingVatRate) {
        onChange(matchingVatRate.id, matchingVatRate.value);
      }
    }
  }, [
    isNonVatSupported,
    value,
    availableVatRates,
    hasInitialized,
    currentVatRateValue,
    onChange,
  ]);

  // If we're in a non-VAT region, we don't need to show the VAT rate selector
  if (isNonVatSupported) {
    return null;
  }

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedVatRateId = event.target.value as string;
    const selectedVatRate = availableVatRates?.find(
      (rate) => rate.id === selectedVatRateId
    );

    onChange(selectedVatRateId, selectedVatRate?.value);
    onModified?.();
  };

  return (
    <Select
      MenuProps={{ container: root }}
      value={value ?? ''}
      onChange={handleChange}
      variant="outlined"
      error={error}
      disabled={disabled}
      fullWidth
      size="small"
    >
      {availableVatRates?.map((rate) => (
        <MenuItem key={rate.id} value={rate.id}>
          {formatVatRateForDisplay(rate.value)}
        </MenuItem>
      ))}
    </Select>
  );
};

type VatRateItemType = components['schemas']['VatRateResponse'];
