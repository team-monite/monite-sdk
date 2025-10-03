import { components } from '@/api';

export interface IPriceConstructor {
  value: string | number;
  currency: CurrencyEnum;
  formatter: (value: string | number, currency: CurrencyEnum) => string | null;
}

/**
 * Price class for handling currency values with formatting
 *
 * Price objects store values in **MINOR UNITS** (cents).
 * The formatter expects values in minor units and handles the display conversion.
 *
 * @example
 * // Creating a Price object for $22.22
 * const price = new Price({
 *   value: 2222,  // Always in minor units (cents)
 *   currency: 'USD',
 *   formatter: formatCurrencyToDisplay
 * });
 *
 * @example
 * // Adding two prices
 * const price1 = new Price({ value: 2222, currency: 'USD', formatter });
 * const price2 = new Price({ value: 1111, currency: 'USD', formatter });
 * const total = price1.add(price2); // total.value = 3333
 */
export class Price {
  private value: IPriceConstructor['value'];
  private currency: IPriceConstructor['currency'];
  private formatter: IPriceConstructor['formatter'];

  constructor(params: IPriceConstructor) {
    this.value = params.value;
    this.currency = params.currency;
    this.formatter = params.formatter;
  }

  public add(addend: Price): Price {
    if (this.currency !== addend.currency) {
      throw new Error('Currencies must match');
    }

    return new Price({
      value: Number(this.value) + Number(addend.value),
      currency: this.currency,
      formatter: this.formatter,
    });
  }

  /**
   * Returns the numeric value stored in this Price object
   *
   * The returned value is in **MINOR UNITS** (cents).
   * Do NOT convert this value again when passing to formatters.
   *
   * @example
   * // Getting the value for calculations
   * const price = new Price({ value: 2222, currency: 'USD', formatter });
   * const cents = price.getValue(); // Returns 2222 (cents)
   *
   * @returns The price value in minor units (cents)
   */
  public getValue(): number {
    return Number(this.value);
  }

  public toString(): string {
    return this.formatter(this.value, this.currency) ?? '';
  }
}

type CurrencyEnum = components['schemas']['CurrencyEnum'];
