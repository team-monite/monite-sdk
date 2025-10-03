import type { CurrencyEnum } from './types';
import { ConfigurableItemsSection } from '@/components/shared/ItemsSection';
import { RECEIVABLES_ITEMS_CONFIG } from '@/components/shared/ItemsSection/consts';

interface ConfigurableReceivablesItemsSectionProps {
  actualCurrency?: CurrencyEnum;
  defaultCurrency?: CurrencyEnum;
  isNonVatSupported: boolean;
  isVatSelectionDisabled?: boolean;
  registerLineItemCleanupFn?: (fn: (() => void) | null) => void;
}

export const ConfigurableReceivablesItemsSection = (
  props: ConfigurableReceivablesItemsSectionProps
) => {
  return (
    <ConfigurableItemsSection config={RECEIVABLES_ITEMS_CONFIG} {...props} />
  );
};
