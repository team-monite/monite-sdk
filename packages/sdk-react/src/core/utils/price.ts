import { components } from '@monite/sdk-api/src/api';

export interface IPriceConstructor {
  value: string | number;
  currency: CurrencyEnum | string;
  formatter: (
    value: string | number,
    currency: CurrencyEnum | string
  ) => string | null;
}

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

  public toString(): string {
    return this.formatter(this.value, this.currency) ?? '';
  }
}

type CurrencyEnum = components['schemas']['CurrencyEnum'];
