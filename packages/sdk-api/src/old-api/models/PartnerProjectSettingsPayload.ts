/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AccountingSettingsPayload } from './AccountingSettingsPayload';
import type { APIVersion } from './APIVersion';
import type { CurrencySettings } from './CurrencySettings';
import type { EInvoicingSettingsPayload } from './EInvoicingSettingsPayload';
import type { MailSettingsPayload } from './MailSettingsPayload';
import type { PayableSettingsPayload } from './PayableSettingsPayload';
import type { PaymentsSettingsPayload } from './PaymentsSettingsPayload';
import type { ReceivableSettingsPayload } from './ReceivableSettingsPayload';
import type { Unit } from './Unit';

export type PartnerProjectSettingsPayload = {
  /**
   * Settings for the accounting module.
   */
  accounting?: AccountingSettingsPayload;
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
  einvoicing?: EInvoicingSettingsPayload;
  /**
   * Settings for email and mailboxes.
   */
  mail?: MailSettingsPayload;
  /**
   * Settings for the payables module.
   */
  payable?: PayableSettingsPayload;
  /**
   * Settings for the payments module.
   */
  payments?: PaymentsSettingsPayload;
  /**
   * Settings for the receivables module.
   */
  receivable?: ReceivableSettingsPayload;
  /**
   * Measurement units.
   */
  units?: Array<Unit>;
  website?: string;
};
