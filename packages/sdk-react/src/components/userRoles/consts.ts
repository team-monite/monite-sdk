import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const FILTER_TYPE_SEARCH = 'search';
export const FILTER_TYPE_CREATED_AT = 'created_at';

/**
 * An object that maps action names to their order of appearance in the UI.
 * This constant guarantees a consistent order of available actions in the UI.
 */
export const actionOrder = {
  read: 1,
  create: 2,
  update: 3,
  delete: 4,
  submit: 5,
  approve: 6,
  pay: 7,
  create_from_mail: 8,
  cancel: 9,
  reopen: 10,
};

export const getPermissionToLabelMap = (i18n: I18n) => ({
  approval_policy: t(i18n)`Approval policy`,
  approval_request: t(i18n)`Approval request`,
  comment: t(i18n)`Comment`,
  counterpart_vat_id: t(i18n)`Counterpart VAT ID`,
  counterpart: t(i18n)`Counterpart`,
  entity_bank_account: t(i18n)`Entity bank account`,
  entity_user: t(i18n)`Entity user`,
  entity_vat_ids: t(i18n)`Entity VAT IDs`,
  entity: t(i18n)`Entity`,
  export: t(i18n)`Export`,
  mailbox: t(i18n)`Mailbox`,
  onboarding: t(i18n)`Onboarding`,
  overdue_reminder: t(i18n)`Overdue reminder`,
  payable: t(i18n)`Payable`,
  payables_purchase_order: t(i18n)`Payables purchase order`,
  payment_record: t(i18n)`Payment record`,
  payment_reminder: t(i18n)`Payment reminder`,
  person: t(i18n)`Person`,
  product: t(i18n)`Product`,
  project: t(i18n)`Project`,
  receivable: t(i18n)`Receivable`,
  reconciliation: t(i18n)`Reconciliation`,
  role: t(i18n)`Role`,
  tag: t(i18n)`Tag`,
  todo_task_mute: t(i18n)`Todo task mute`,
  todo_task: t(i18n)`Todo task`,
  transaction: t(i18n)`Transaction`,
  workflow: t(i18n)`Workflow`,
});

export const ACTION_TO_LATTER_MAP = {
  read: 'R',
  create: 'C',
  update: 'U',
  delete: 'D',
  submit: 'S',
  approve: 'A',
  pay: 'P',
  create_from_mail: 'M',
  cancel: 'X',
  reopen: 'O',
};

export const getActionToLabelMap = (i18n: I18n) => ({
  read: t(i18n)`View`,
  create: t(i18n)`Create`,
  update: t(i18n)`Edit`,
  delete: t(i18n)`Delete`,
  submit: t(i18n)`Submit`,
  approve: t(i18n)`Approve`,
  pay: t(i18n)`Pay`,
  create_from_mail: t(i18n)`Create from email`,
  cancel: t(i18n)`Cancel`,
  reopen: t(i18n)`Reopen`,
});
