import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { components } from '@monite/sdk-api/src/api';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { ChipTypeMap, type SvgIcon } from '@mui/material';

export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_CREATED_AT = 'created_at';
export const FILTER_TYPE_CREATED_BY = 'created_by';

export const ROW_TO_STATUS_MUI_MAP: {
  [key in components['schemas']['ApprovalPolicyStatus']]: ChipTypeMap['props']['color'];
} = {
  active: 'success',
  deleted: 'error',
  pending: 'warning',
};

export const getRowToStatusTextMap = (
  i18n: I18n
): {
  [key in components['schemas']['ApprovalPolicyStatus']]: string;
} => ({
  active: t(i18n)`Active`,
  deleted: t(i18n)`Deleted`,
  pending: t(i18n)`Pending`,
});

export const APPROVAL_STATUS_TO_MUI_ICON_MAP: Record<
  components['schemas']['ApprovalPolicyStatus'],
  typeof SvgIcon
> = {
  active: PaidOutlinedIcon,
  deleted: CancelIcon,
  pending: HourglassEmptyIcon,
};
