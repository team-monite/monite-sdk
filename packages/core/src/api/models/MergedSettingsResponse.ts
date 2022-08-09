/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencySettings } from './CurrencySettings';
import type { PayableSettings } from './PayableSettings';
import type { PaymentPriorityEnum } from './PaymentPriorityEnum';
import type { ReceivableSettings } from './ReceivableSettings';
import type { RemindersSettings } from './RemindersSettings';
import type { TemplateSettings } from './TemplateSettings';
import type { Unit } from './Unit';

export type MergedSettingsResponse = {
    currency?: CurrencySettings;
    reminder?: RemindersSettings;
    template?: TemplateSettings;
    /**
     * Payment preferences for entity to automate calculating suggested payment date basing on paymentterms and entity preferences
     */
    payment_priority?: PaymentPriorityEnum;
    payable?: PayableSettings;
    receivable?: ReceivableSettings;
    commercial_conditions?: Array<string>;
    units?: Array<Unit>;
    website?: string;
};

