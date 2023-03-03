import { TagCursorFields } from '@team-monite/sdk-api';
import { SortOrderEnum } from '@team-monite/ui-kit-react';

export type Sort = {
  sort: TagCursorFields;
  order: SortOrderEnum;
};
