import { api__v1__tags__pagination__CursorFields } from '@team-monite/sdk-api';
import { SortOrderEnum } from '@team-monite/ui-kit-react';

export type Sort = {
  sort: api__v1__tags__pagination__CursorFields;
  order: SortOrderEnum;
};
