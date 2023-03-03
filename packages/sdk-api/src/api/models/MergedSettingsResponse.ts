/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { PayableSettings } from './PayableSettings';
import type { PaymentPriorityEnum } from './PaymentPriorityEnum';
import type { PaymentsSettingsPayload } from './PaymentsSettingsPayload';
import type { ReceivableEditFlow } from './ReceivableEditFlow';
import type { ReceivableSettings } from './ReceivableSettings';
import type { RemindersSettings } from './RemindersSettings';
import type { RolesCreatePayload } from './RolesCreatePayload';
import type { TemplateSettings } from './TemplateSettings';
import type { Unit } from './Unit';

export type MergedSettingsResponse = {
    /**
     * Custom currency exchange rates.
     */
    currency?: CurrencySettings;
    reminder?: RemindersSettings;
    template?: TemplateSettings;
    /**
     * Payment preferences for entity to automate calculating suggested payment date basing on payment terms and entity preferences
     */
    payment_priority?: PaymentPriorityEnum;
    receivable_edit_flow?: ReceivableEditFlow;
    /**
     * Settings for the payables module.
     */
    payable?: PayableSettings;
    /**
     * Settings for the receivables module.
     */
    receivable?: ReceivableSettings;
    /**
     * Commercial conditions for receivables.
     */
    commercial_conditions?: Array<string>;
    /**
     * Measurement units.
     */
    units?: Array<Unit>;
    website?: string;
    /**
     * A default role to provision upon new entity creation.
     */
    default_role?: RolesCreatePayload;
    /**
     * Settings for the payments module.
     */
    payments?: PaymentsSettingsPayload;
};

