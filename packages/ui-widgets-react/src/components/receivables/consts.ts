import { ReceivablesStatusEnum } from '@team-monite/sdk-api';
import { TagColorType } from '@team-monite/ui-kit-react';

export const ROW_TO_TAG_STATUS_MAP: Record<
  ReceivablesStatusEnum,
  TagColorType
> = {
  [ReceivablesStatusEnum.DRAFT]: 'secondary',
  [ReceivablesStatusEnum.ISSUED]: 'success',
  [ReceivablesStatusEnum.ACCEPTED]: 'success',
  [ReceivablesStatusEnum.PARTIALLY_PAID]: 'warning',
  [ReceivablesStatusEnum.PAID]: 'success',
  [ReceivablesStatusEnum.EXPIRED]: 'error',
  [ReceivablesStatusEnum.UNCOLLECTIBLE]: 'error',
  [ReceivablesStatusEnum.CANCELED]: 'error',
  [ReceivablesStatusEnum.DELETED]: 'secondary',
  [ReceivablesStatusEnum.RECURRING]: 'special',
};
