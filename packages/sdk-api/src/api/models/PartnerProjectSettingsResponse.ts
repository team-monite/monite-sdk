/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AccountingSettingsResponse } from './AccountingSettingsResponse';
import type { APIVersion } from './APIVersion';
import type { CurrencySettings } from './CurrencySettings';
import type { EInvoicingSettingsResponse } from './EInvoicingSettingsResponse';
import type { MailSettingsResponse } from './MailSettingsResponse';
import type { PayableSettingsResponse } from './PayableSettingsResponse';
import type { PaymentsSettingsResponse } from './PaymentsSettingsResponse';
import type { ReceivableSettingsResponse } from './ReceivableSettingsResponse';
import type { Unit } from './Unit';

export type PartnerProjectSettingsResponse = {
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
   * Settings for the payments module.
   */
  payments?: PaymentsSettingsResponse;
  /**
   * Settings for the receivables module.
   */
  receivable?: ReceivableSettingsResponse;
  /**
   * Measurement units.
   */
  units?: Array<Unit>;
  website?: string;
};
