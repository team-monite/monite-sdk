import {
  api__v1__payables__pagination__CursorFields,
  OrderEnum,
} from '@monite/js-sdk';

export type PaginationTokens = {
  next_pagination_token: string | null | undefined;
  prev_pagination_token: string | null | undefined;
};

export type Sort = {
  sort: api__v1__payables__pagination__CursorFields;
  order: OrderEnum;
};
