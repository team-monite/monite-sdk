/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AccountingSettingsResponse } from './AccountingSettingsResponse';
import type { APIVersion } from './APIVersion';
import type { CurrencySettings } from './CurrencySettings';
import type { EInvoicingSettingsResponse } from './EInvoicingSettingsResponse';
import type { MailSettingsResponse } from './MailSettingsResponse';
import type { PayableSettingsResponse } from './PayableSettingsResponse';
import type { PaymentPriorityEnum } from './PaymentPriorityEnum';
import type { PaymentsSettingsResponse } from './PaymentsSettingsResponse';
import type { ReceivableEditFlow } from './ReceivableEditFlow';
import type { ReceivableSettingsResponse } from './ReceivableSettingsResponse';
import type { RemindersSettings } from './RemindersSettings';
import type { Unit } from './Unit';

export type MergedSettingsResponse = {
  /**
   * Settings for the accounting module.
   */
  accounting?: AccountingSettingsResponse;
  /**
   * Default API version for partner.
   */
  api_version?: APIVersion;
  /**
   * Commercial conditions for receivables.
   */
  commercial_conditions?: Array<string>;
  /**
   * Custom currency exchange rates.
   */
  currency?: CurrencySettings;
  /**
   * A default role to provision upon new entity creation.
   */
  default_role?: Record<string, any>;
  /**
   * Settings for the e-invoicing module.
   */
  einvoicing?: EInvoicingSettingsResponse;
  /**
   * Settings for email and mailboxes.
   */
  mail?: MailSettingsResponse;
  /**
   * Settings for the payables module.
   */
  payable?: PayableSettingsResponse;
  /**
   * Payment preferences for entity to automate calculating suggested payment date basing on payment terms and entity preferences
   */
  payment_priority?: PaymentPriorityEnum;
  /**
   * Settings for the payments module.
   */
  payments?: PaymentsSettingsResponse;
  /**
   * Settings for the receivables module.
   */
  receivable?: ReceivableSettingsResponse;
  receivable_edit_flow?: ReceivableEditFlow;
  reminder?: RemindersSettings;
  /**
   * Measurement units.
   */
  units?: Array<Unit>;
  website?: string;
};
