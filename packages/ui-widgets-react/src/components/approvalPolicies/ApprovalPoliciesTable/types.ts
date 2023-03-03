import { WorkflowCursorFields } from '@team-monite/sdk-api';
import { SortOrderEnum } from '@team-monite/ui-kit-react';

export type Sort = {
  sort: WorkflowCursorFields;
  order: SortOrderEnum;
};
