import { ItemsSectionConfig } from './types';
import type { PurchaseOrderMeasureUnit } from '@/components/payables/PurchaseOrders/types';
import type { CreatePurchaseOrderFormBeforeValidationProps } from '@/components/payables/PurchaseOrders/types';
import type { CreateReceivablesFormBeforeValidationProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';

export const RECEIVABLES_ITEMS_CONFIG: ItemsSectionConfig<CreateReceivablesFormBeforeValidationProps> =
  {
    itemSelectionMode: 'catalog',
    staticMeasureUnits: undefined,
    fieldMapping: {
      itemName: 'product.name',
      price: 'product.price.value',
      currency: 'product.price.currency',
      measureUnit: 'product.measure_unit_id',
      quantity: 'quantity',
      vatRateId: 'vat_rate_id',
      vatRateValue: 'vat_rate_value',
      taxRateValue: 'tax_rate_value',
    },
    features: {
      productCatalog: true,
      createNewProduct: true,
      vatExemptionRationale: true,
      autoAddRows: true,
      vatModeMenu: true,
    },
  };

export const PURCHASE_ORDERS_ITEMS_CONFIG: ItemsSectionConfig<
  CreatePurchaseOrderFormBeforeValidationProps,
  PurchaseOrderMeasureUnit
> = {
  itemSelectionMode: 'manual',
  staticMeasureUnits: ['unit', 'cm', 'day', 'hour', 'kg', 'litre'],
  fieldMapping: {
    itemName: 'name',
    price: 'price',
    currency: 'currency',
    measureUnit: 'unit',
    quantity: 'quantity',
    vatRateId: 'vat_rate_id',
    vatRateValue: 'vat_rate_value',
    taxRateValue: 'tax_rate_value',
  },
  features: {
    productCatalog: false,
    createNewProduct: false,
    vatExemptionRationale: false,
    autoAddRows: false,
    vatModeMenu: true,
  },
};
