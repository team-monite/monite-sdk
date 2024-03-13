import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { ActionEnum, PayableActionEnum } from '@monite/sdk-api';

export const ROLES_PAGE_LIMIT = 5;

export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_CREATED_AT = 'created_at';

export const actionOrder = {
  [ActionEnum.READ]: 1,
  [ActionEnum.CREATE]: 2,
  [ActionEnum.UPDATE]: 3,
  [ActionEnum.DELETE]: 4,
  [PayableActionEnum.SUBMIT]: 5,
  [PayableActionEnum.APPROVE]: 6,
  [PayableActionEnum.PAY]: 7,
  [PayableActionEnum.CREATE_FROM_MAIL]: 8,
  [PayableActionEnum.CANCEL]: 9,
  [PayableActionEnum.REOPEN]: 10,
};

export const getPermissionToLabelMap = (i18n: I18n) => ({
  person: t(i18n)`Person`,
  onboarding: t(i18n)`Onboarding`,
  comment: t(i18n)`Comment`,
  counterpart: t(i18n)`Counterpart`,
  entity_user: t(i18n)`Entity user`,
  entity: t(i18n)`Entity`,
  entity_vat_ids: t(i18n)`Entity VAT IDs`,
  counterpart_vat_id: t(i18n)`Counterpart VAT ID`,
  entity_bank_account: t(i18n)`Entity bank account`,
  export: t(i18n)`Export`,
  payables_purchase_order: t(i18n)`Payables purchase order`,
  payment_reminder: t(i18n)`Payment reminder`,
  overdue_reminder: t(i18n)`Overdue reminder`,
  product: t(i18n)`Product`,
  receivable: t(i18n)`Receivable`,
  reconciliation: t(i18n)`Reconciliation`,
  role: t(i18n)`Role`,
  tag: t(i18n)`Tag`,
  todo_task: t(i18n)`Todo task`,
  todo_task_mute: t(i18n)`Todo task mute`,
  transaction: t(i18n)`Transaction`,
  workflow: t(i18n)`Workflow`,
  approval_request: t(i18n)`Approval request`,
  approval_policy: t(i18n)`Approval policy`,
  payment_record: t(i18n)`Payment record`,
  payable: t(i18n)`Payable`,
});

export const ACTION_TO_LATTER_MAP = {
  [ActionEnum.READ]: 'R',
  [ActionEnum.CREATE]: 'C',
  [ActionEnum.UPDATE]: 'U',
  [ActionEnum.DELETE]: 'D',
  [PayableActionEnum.SUBMIT]: 'S',
  [PayableActionEnum.APPROVE]: 'A',
  [PayableActionEnum.PAY]: 'P',
  [PayableActionEnum.CREATE_FROM_MAIL]: 'M',
  [PayableActionEnum.CANCEL]: 'X',
  [PayableActionEnum.REOPEN]: 'O',
};

export const getActionToLabelMap = (i18n: I18n) => ({
  [ActionEnum.READ]: t(i18n)`Read`,
  [ActionEnum.CREATE]: t(i18n)`Create`,
  [ActionEnum.UPDATE]: t(i18n)`Update`,
  [ActionEnum.DELETE]: t(i18n)`Delete`,
  [PayableActionEnum.SUBMIT]: t(i18n)`Submit`,
  [PayableActionEnum.APPROVE]: t(i18n)`Approve`,
  [PayableActionEnum.PAY]: t(i18n)`Pay`,
  [PayableActionEnum.CREATE_FROM_MAIL]: t(i18n)`Create from mail`,
  [PayableActionEnum.CANCEL]: t(i18n)`Cancel`,
  [PayableActionEnum.REOPEN]: t(i18n)`Reopen`,
});
