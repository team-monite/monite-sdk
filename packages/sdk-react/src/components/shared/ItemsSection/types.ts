import type { DeepKeys } from '@/core/types/utils';

type LineItemOf<TForm> = TForm extends { line_items: Array<infer TItem> }
  ? TItem
  : never;

type LineItemDeepKeys<TForm> = DeepKeys<LineItemOf<TForm>>;

export interface ItemsSectionConfig<
  TForm = unknown,
  TMeasureUnit extends string = string,
> {
  itemSelectionMode: 'catalog' | 'manual';
  staticMeasureUnits?: ReadonlyArray<TMeasureUnit>;
  fieldMapping: {
    itemName: LineItemDeepKeys<TForm>;
    price: LineItemDeepKeys<TForm>;
    currency: LineItemDeepKeys<TForm>;
    measureUnit: LineItemDeepKeys<TForm>;
    quantity: LineItemDeepKeys<TForm>;
    vatRateId?: LineItemDeepKeys<TForm>;
    vatRateValue?: LineItemDeepKeys<TForm>;
    taxRateValue?: LineItemDeepKeys<TForm>;
  };

  features: {
    productCatalog: boolean;
    createNewProduct: boolean;
    vatExemptionRationale: boolean;
    autoAddRows: boolean;
    vatModeMenu: boolean;
  };
}
