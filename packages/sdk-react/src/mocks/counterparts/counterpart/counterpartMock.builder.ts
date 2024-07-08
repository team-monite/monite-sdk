import { QConterpartResponse } from '@/core/queries';
import {
  CounterpartCursorFields,
  CounterpartResponse,
  CounterpartType,
  OrderEnum,
} from '@monite/sdk-api';

import { counterpartListFixture } from './counterpartFixture';

export interface GetRequest {
  limit: string;
  sort?: CounterpartCursorFields;
  order?: OrderEnum;
  counterpart_name__contains?: string;
  counterpart_name__icontains?: string;
  type?: CounterpartType;
  pagination_token?: string;
  is_customer?: boolean;
  is_vendor?: boolean;
}

export class CounterpartMockBuilder {
  page: number = 0;
  limit: number = 3;
  sort: CounterpartCursorFields | undefined;
  order: GetRequest['order'] = OrderEnum.ASC;

  data: Array<QConterpartResponse> = counterpartListFixture;

  withPage(
    page: number
  ): Pick<CounterpartMockBuilder, 'withOrder' | 'withLimit'> {
    this.page = page;

    return this;
  }

  withLimit(
    limit: number
  ): Pick<CounterpartMockBuilder, 'withOrder' | 'withSearch'> {
    this.limit = limit;

    return this;
  }

  withSort(
    sort: CounterpartCursorFields | undefined
  ): Pick<CounterpartMockBuilder, 'build'> {
    if (!sort) {
      return this;
    }

    this.data = this.data.sort((left, right) => {
      let rightComparisonField = undefined;
      let leftComparisonField = undefined;

      if ('individual' in right) {
        rightComparisonField = right.individual.first_name;
      } else {
        rightComparisonField = right.organization.legal_name;
      }

      if ('individual' in left) {
        leftComparisonField = left.individual.first_name;
      } else {
        leftComparisonField = left.organization.legal_name;
      }

      if (this.order === OrderEnum.DESC) {
        return rightComparisonField.localeCompare(leftComparisonField);
      } else {
        return leftComparisonField.localeCompare(rightComparisonField);
      }
    });

    return this;
  }

  withOrder(
    order: GetRequest['order']
  ): Pick<CounterpartMockBuilder, 'withSearch'> {
    this.order = order;

    return this;
  }

  withSearch(
    search: string | undefined
  ): Pick<CounterpartMockBuilder, 'withType' | 'withFilter'> {
    if (!search) {
      return this;
    }

    this.data = this.data.filter((counterpart) => {
      if ('individual' in counterpart) {
        return (
          counterpart.individual.first_name.startsWith(search) ||
          counterpart.individual.last_name.startsWith(search)
        );
      } else {
        return counterpart.organization.legal_name.startsWith(search);
      }
    });

    return this;
  }

  withFilter(): Pick<CounterpartMockBuilder, 'withSort'> {
    this.data = this.data.slice(
      this.page * this.limit,
      (this.page + 1) * this.limit
    );

    return this;
  }

  withType(
    type: CounterpartType | undefined
  ): Pick<CounterpartMockBuilder, 'withFilter' | 'withSubType'> {
    if (!type) {
      return this;
    }

    this.data = this.data.filter((counterpart) => counterpart.type === type);

    return this;
  }

  /**
   * Set and apply sub type for counterpart.
   * Sub type might be an individual or organization
   */
  withSubType(
    is_vendor: boolean,
    is_customer: boolean
  ): Pick<CounterpartMockBuilder, 'withFilter'> {
    this.data = this.data.filter((counterpart) => {
      if ('organization' in counterpart) {
        return (
          counterpart.organization.is_vendor === is_vendor ||
          counterpart.organization.is_customer === is_customer
        );
      } else {
        return (
          counterpart.individual.is_vendor === is_vendor ||
          counterpart.individual.is_customer === is_customer
        );
      }
    });

    return this;
  }

  build(): Array<QConterpartResponse> {
    return this.data;
  }
}
