import { CursorFieldsWorkflows } from '@team-monite/sdk-api';
import { SortOrderEnum } from '@team-monite/ui-kit-react';

export type Sort = {
  sort: CursorFieldsWorkflows;
  order: SortOrderEnum;
};
