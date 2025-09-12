export interface ItemsSectionConfig {
  itemSelectionMode: 'catalog' | 'manual';
  staticMeasureUnits?: string[];
  fieldMapping: {
    itemName: string;
    price: string;
    currency: string;
    measureUnit: string;
    quantity: string;
    vatRateId?: string;
    vatRateValue?: string;
    taxRateValue?: string;
  };

  features: {
    productCatalog: boolean;
    createNewProduct: boolean;
    vatExemptionRationale: boolean;
    autoAddRows: boolean;
    vatModeMenu: boolean;
  };
}
